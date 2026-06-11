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
  const id = typeof body?.id === "string" ? body.id.slice(0, 64) : "";
  const priceXaf = Number(body?.priceXaf);
  const isActive = typeof body?.isActive === "boolean" ? body.isActive : undefined;

  if (!id) {
    return NextResponse.json({ error: "Pack invalide." }, { status: 400 });
  }

  if (!Number.isInteger(priceXaf) || priceXaf < 0) {
    return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
  }

  const update: { price_xaf: number; is_active?: boolean } = { price_xaf: priceXaf };
  if (typeof isActive === "boolean") {
    update.is_active = isActive;
  }

  const { data, error } = await supabase
    .from("ai_credit_packs")
    .update(update)
    .eq("id", id)
    .select("id,name,credits,price_xaf,sort_order,is_active,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Mise à jour du pack impossible." }, { status: 500 });
  }

  return NextResponse.json({ pack: data });
}
