import "server-only";

export type PawaPayPaymentPagePayload = {
  depositId: string;
  returnUrl: string;
  amountXaf: number;
  phoneNumber?: string;
  reason: string;
  metadata?: Array<Record<string, unknown>>;
};

export type PawaPayPaymentPageResult = {
  redirectUrl: string;
  raw: Record<string, unknown>;
};

export type PawaPayDepositStatus = {
  status: string;
  raw: Record<string, unknown>;
};

export class PawaPayApiError extends Error {
  constructor(
    message: string,
    public readonly raw: Record<string, unknown>,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "PawaPayApiError";
  }
}

const COMPLETED_STATUS = "COMPLETED";

export function isPawaPayCompleted(status?: string | null) {
  return status?.toUpperCase() === COMPLETED_STATUS;
}

export function isPawaPayTerminal(status?: string | null) {
  return ["COMPLETED", "FAILED", "REJECTED", "CANCELLED"].includes(status?.toUpperCase() ?? "");
}

export async function createPawaPayPaymentPage(payload: PawaPayPaymentPagePayload): Promise<PawaPayPaymentPageResult> {
  const response = await fetch(`${getPawaPayBaseUrl()}/v2/paymentpage`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      depositId: payload.depositId,
      returnUrl: payload.returnUrl,
      customerMessage: getCustomerMessage(),
      amountDetails: {
        amount: String(payload.amountXaf),
        currency: process.env.PAWAPAY_CURRENCY ?? "XAF"
      },
      phoneNumber: payload.phoneNumber ? normalizePhoneNumber(payload.phoneNumber) : undefined,
      language: "FR",
      country: process.env.PAWAPAY_COUNTRY ?? "CMR",
      reason: normalizeReason(payload.reason),
      metadata: payload.metadata ?? []
    })
  });

  const raw = await readJsonResponse(response);
  if (!response.ok) {
    throw new PawaPayApiError(
      readPawaPayError(raw) || "PawaPay n'a pas accepte la demande de paiement.",
      raw,
      response.status
    );
  }

  const redirectUrl = extractRedirectUrl(raw);
  if (!redirectUrl) {
    throw new PawaPayApiError(readPawaPayError(raw) || "PawaPay n'a pas renvoye de lien de paiement.", raw, response.status);
  }

  return { redirectUrl, raw };
}

export async function getPawaPayDepositStatus(depositId: string): Promise<PawaPayDepositStatus> {
  const response = await fetch(`${getPawaPayBaseUrl()}/v2/deposits/${depositId}`, {
    method: "GET",
    headers: buildHeaders(),
    cache: "no-store"
  });

  const raw = await readJsonResponse(response);
  if (!response.ok) {
    throw new PawaPayApiError(readPawaPayError(raw) || "Statut PawaPay indisponible.", raw, response.status);
  }

  const data = isRecord(raw.data) ? raw.data : raw;
  return {
    status: String(data.status ?? raw.status ?? "UNKNOWN").toUpperCase(),
    raw
  };
}

function getPawaPayBaseUrl() {
  return (process.env.PAWAPAY_API_BASE_URL || "https://api.pawapay.io").replace(/\/$/, "");
}

function buildHeaders() {
  const token = process.env.PAWAPAY_API_TOKEN;
  if (!token) {
    throw new Error("Token PawaPay manquant. Ajoutez PAWAPAY_API_TOKEN dans les variables serveur.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

function normalizePhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("237")) {
    return digits;
  }

  if (digits.length === 9 && digits.startsWith("6")) {
    return `237${digits}`;
  }

  return digits;
}

function getCustomerMessage() {
  const configured = process.env.PAWAPAY_CUSTOMER_MESSAGE ?? "JOS Travel";
  const cleaned = configured.replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

  if (cleaned.length >= 4) {
    return cleaned.slice(0, 22);
  }

  return "JOS Travel";
}

function normalizeReason(value: string) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  return (cleaned || "Paiement JOS Travel").slice(0, 50);
}

function extractRedirectUrl(raw: Record<string, unknown>) {
  const data = isRecord(raw.data) ? raw.data : raw;
  const value = data.redirectUrl ?? data.redirectURL ?? raw.redirectUrl ?? raw.redirectURL;
  return typeof value === "string" ? value : "";
}

function readPawaPayError(raw: Record<string, unknown>) {
  const failureReason = isRecord(raw.failureReason) ? raw.failureReason : null;
  const data = isRecord(raw.data) ? raw.data : null;
  const dataFailureReason = data && isRecord(data.failureReason) ? data.failureReason : null;
  const error = isRecord(raw.error) ? raw.error : null;
  const errors = Array.isArray(raw.errors) ? raw.errors : [];

  const candidates = [
    raw.message,
    raw.error,
    raw.errorMessage,
    raw.details,
    raw.description,
    failureReason?.failureMessage,
    failureReason?.failureCode,
    dataFailureReason?.failureMessage,
    dataFailureReason?.failureCode,
    error?.message,
    error?.code
  ];

  const message = candidates.find((candidate) => typeof candidate === "string" && candidate.trim());
  if (typeof message === "string") {
    return message;
  }

  const nestedMessages = errors
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (isRecord(item)) {
        return [item.message, item.code, item.details].find((value) => typeof value === "string" && value.trim());
      }
      return null;
    })
    .filter((item): item is string => Boolean(item));

  return nestedMessages.join(" | ");
}

async function readJsonResponse(response: Response) {
  const text = await response.text().catch(() => "");
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { body: text.slice(0, 1000) };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
