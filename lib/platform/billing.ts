import type { SupabaseClient } from "@supabase/supabase-js";
import { brand } from "@/lib/site-data";

export type BillingCycle = "monthly" | "annual";
export type ChatMode = "ai" | "human";
export type PaymentType = "subscription" | "ai_credit";
export type AiUsageType = "standard_message" | "complex_message" | "advanced_analysis";
export type AiCreditPackId = "starter" | "standard" | "premium" | "business" | "enterprise" | "corporate";

export type AiCreditPack = {
  id: string;
  name: string;
  credits: number;
  price_xaf: number;
  sort_order: number;
  is_active: boolean;
};

export type AiWallet = {
  id: boolean;
  total_purchased: number;
  total_consumed: number;
  remaining_credits: number;
  updated_at: string;
};

export const AI_CREDIT_UNIT_LABEL = "AI_CREDIT";

export const FALLBACK_AI_CREDIT_PACKS: AiCreditPack[] = [
  { id: "starter", name: "Pack Starter", credits: 1000, price_xaf: 1000, sort_order: 10, is_active: true },
  { id: "standard", name: "Pack Standard", credits: 5000, price_xaf: 4500, sort_order: 20, is_active: true },
  { id: "premium", name: "Pack Premium", credits: 10000, price_xaf: 8000, sort_order: 30, is_active: true },
  { id: "business", name: "Pack Business", credits: 20000, price_xaf: 15000, sort_order: 40, is_active: true },
  { id: "enterprise", name: "Pack Enterprise", credits: 50000, price_xaf: 35000, sort_order: 50, is_active: true },
  { id: "corporate", name: "Pack Corporate", credits: 100000, price_xaf: 65000, sort_order: 60, is_active: true }
];

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

export function getFallbackAiCreditPack(packId: string | null | undefined) {
  return FALLBACK_AI_CREDIT_PACKS.find((pack) => pack.id === packId) ?? FALLBACK_AI_CREDIT_PACKS[0];
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
    const pack = getPaymentPackInfo(payment);
    await applyAiCreditPurchase(supabase, {
      credits: pack.credits,
      packId: pack.packId,
      packName: pack.packName,
      paymentId: payment.id,
      actorId
    });
  }

  await supabase
    .from("payment_transactions")
    .update({ applied_at: new Date().toISOString(), status: "COMPLETED" })
    .eq("id", payment.id);
}

async function applyAiCreditPurchase(
  supabase: SupabaseClient,
  purchase: {
    credits: number;
    packId: string | null;
    packName: string;
    paymentId: string;
    actorId: string | null;
  }
) {
  if (purchase.credits <= 0) {
    return;
  }

  const { data: wallet } = await supabase
    .from("ai_wallet")
    .select("total_purchased,total_consumed,remaining_credits")
    .eq("id", true)
    .maybeSingle<{ total_purchased: number; total_consumed: number; remaining_credits: number }>();

  const currentPurchased = Number(wallet?.total_purchased ?? 0);
  const currentConsumed = Number(wallet?.total_consumed ?? 0);
  const totalPurchased = currentPurchased + purchase.credits;
  const balanceAfter = Math.max(0, totalPurchased - currentConsumed);

  await supabase.from("ai_wallet").upsert({
    id: true,
    total_purchased: totalPurchased,
    total_consumed: currentConsumed
  });

  await supabase.from("ai_wallet_transactions").insert({
    transaction_type: "purchase",
    amount: purchase.credits,
    balance_after: balanceAfter,
    pack_id: purchase.packId,
    payment_id: purchase.paymentId,
    reason: `Achat ${purchase.packName}`,
    metadata: {
      unit: AI_CREDIT_UNIT_LABEL
    },
    created_by: purchase.actorId
  });

  await supabase.from("ai_settings").update({ remaining_credits: balanceAfter }).eq("id", true);

  await supabase.from("ai_credit_events").insert({
    amount: purchase.credits,
    reason: `Achat ${purchase.packName}`,
    created_by: purchase.actorId
  });
}

function getPaymentPackInfo(payment: PaymentTransaction) {
  const metadata = payment.metadata ?? {};
  const packId = typeof metadata.pack_id === "string" ? metadata.pack_id : null;
  const packName = typeof metadata.pack_name === "string" ? metadata.pack_name : "Pack AI_CREDIT";
  const credits = normalizeIntegerLike(metadata.credits) ?? payment.credits ?? 0;

  return {
    packId,
    packName,
    credits
  };
}

function normalizeIntegerLike(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizePositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
