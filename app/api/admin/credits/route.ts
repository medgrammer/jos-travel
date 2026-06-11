import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import { AI_CREDIT_UNIT_LABEL } from "@/lib/platform/billing";
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
  const amount = Number(body?.amount ?? 0);
  const reason = String(body?.reason ?? "Ajustement manuel AI_CREDIT").slice(0, 160);

  if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 100000) {
    return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
  }

  const { data: wallet, error: currentError } = await supabase
    .from("ai_wallet")
    .select("total_purchased,total_consumed,remaining_credits")
    .eq("id", true)
    .maybeSingle();

  if (currentError) {
    return NextResponse.json({ error: "Portefeuille AI_CREDIT introuvable." }, { status: 500 });
  }

  const currentPurchased = Number(wallet?.total_purchased ?? 0);
  const currentConsumed = Number(wallet?.total_consumed ?? 0);
  const currentRemaining = Math.max(0, currentPurchased - currentConsumed);

  if (amount < 0 && Math.abs(amount) > currentRemaining) {
    return NextResponse.json({ error: "Ajustement supérieur au solde AI_CREDIT disponible." }, { status: 400 });
  }

  const nextPurchased = amount > 0 ? currentPurchased + amount : currentPurchased;
  const nextConsumed = amount < 0 ? currentConsumed + Math.abs(amount) : currentConsumed;
  const balanceAfter = Math.max(0, nextPurchased - nextConsumed);

  const { error: walletError } = await supabase.from("ai_wallet").upsert({
    id: true,
    total_purchased: nextPurchased,
    total_consumed: nextConsumed
  });

  if (walletError) {
    return NextResponse.json({ error: "Ajustement AI_CREDIT impossible." }, { status: 500 });
  }

  await supabase.from("ai_wallet_transactions").insert({
    transaction_type: "adjustment",
    amount,
    balance_after: balanceAfter,
    reason,
    metadata: {
      unit: AI_CREDIT_UNIT_LABEL,
      source: "manual_admin_adjustment"
    },
    created_by: adminUser.profile.id
  });

  const { data: settings, error: settingsError } = await supabase
    .from("ai_settings")
    .update({ remaining_credits: balanceAfter })
    .eq("id", true)
    .select("*")
    .single();

  if (settingsError) {
    return NextResponse.json({ error: "Synchronisation AI_CREDIT impossible." }, { status: 500 });
  }

  await supabase.from("ai_credit_events").insert({
    amount,
    reason,
    created_by: adminUser.profile.id
  });

  return NextResponse.json({ aiSettings: settings });
}
