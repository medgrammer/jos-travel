import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import {
  getAiCreditPaymentAmountXaf,
  getPublicSiteUrl,
  getSubscriptionAmountXaf,
  type BillingCycle,
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
  const credits = normalizeCredits(body?.credits);
  const phone = typeof body?.phone === "string" ? body.phone.slice(0, 32) : "";
  const depositId = crypto.randomUUID();
  const siteUrl = getPublicSiteUrl(request);
  const returnUrl = `${siteUrl}/paiement/${depositId}`;
  const amountXaf =
    paymentType === "subscription" ? getSubscriptionAmountXaf(billingCycle) : getAiCreditPaymentAmountXaf(credits);

  if (amountXaf <= 0) {
    return NextResponse.json({ error: "Montant de paiement invalide." }, { status: 400 });
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
      credits: paymentType === "ai_credit" ? credits : null,
      payer_phone: phone || null,
      return_url: returnUrl,
      metadata: {
        source: "admin_dashboard"
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
      reason: paymentType === "subscription" ? "Abonnement JOS-Travel" : "Recharge credit JOS-Travel",
      metadata: [
        { orderId: depositId },
        { type: paymentType }
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

function normalizeCredits(value: unknown) {
  const credits = Number(value);
  if (!Number.isInteger(credits) || credits < 1 || credits > 100000) {
    return 1;
  }

  return credits;
}
