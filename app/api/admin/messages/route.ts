import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const [messagesResult, unreadResult] = await Promise.all([
    supabase
      .from("contact_messages")
      .select(
        "id,full_name,email,country_name,country_code,dial_code,phone,full_phone,destination,service,message,status,created_at,read_at"
      )
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new")
  ]);

  if (messagesResult.error || unreadResult.error) {
    return NextResponse.json({ error: "Impossible de charger la messagerie." }, { status: 500 });
  }

  return NextResponse.json({
    messages: messagesResult.data ?? [],
    unreadCount: unreadResult.count ?? 0
  });
}

export async function PATCH(request: NextRequest) {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const status = body?.status === "archived" ? "archived" : "read";
  const readAt = status === "read" ? new Date().toISOString() : null;

  if (body?.markAll === true) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status, read_at: readAt })
      .eq("status", "new");

    if (error) {
      return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.length > 8)
    : [];

  if (!ids.length) {
    return NextResponse.json({ error: "Aucun message sélectionné." }, { status: 400 });
  }

  const { error } = await supabase
    .from("contact_messages")
    .update({ status, read_at: readAt })
    .in("id", ids);

  if (error) {
    return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
