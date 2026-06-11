import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/platform/auth";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type UsageLogRow = {
  id: string;
  user_id: string | null;
  session_id: string | null;
  conversation_id: string | null;
  usage_type: string;
  credits_used: number;
  message_count: number;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
};

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
    eventsResult,
    visitsResult,
    clicksResult,
    whatsappClicksResult,
    cloudSubscriptionResult,
    unreadMessagesResult,
    recentMessagesResult,
    aiWalletResult,
    aiPacksResult,
    aiWalletTransactionsResult,
    aiUsageCountResult,
    aiUsageRowsResult,
    profileMapResult
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
      .limit(8),
    supabase.from("site_events").select("id", { count: "exact", head: true }).eq("event_type", "visit"),
    supabase.from("site_events").select("id", { count: "exact", head: true }).eq("event_type", "click"),
    supabase.from("site_events").select("id", { count: "exact", head: true }).eq("event_type", "whatsapp_click"),
    supabase.from("cloud_subscription").select("*").eq("id", true).maybeSingle(),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("contact_messages")
      .select("id,full_name,email,country_name,full_phone,destination,service,message,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("ai_wallet").select("*").eq("id", true).maybeSingle(),
    supabase
      .from("ai_credit_packs")
      .select("id,name,credits,price_xaf,sort_order,is_active,updated_at")
      .order("sort_order", { ascending: true }),
    supabase
      .from("ai_wallet_transactions")
      .select("id,transaction_type,amount,balance_after,pack_id,reason,created_at")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase.from("ai_usage_logs").select("id", { count: "exact", head: true }),
    supabase
      .from("ai_usage_logs")
      .select("id,user_id,session_id,conversation_id,usage_type,credits_used,message_count,created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase.from("profiles").select("id,email,full_name").limit(1000)
  ]);

  if (
    usersResult.error ||
    settingsResult.error ||
    recentUsersResult.error ||
    eventsResult.error ||
    visitsResult.error ||
    clicksResult.error ||
    whatsappClicksResult.error ||
    cloudSubscriptionResult.error ||
    unreadMessagesResult.error ||
    recentMessagesResult.error ||
    aiWalletResult.error ||
    aiPacksResult.error ||
    aiWalletTransactionsResult.error ||
    aiUsageCountResult.error ||
    aiUsageRowsResult.error ||
    profileMapResult.error
  ) {
    return NextResponse.json({ error: "Impossible de charger les données admin." }, { status: 500 });
  }

  const usageRows = (aiUsageRowsResult.data ?? []) as UsageLogRow[];
  const profiles = (profileMapResult.data ?? []) as ProfileRow[];

  return NextResponse.json({
    profile: adminUser.profile,
    userCount: usersResult.count ?? 0,
    analytics: {
      visits: visitsResult.count ?? 0,
      clicks: clicksResult.count ?? 0,
      whatsappClicks: whatsappClicksResult.count ?? 0
    },
    cloudSubscription: cloudSubscriptionResult.data,
    aiSettings: settingsResult.data,
    aiWallet: aiWalletResult.data,
    aiCreditPacks: aiPacksResult.data ?? [],
    aiWalletTransactions: aiWalletTransactionsResult.data ?? [],
    aiUsageSummary: buildUsageSummary(usageRows, profiles, aiUsageCountResult.count ?? usageRows.length),
    recentUsers: recentUsersResult.data ?? [],
    creditEvents: eventsResult.data ?? [],
    unreadContactMessages: unreadMessagesResult.count ?? 0,
    recentContactMessages: recentMessagesResult.data ?? []
  });
}

function buildUsageSummary(rows: UsageLogRow[], profiles: ProfileRow[], totalMessages: number) {
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const conversationIds = new Set<string>();
  const activeActors = new Set<string>();
  const byUser = new Map<string, { label: string; credits: number; messages: number }>();
  const byPeriod = new Map<string, number>();
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  for (const row of rows) {
    if (row.conversation_id) {
      conversationIds.add(row.conversation_id);
    }

    const rowDate = new Date(row.created_at);
    if (Number.isFinite(rowDate.getTime()) && rowDate.getTime() >= thirtyDaysAgo) {
      activeActors.add(row.user_id ?? row.session_id ?? row.conversation_id ?? row.id);
    }

    const profile = row.user_id ? profileById.get(row.user_id) : null;
    const userKey = row.user_id ?? row.session_id ?? "visitor";
    const label = profile?.full_name || profile?.email || (row.user_id ? "Utilisateur inscrit" : "Visiteur");
    const currentUser = byUser.get(userKey) ?? { label, credits: 0, messages: 0 };
    currentUser.credits += Number(row.credits_used ?? 0);
    currentUser.messages += Number(row.message_count ?? 1);
    byUser.set(userKey, currentUser);

    const periodKey = Number.isFinite(rowDate.getTime()) ? rowDate.toISOString().slice(0, 10) : "inconnu";
    byPeriod.set(periodKey, (byPeriod.get(periodKey) ?? 0) + Number(row.credits_used ?? 0));
  }

  return {
    conversations: conversationIds.size,
    messages: totalMessages,
    activeUsers: activeActors.size,
    consumptionByUser: Array.from(byUser.entries())
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 8),
    consumptionByPeriod: Array.from(byPeriod.entries())
      .map(([date, credits]) => ({ date, credits }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14),
    recentLogs: rows.slice(0, 8)
  };
}
