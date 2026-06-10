import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const amount = Number(body?.amount ?? 0);
  const reason = String(body?.reason ?? "Recharge manuelle").slice(0, 160);

  if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > 100000) {
    return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
  }

  const { data: current, error: currentError } = await supabase
    .from("ai_settings")
    .select("monthly_credits,remaining_credits")
    .eq("id", true)
    .maybeSingle();

  if (currentError || !current) {
    return NextResponse.json({ error: "Paramètres IA introuvables." }, { status: 500 });
  }

  const nextCredits = Math.max(0, Number(current.remaining_credits) + amount);
  const { data: settings, error: updateError } = await supabase
    .from("ai_settings")
    .update({ remaining_credits: nextCredits })
    .eq("id", true)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Recharge impossible." }, { status: 500 });
  }

  await supabase.from("ai_credit_events").insert({
    amount,
    reason,
    created_by: adminUser.profile.id
  });

  return NextResponse.json({ aiSettings: settings });
}
