import { NextResponse } from "next/server";
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

  const [
    usersResult,
    settingsResult,
    recentUsersResult,
    eventsResult
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("ai_settings").select("*").eq("id", true).maybeSingle(),
    supabase
      .from("profiles")
      .select("id,email,full_name,phone,city,trip_interest,role,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("ai_credit_events")
      .select("id,amount,reason,created_at")
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  if (usersResult.error || settingsResult.error || recentUsersResult.error || eventsResult.error) {
    return NextResponse.json({ error: "Impossible de charger les données admin." }, { status: 500 });
  }

  return NextResponse.json({
    profile: adminUser.profile,
    userCount: usersResult.count ?? 0,
    aiSettings: settingsResult.data,
    recentUsers: recentUsersResult.data ?? [],
    creditEvents: eventsResult.data ?? []
  });
}
