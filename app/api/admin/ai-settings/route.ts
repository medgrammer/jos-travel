import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const standard = normalizeRule(body?.standardMessageCredits);
  const complex = normalizeRule(body?.complexMessageCredits);
  const advanced = normalizeRule(body?.advancedAnalysisCredits);

  if (!standard || !complex || !advanced) {
    return NextResponse.json({ error: "Seuils AI_CREDIT invalides." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ai_settings")
    .update({
      standard_message_credits: standard,
      complex_message_credits: complex,
      advanced_analysis_credits: advanced
    })
    .eq("id", true)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Configuration AI_CREDIT impossible." }, { status: 500 });
  }

  return NextResponse.json({ aiSettings: data });
}

function normalizeRule(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 100000 ? parsed : null;
}
