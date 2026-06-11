import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import type { ChatMode } from "@/lib/platform/billing";
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
  const chatMode = normalizeChatMode(body?.chatMode);
  if (!chatMode) {
    return NextResponse.json({ error: "Mode de chat invalide." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ai_settings")
    .update({ chat_mode: chatMode })
    .eq("id", true)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Configuration du chat impossible." }, { status: 500 });
  }

  return NextResponse.json({ aiSettings: data });
}

function normalizeChatMode(value: unknown): ChatMode | null {
  return value === "ai" || value === "human" ? value : null;
}
