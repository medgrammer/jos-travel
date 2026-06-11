import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import {
  getFallbackAiCreditPack,
  getPublicSiteUrl,
  getSubscriptionQuoteXaf,
  type BillingCycle,
  type AiCreditPack,
  type PaymentType
} from "@/lib/platform/billing";
import { createPawaPayPaymentPage } from "@/lib/pawapay";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const paymentType = normalizePaymentType(body?.type);
  if (!paymentType) {
    return NextResponse.json({ error: "Type de paiement invalide." }, { status: 400 });
  }

  const billingCycle = normalizeBillingCycle(body?.billingCycle);
  const packId = normalizePackId(body?.packId);
  const pack = paymentType === "ai_credit" ? await getAiCreditPack(supabase, packId) : null;
  const subscriptionQuote = paymentType === "subscription" ? await getSubscriptionQuoteXaf(billingCycle) : null;
  const credits = paymentType === "ai_credit" ? pack?.credits ?? 0 : null;
  const phone = typeof body?.phone === "string" ? body.phone.slice(0, 32) : "";
  const depositId = crypto.randomUUID();
  const siteUrl = getPublicSiteUrl(request);
  const returnUrl = `${siteUrl}/paiement/${depositId}`;
  const amountXaf = paymentType === "subscription" ? subscriptionQuote?.amountXaf ?? 0 : pack?.price_xaf ?? 0;

  if (amountXaf <= 0) {
    return NextResponse.json({ error: "Montant de paiement invalide." }, { status: 400 });
  }

  if (paymentType === "ai_credit" && (!pack || !credits)) {
    return NextResponse.json({ error: "Pack AI_CREDIT invalide ou inactif." }, { status: 400 });
  }

  const { data: payment, error: insertError } = await supabase
    .from("payment_transactions")
    .insert({
      provider: "pawapay",
      deposit_id: depositId,
      payment_type: paymentType,
      status: "pending",
      amount_xaf: amountXaf,
      currency: "XAF",
      billing_cycle: paymentType === "subscription" ? billingCycle : null,
      credits,
      payer_phone: phone || null,
      return_url: returnUrl,
      metadata:
        paymentType === "subscription"
          ? {
              source: "admin_dashboard",
              subscription_price_usd: subscriptionQuote?.priceUsd ?? null,
              usd_to_xaf_rate: subscriptionQuote?.usdToXafRate ?? null,
              rate_source: subscriptionQuote?.rateSource ?? null,
              rate_date: subscriptionQuote?.rateDate ?? null,
              converted_at: subscriptionQuote?.convertedAt ?? null
            }
          : {
              source: "admin_dashboard",
              unit: "AI_CREDIT",
              pack_id: pack?.id ?? null,
              pack_name: pack?.name ?? null,
              credits
            },
      created_by: adminUser.profile.id
    })
    .select("*")
    .single();

  if (insertError || !payment) {
    return NextResponse.json({ error: "Impossible de préparer le paiement." }, { status: 500 });
  }

  try {
    const result = await createPawaPayPaymentPage({
      depositId,
      returnUrl,
      amountXaf,
      phoneNumber: phone,
      reason:
        paymentType === "subscription"
          ? `Abonnement JOS-Travel ${formatUsd(subscriptionQuote?.priceUsd ?? 0)}`
          : `Achat ${pack?.name ?? "pack AI_CREDIT"}`,
      metadata: [
        { orderId: depositId },
        { type: paymentType },
        ...(subscriptionQuote ? [{ priceUsd: String(subscriptionQuote.priceUsd) }, { fx: String(subscriptionQuote.usdToXafRate) }] : []),
        ...(pack ? [{ packId: pack.id }] : [])
      ]
    });

    await supabase
      .from("payment_transactions")
      .update({
        status: "payment_page_created",
        payment_url: result.redirectUrl,
        provider_response: result.raw
      })
      .eq("id", payment.id);

    return NextResponse.json({
      depositId,
      trackingUrl: `/paiement/${depositId}`,
      paymentUrl: result.redirectUrl
    });
  } catch (error) {
    await supabase
      .from("payment_transactions")
      .update({
        status: "failed_to_start",
        provider_response: {
          message: error instanceof Error ? error.message : "Erreur PawaPay"
        }
      })
      .eq("id", payment.id);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Paiement PawaPay impossible." },
      { status: 502 }
    );
  }
}

function normalizePaymentType(value: unknown): PaymentType | null {
  return value === "subscription" || value === "ai_credit" ? value : null;
}

function normalizeBillingCycle(value: unknown): BillingCycle {
  return value === "annual" ? "annual" : "monthly";
}

function normalizePackId(value: unknown) {
  return typeof value === "string" ? value.slice(0, 64) : "starter";
}

function formatUsd(value: number) {
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2
  }).format(value)}`;
}

async function getAiCreditPack(
  supabase: ReturnType<typeof createAdminClient>,
  packId: string
): Promise<AiCreditPack | null> {
  if (!supabase) {
    return getFallbackAiCreditPack(packId);
  }

  const { data, error } = await supabase
    .from("ai_credit_packs")
    .select("id,name,credits,price_xaf,sort_order,is_active")
    .eq("id", packId)
    .eq("is_active", true)
    .maybeSingle<AiCreditPack>();

  if (error) {
    return getFallbackAiCreditPack(packId);
  }

  return data;
}
