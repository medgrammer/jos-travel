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
      customerMessage: "JOS-Travel",
      amountDetails: {
        amount: String(payload.amountXaf),
        currency: process.env.PAWAPAY_CURRENCY ?? "XAF"
      },
      phoneNumber: payload.phoneNumber ? normalizePhoneNumber(payload.phoneNumber) : undefined,
      language: "FR",
      country: process.env.PAWAPAY_COUNTRY ?? "CMR",
      reason: payload.reason.slice(0, 120),
      metadata: payload.metadata ?? []
    })
  });

  const raw = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(readPawaPayError(raw) || "PawaPay n'a pas accepte la demande de paiement.");
  }

  const redirectUrl = extractRedirectUrl(raw);
  if (!redirectUrl) {
    throw new Error("PawaPay n'a pas renvoye de lien de paiement.");
  }

  return { redirectUrl, raw };
}

export async function getPawaPayDepositStatus(depositId: string): Promise<PawaPayDepositStatus> {
  const response = await fetch(`${getPawaPayBaseUrl()}/v2/deposits/${depositId}`, {
    method: "GET",
    headers: buildHeaders(),
    cache: "no-store"
  });

  const raw = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(readPawaPayError(raw) || "Statut PawaPay indisponible.");
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

function extractRedirectUrl(raw: Record<string, unknown>) {
  const data = isRecord(raw.data) ? raw.data : raw;
  const value = data.redirectUrl ?? data.redirectURL ?? raw.redirectUrl ?? raw.redirectURL;
  return typeof value === "string" ? value : "";
}

function readPawaPayError(raw: Record<string, unknown>) {
  const message = raw.message ?? raw.error ?? raw.details;
  return typeof message === "string" ? message : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
