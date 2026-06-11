import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import { applyCompletedPayment, type PaymentTransaction } from "@/lib/platform/billing";
import { getPawaPayDepositStatus, isPawaPayCompleted, isPawaPayTerminal } from "@/lib/pawapay";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ depositId: string }> }) {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const { depositId } = await context.params;
  const { data, error } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("deposit_id", depositId)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
  }

  let payment = data as PaymentTransaction;

  if (!payment.applied_at && !isPawaPayTerminal(payment.status)) {
    try {
      const status = await getPawaPayDepositStatus(depositId);
      const { data: updated } = await supabase
        .from("payment_transactions")
        .update({
          status: status.status,
          provider_response: status.raw
        })
        .eq("id", payment.id)
        .select("*")
        .single();

      payment = (updated as PaymentTransaction | null) ?? payment;
    } catch {
      // Keep returning the local state if PawaPay is temporarily unreachable.
    }
  }

  if (isPawaPayCompleted(payment.status) && !payment.applied_at) {
    await applyCompletedPayment(supabase, payment, adminUser.profile.id);
    const { data: refreshed } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("id", payment.id)
      .maybeSingle();
    payment = (refreshed as PaymentTransaction | null) ?? payment;
  }

  return NextResponse.json({ payment });
}
