import type { SupabaseClient } from "@supabase/supabase-js";
import { brand } from "@/lib/site-data";

export type BillingCycle = "monthly" | "annual";
export type ChatMode = "ai" | "human";
export type PaymentType = "subscription" | "ai_credit";

export type CloudSubscription = {
  id: boolean;
  provider: string | null;
  plan_name: string | null;
  status: string;
  expires_at: string | null;
  notes: string | null;
  billing_cycle?: BillingCycle | null;
  amount_xaf?: number | null;
  currency?: string | null;
  updated_at: string;
};

export type PaymentTransaction = {
  id: string;
  deposit_id: string;
  payment_type: PaymentType;
  status: string;
  amount_xaf: number;
  currency: string;
  billing_cycle: BillingCycle | null;
  credits: number | null;
  payer_phone: string | null;
  payment_url: string | null;
  return_url: string | null;
  provider_response: Record<string, unknown>;
  metadata: Record<string, unknown>;
  applied_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export function isCloudSubscriptionActive(subscription?: CloudSubscription | null) {
  if (!subscription) {
    return false;
  }

  const status = subscription.status?.toLowerCase().trim();
  if (status !== "active") {
    return false;
  }

  if (!subscription.expires_at) {
    return false;
  }

  const expiry = new Date(`${subscription.expires_at}T23:59:59`);
  return Number.isFinite(expiry.getTime()) && expiry.getTime() >= Date.now();
}

export function getSubscriptionAmountXaf(cycle: BillingCycle) {
  const key = cycle === "annual" ? "CLOUD_SUBSCRIPTION_ANNUAL_XAF" : "CLOUD_SUBSCRIPTION_MONTHLY_XAF";
  const fallback = cycle === "annual" ? 120000 : 12000;
  return normalizePositiveInteger(process.env[key], fallback);
}

export function getAiCreditUnitPriceXaf() {
  const estimatedRealCost = normalizePositiveInteger(process.env.OPENAI_REAL_COST_PER_RESPONSE_XAF, 10);
  const markup = normalizePositiveNumber(process.env.OPENAI_COST_MARKUP, 5);
  return Math.max(1, Math.ceil(estimatedRealCost * markup));
}

export function getAiCreditPaymentAmountXaf(credits: number) {
  return credits * getAiCreditUnitPriceXaf();
}

export function addBillingCycle(startDate: Date, cycle: BillingCycle) {
  const next = new Date(startDate);
  if (cycle === "annual") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

export function getPublicSiteUrl(request?: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return "http://localhost:3000";
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

export async function applyCompletedPayment(
  supabase: SupabaseClient,
  payment: PaymentTransaction,
  actorId: string | null
) {
  if (payment.applied_at) {
    return;
  }

  if (payment.payment_type === "subscription") {
    const cycle = payment.billing_cycle ?? "monthly";
    const expiresAt = addBillingCycle(new Date(), cycle).toISOString().slice(0, 10);

    await supabase
      .from("cloud_subscription")
      .update({
        provider: "Netlify / PawaPay",
        plan_name: cycle === "annual" ? "Abonnement annuel" : "Abonnement mensuel",
        status: "active",
        expires_at: expiresAt,
        billing_cycle: cycle,
        amount_xaf: payment.amount_xaf,
        currency: payment.currency,
        notes: "Paiement PawaPay confirme.",
        last_payment_id: payment.id
      })
      .eq("id", true);
  }

  if (payment.payment_type === "ai_credit" && payment.credits) {
    const { data } = await supabase
      .from("ai_settings")
      .select("remaining_credits")
      .eq("id", true)
      .maybeSingle<{ remaining_credits: number }>();

    const nextCredits = Number(data?.remaining_credits ?? 0) + payment.credits;

    await supabase.from("ai_settings").update({ remaining_credits: nextCredits }).eq("id", true);
    await supabase.from("ai_credit_events").insert({
      amount: payment.credits,
      reason: "Recharge PawaPay",
      created_by: actorId
    });
  }

  await supabase
    .from("payment_transactions")
    .update({ applied_at: new Date().toISOString(), status: "COMPLETED" })
    .eq("id", payment.id);
}

function normalizePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizePositiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
