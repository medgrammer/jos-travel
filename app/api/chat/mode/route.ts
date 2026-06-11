import { NextResponse } from "next/server";
import { buildWhatsAppUrl } from "@/lib/platform/billing";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ chatMode: "ai", availableCredits: true, whatsappUrl: defaultWhatsAppUrl() });
  }

  const { data } = await admin.from("ai_settings").select("chat_mode,remaining_credits").eq("id", true).maybeSingle();
  const chatMode = data?.chat_mode === "human" ? "human" : "ai";
  const remainingCredits = Number(data?.remaining_credits ?? 0);

  return NextResponse.json({
    chatMode,
    availableCredits: remainingCredits > 0,
    whatsappUrl: defaultWhatsAppUrl()
  });
}

function defaultWhatsAppUrl() {
  return buildWhatsAppUrl("Bonjour JOS-Travel, je souhaite echanger avec un conseiller.");
}
