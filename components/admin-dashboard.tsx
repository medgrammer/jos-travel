"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  Cloud,
  ExternalLink,
  History,
  Eye,
  Inbox,
  LoaderCircle,
  MailOpen,
  MessageCircle,
  MousePointerClick,
  PackageCheck,
  RefreshCw,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import { brand } from "@/lib/site-data";
import type { BillingCycle, ChatMode } from "@/lib/platform/billing";

type AdminStats = {
  userCount: number;
  unreadContactMessages: number;
  analytics: {
    visits: number;
    clicks: number;
    whatsappClicks: number;
  };
  cloudSubscription: {
    provider: string | null;
    plan_name: string | null;
    status: string;
    expires_at: string | null;
    notes: string | null;
    billing_cycle?: BillingCycle | null;
    amount_xaf?: number | null;
    currency?: string | null;
    updated_at: string;
  } | null;
  aiSettings: {
    monthly_credits: number;
    remaining_credits: number;
    standard_message_credits?: number;
    complex_message_credits?: number;
    advanced_analysis_credits?: number;
    chat_mode?: ChatMode;
    updated_at: string;
  } | null;
  aiWallet: AiWallet | null;
  aiCreditPacks: AiCreditPack[];
  aiWalletTransactions: AiWalletTransaction[];
  aiUsageSummary: AiUsageSummary;
  recentUsers: Array<{
    id: string;
    email: string | null;
    full_name: string | null;
    phone: string | null;
    city: string | null;
    trip_interest: string | null;
    role: "client" | "admin";
    created_at: string;
  }>;
  creditEvents: Array<{
    id: string;
    amount: number;
    reason: string;
    created_at: string;
  }>;
  recentContactMessages: ContactMessage[];
};

type AiWallet = {
  total_purchased: number;
  total_consumed: number;
  remaining_credits: number;
  updated_at: string;
};

type AiCreditPack = {
  id: string;
  name: string;
  credits: number;
  price_xaf: number;
  sort_order: number;
  is_active: boolean;
  updated_at?: string;
};

type AiWalletTransaction = {
  id: string;
  transaction_type: "purchase" | "consumption" | "adjustment" | "refund";
  amount: number;
  balance_after: number;
  pack_id: string | null;
  reason: string;
  created_at: string;
};

type AiUsageSummary = {
  conversations: number;
  messages: number;
  activeUsers: number;
  consumptionByUser: Array<{ id: string; label: string; credits: number; messages: number }>;
  consumptionByPeriod: Array<{ date: string; credits: number }>;
  recentLogs: Array<{
    id: string;
    usage_type: string;
    credits_used: number;
    message_count: number;
    created_at: string;
  }>;
};

type ContactMessage = {
  id: string;
  full_name: string;
  email: string | null;
  country_name: string;
  country_code?: string | null;
  dial_code?: string | null;
  phone?: string | null;
  full_phone: string;
  destination: string | null;
  service: string;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
  read_at?: string | null;
};

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedPackId, setSelectedPackId] = useState("starter");
  const [packDrafts, setPackDrafts] = useState<Record<string, string>>({});
  const [ruleDrafts, setRuleDrafts] = useState({
    standardMessageCredits: "10",
    complexMessageCredits: "20",
    advancedAnalysisCredits: "50"
  });
  const [creditPhone, setCreditPhone] = useState(defaultPaymentPhone());
  const [subscriptionPhone, setSubscriptionPhone] = useState(defaultPaymentPhone());
  const [subscriptionCycle, setSubscriptionCycle] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chatSaving, setChatSaving] = useState(false);
  const [packSavingId, setPackSavingId] = useState<string | null>(null);
  const [rulesSaving, setRulesSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/stats", { cache: "no-store" });
    const payload = await response.json().catch(() => null);

    if (response.ok) {
      const nextStats = payload as AdminStats;
      setStats(nextStats);
      setPackDrafts(Object.fromEntries(nextStats.aiCreditPacks.map((pack) => [pack.id, String(pack.price_xaf)])));
      setRuleDrafts({
        standardMessageCredits: String(nextStats.aiSettings?.standard_message_credits ?? 10),
        complexMessageCredits: String(nextStats.aiSettings?.complex_message_credits ?? 20),
        advancedAnalysisCredits: String(nextStats.aiSettings?.advanced_analysis_credits ?? 50)
      });
      setSelectedPackId((current) =>
        nextStats.aiCreditPacks.some((pack) => pack.id === current) ? current : nextStats.aiCreditPacks[0]?.id ?? "starter"
      );
      setMessage(null);
    } else {
      setMessage(payload?.error ?? "Chargement impossible.");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  async function handleRecharge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ai_credit", packId: selectedPackId, phone: creditPhone })
    });

    const payload = await response.json().catch(() => null);
    if (response.ok) {
      setMessage("Page de paiement ouverte. Les crédits seront ajoutés après confirmation PawaPay.");
      window.open(payload.trackingUrl, "_blank", "noopener,noreferrer");
    } else {
      setMessage(payload?.error ?? "Recharge impossible.");
    }

    setSaving(false);
  }

  async function handlePackSave(packId: string) {
    setPackSavingId(packId);
    setMessage(null);

    const response = await fetch("/api/admin/ai-packs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: packId, priceXaf: Number(packDrafts[packId]) })
    });

    const payload = await response.json().catch(() => null);
    if (response.ok) {
      setStats((state) =>
        state
          ? {
              ...state,
              aiCreditPacks: state.aiCreditPacks.map((pack) => (pack.id === packId ? payload.pack : pack))
            }
          : state
      );
      setMessage("Prix du pack AI_CREDIT mis à jour.");
    } else {
      setMessage(payload?.error ?? "Mise à jour du pack impossible.");
    }

    setPackSavingId(null);
  }

  async function handleRulesUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRulesSaving(true);
    setMessage(null);

    const response = await fetch("/api/admin/ai-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standardMessageCredits: Number(ruleDrafts.standardMessageCredits),
        complexMessageCredits: Number(ruleDrafts.complexMessageCredits),
        advancedAnalysisCredits: Number(ruleDrafts.advancedAnalysisCredits)
      })
    });

    const payload = await response.json().catch(() => null);
    if (response.ok) {
      setStats((state) =>
        state
          ? {
              ...state,
              aiSettings: payload.aiSettings
            }
          : state
      );
      setMessage("Seuils AI_CREDIT mis à jour.");
    } else {
      setMessage(payload?.error ?? "Configuration AI_CREDIT impossible.");
    }

    setRulesSaving(false);
  }

  async function handleSubscriptionPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "subscription",
        billingCycle: subscriptionCycle,
        phone: subscriptionPhone
      })
    });

    const payload = await response.json().catch(() => null);
    if (response.ok) {
      setMessage("Page de paiement ouverte. L'abonnement sera mis à jour après confirmation PawaPay.");
      window.open(payload.trackingUrl, "_blank", "noopener,noreferrer");
    } else {
      setMessage(payload?.error ?? "Paiement d'abonnement impossible.");
    }

    setSaving(false);
  }

  async function handleChatModeUpdate(chatMode: ChatMode) {
    setChatSaving(true);
    setMessage(null);

    const response = await fetch("/api/admin/chat-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatMode })
    });

    const payload = await response.json().catch(() => null);
    if (response.ok) {
      setStats((state) =>
        state
          ? {
              ...state,
              aiSettings: payload.aiSettings
            }
          : state
      );
      setMessage(chatMode === "ai" ? "Le chat est configure en mode IA." : "Le chat redirige maintenant vers WhatsApp.");
    } else {
      setMessage(payload?.error ?? "Configuration du chat impossible.");
    }

    setChatSaving(false);
  }

  async function openMailbox() {
    setMailboxOpen(true);
    await loadContactMessages();
  }

  async function loadContactMessages() {
    setMessagesLoading(true);
    const response = await fetch("/api/admin/messages", { cache: "no-store" });
    const payload = await response.json().catch(() => null);

    if (response.ok) {
      setContactMessages(payload.messages ?? []);
      setStats((state) =>
        state
          ? {
              ...state,
              unreadContactMessages: payload.unreadCount ?? 0,
              recentContactMessages: (payload.messages ?? []).slice(0, 5)
            }
          : state
      );
    } else {
      setMessage(payload?.error ?? "Impossible de charger la messagerie.");
    }

    setMessagesLoading(false);
  }

  async function markMessagesRead(ids: string[]) {
    if (!ids.length) {
      return;
    }

    const response = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status: "read" })
    });

    if (response.ok) {
      await loadContactMessages();
    }
  }

  async function markAllMessagesRead() {
    const response = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true, status: "read" })
    });

    if (response.ok) {
      await loadContactMessages();
    }
  }

  const cloudIsActive = stats ? isSubscriptionActive(stats.cloudSubscription) : false;
  const subscriptionActionLabel = cloudIsActive ? "Etendre l'abonnement" : "Renouveler l'abonnement";
  const currentChatMode = stats?.aiSettings?.chat_mode ?? "ai";
  const unreadContactMessages = stats?.unreadContactMessages ?? 0;
  const aiWallet = stats?.aiWallet;
  const aiTotalPurchased = aiWallet?.total_purchased ?? stats?.aiSettings?.remaining_credits ?? 0;
  const aiTotalConsumed = aiWallet?.total_consumed ?? 0;
  const aiRemainingCredits = aiWallet?.remaining_credits ?? stats?.aiSettings?.remaining_credits ?? 0;
  const selectedPack = stats?.aiCreditPacks.find((pack) => pack.id === selectedPackId) ?? stats?.aiCreditPacks[0] ?? null;
  const walletAlert = getWalletAlert(aiTotalPurchased, aiRemainingCredits);

  return (
    <section className="min-h-screen bg-jos-radial px-4 py-24 text-ocean-950">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-ocean-700 hover:text-ocean-950">
              Retour au site
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase text-sun-600">Gestion interne</p>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Plateforme JOS-Travel</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Vue admin pour suivre les comptes clients, les visites, les clics et le portefeuille AI_CREDIT.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openMailbox}
              className="relative inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ocean-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
            >
              <Bell aria-hidden="true" className="h-4 w-4" />
              Messages
              {unreadContactMessages > 0 ? (
                <span className="absolute -right-1 -top-2 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-sun-500 px-2 text-xs font-black text-white ring-2 ring-white">
                  {unreadContactMessages}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={loadStats}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ocean-950 shadow-sm transition hover:-translate-y-0.5"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Actualiser
            </button>
          </div>
        </div>

        {message ? (
          <p className="mt-8 rounded-[8px] border border-cyan-100 bg-white p-4 text-sm font-semibold text-ocean-950 shadow-sm">
            {message}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-10 inline-flex items-center gap-3 rounded-[8px] bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
            Chargement de la plateforme...
          </div>
        ) : stats ? (
          <>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Metric icon={UsersRound} label="Utilisateurs" value={String(stats.userCount)} />
              <Metric icon={Inbox} label="Nouveaux messages" value={String(unreadContactMessages)} />
              <Metric icon={Eye} label="Visites site" value={String(stats.analytics.visits)} />
              <Metric icon={MousePointerClick} label="Clics généraux" value={String(stats.analytics.clicks)} />
              <Metric icon={MessageCircle} label="Clics WhatsApp" value={String(stats.analytics.whatsappClicks)} />
              <Metric icon={WalletCards} label="AI_CREDIT restants" value={formatNumber(aiRemainingCredits)} />
              <Metric icon={ShieldCheck} label="Rôle actif" value="Admin" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Metric icon={PackageCheck} label="AI_CREDIT achetés" value={formatNumber(aiTotalPurchased)} />
              <Metric icon={History} label="AI_CREDIT consommés" value={formatNumber(aiTotalConsumed)} />
              <Metric icon={MessageCircle} label="Conversations" value={formatNumber(stats.aiUsageSummary.conversations)} />
              <Metric icon={MailOpen} label="Messages IA" value={formatNumber(stats.aiUsageSummary.messages)} />
              <Metric icon={UsersRound} label="Utilisateurs actifs" value={formatNumber(stats.aiUsageSummary.activeUsers)} />
            </div>

            {walletAlert ? (
              <div className="mt-6 flex flex-col gap-4 rounded-[8px] border border-orange-200 bg-orange-50 p-5 text-sun-800 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-bold">{walletAlert.title}</p>
                    <p className="mt-1 text-sm leading-6">{walletAlert.copy}</p>
                  </div>
                </div>
                <a href="#ai-wallet" className="inline-flex min-h-11 items-center justify-center rounded-full bg-sun-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-sun-600">
                  Acheter un pack
                </a>
              </div>
            ) : null}

            <div className="mt-8 rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-cyan-50 text-ocean-700">
                    <Cloud aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-ocean-950">Abonnement cloud</h2>
                    <p className="text-sm text-slate-500">
                      Fiche prête à renseigner dans Supabase pour suivre l&apos;hébergement et son expiration.
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full bg-cyan-50 px-4 py-2 text-sm font-bold text-ocean-800">
                  <CalendarClock aria-hidden="true" className="h-4 w-4" />
                  Expiration : {formatDate(stats.cloudSubscription?.expires_at)}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-5">
                <SubscriptionField label="Statut" value={stats.cloudSubscription?.status} />
                <SubscriptionField label="Fournisseur" value={stats.cloudSubscription?.provider} />
                <SubscriptionField label="Plan" value={stats.cloudSubscription?.plan_name} />
                <SubscriptionField label="Cycle" value={formatBillingCycle(stats.cloudSubscription?.billing_cycle)} />
                <SubscriptionField label="Dernière mise à jour" value={formatDate(stats.cloudSubscription?.updated_at)} />
              </div>

              <form onSubmit={handleSubscriptionPayment} className="mt-5 grid gap-4 rounded-[8px] border border-cyan-100 bg-cyan-50/50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Cycle abonnement</span>
                  <select
                    value={subscriptionCycle}
                    onChange={(event) => setSubscriptionCycle(event.target.value === "annual" ? "annual" : "monthly")}
                    className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-white px-4 text-sm outline-none transition focus:border-ocean-500"
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="annual">Annuel</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Numéro PawaPay</span>
                  <input
                    value={subscriptionPhone}
                    onChange={(event) => setSubscriptionPhone(event.target.value)}
                    placeholder="Ex. 671057243"
                    className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-white px-4 text-sm outline-none transition focus:border-ocean-500"
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ocean-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-700 disabled:opacity-60"
                >
                  {saving ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  {subscriptionActionLabel}
                </button>
              </form>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="grid gap-6">
                <form id="ai-wallet" onSubmit={handleRecharge} className="rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-orange-50 text-sun-600">
                    <WalletCards aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-ocean-950">Portefeuille global AI_CREDIT</h2>
                    <p className="text-sm text-slate-500">
                      Unité virtuelle interne pour quotas, limites d&apos;usage et anti-abus.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 rounded-[8px] bg-cyan-50/60 p-4 text-sm font-semibold text-slate-700">
                  <p>Aucune donnée fournisseur ni conversion technique n&apos;est affichée dans la plateforme.</p>
                  <p>
                    Solde : <span className="text-ocean-950">{formatNumber(aiRemainingCredits)} AI_CREDIT</span>
                  </p>
                </div>

                <label className="mt-6 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Pack à acheter</span>
                  <select
                    value={selectedPack?.id ?? selectedPackId}
                    onChange={(event) => setSelectedPackId(event.target.value)}
                    className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-cyan-50/60 px-4 text-sm outline-none transition focus:border-ocean-500"
                  >
                    {stats.aiCreditPacks
                      .filter((pack) => pack.is_active)
                      .map((pack) => (
                        <option key={pack.id} value={pack.id}>
                          {pack.name} · {formatNumber(pack.credits)} AI_CREDIT · {formatMoney(pack.price_xaf)}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Numéro PawaPay</span>
                  <input
                    value={creditPhone}
                    onChange={(event) => setCreditPhone(event.target.value)}
                    placeholder="Ex. 671057243"
                    className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-cyan-50/60 px-4 text-sm outline-none transition focus:border-ocean-500"
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving || !selectedPack}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-sun-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sun-600 disabled:opacity-60"
                >
                  {saving ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  Acheter le pack sélectionné
                </button>

                <div className="mt-6 border-t border-cyan-100 pt-5">
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">Prix des packs</h3>
                  <div className="mt-4 grid gap-3">
                    {stats.aiCreditPacks.map((pack) => (
                      <PackPriceRow
                        key={pack.id}
                        pack={pack}
                        value={packDrafts[pack.id] ?? String(pack.price_xaf)}
                        saving={packSavingId === pack.id}
                        onChange={(value) => setPackDrafts((state) => ({ ...state, [pack.id]: value }))}
                        onSave={() => handlePackSave(pack.id)}
                      />
                    ))}
                  </div>
                </div>
                </form>

              <form onSubmit={handleRulesUpdate} className="rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-cyan-50 text-ocean-700">
                    <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-ocean-950">Règles de consommation</h2>
                    <p className="text-sm text-slate-500">Seuils abstraits appliqués aux réponses de la discussion.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  <CreditRuleInput
                    label="Message standard"
                    value={ruleDrafts.standardMessageCredits}
                    onChange={(value) => setRuleDrafts((state) => ({ ...state, standardMessageCredits: value }))}
                  />
                  <CreditRuleInput
                    label="Message complexe"
                    value={ruleDrafts.complexMessageCredits}
                    onChange={(value) => setRuleDrafts((state) => ({ ...state, complexMessageCredits: value }))}
                  />
                  <CreditRuleInput
                    label="Analyse avancée"
                    value={ruleDrafts.advancedAnalysisCredits}
                    onChange={(value) => setRuleDrafts((state) => ({ ...state, advancedAnalysisCredits: value }))}
                  />
                </div>

                <button
                  type="submit"
                  disabled={rulesSaving}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-ocean-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-700 disabled:opacity-60"
                >
                  {rulesSaving ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  Enregistrer les seuils
                </button>
              </form>

              <div className="rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-cyan-50 text-ocean-700">
                    <Settings2 aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-ocean-950">Configuration du chat</h2>
                    <p className="text-sm text-slate-500">Choisissez comment le bouton de discussion doit répondre aux visiteurs.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  <ChatModeButton
                    active={currentChatMode === "ai"}
                    disabled={chatSaving}
                    title="IA"
                    copy="Ouvre la discussion JOS-Travel. La conversation est gérée automatiquement tant que le crédit est disponible."
                    onClick={() => handleChatModeUpdate("ai")}
                  />
                  <ChatModeButton
                    active={currentChatMode === "human"}
                    disabled={chatSaving}
                    title="Humain"
                    copy="Redirige directement le visiteur vers WhatsApp pour échanger avec JOS-Travel."
                    onClick={() => handleChatModeUpdate("human")}
                  />
                </div>
              </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-bold text-ocean-950">Derniers messages</h2>
                      <p className="mt-1 text-sm text-slate-500">Aperçu rapide des demandes reçues via le formulaire.</p>
                    </div>
                    <button
                      type="button"
                      onClick={openMailbox}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-bold text-ocean-800 transition hover:bg-cyan-100"
                    >
                      <MailOpen aria-hidden="true" className="h-4 w-4" />
                      Voir tous les messages
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {stats.recentContactMessages.length ? (
                      stats.recentContactMessages.map((item) => (
                        <ContactMessageCard key={item.id} message={item} compact onMarkRead={() => markMessagesRead([item.id])} />
                      ))
                    ) : (
                      <p className="rounded-[8px] bg-cyan-50/70 p-4 text-sm font-semibold text-slate-600">
                        Aucun message reçu pour le moment.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
                  <h2 className="font-bold text-ocean-950">Derniers utilisateurs</h2>
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="text-xs uppercase text-slate-500">
                        <tr className="border-b border-cyan-100">
                          <th className="py-3 pr-4">Nom</th>
                          <th className="py-3 pr-4">Email</th>
                          <th className="py-3 pr-4">Téléphone</th>
                          <th className="py-3 pr-4">Besoin</th>
                          <th className="py-3 pr-4">Rôle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentUsers.map((item) => (
                          <tr key={item.id} className="border-b border-cyan-50">
                            <td className="py-3 pr-4 font-semibold text-ocean-950">{item.full_name ?? "Client"}</td>
                            <td className="py-3 pr-4 text-slate-600">{item.email}</td>
                            <td className="py-3 pr-4 text-slate-600">{item.phone ?? "-"}</td>
                            <td className="py-3 pr-4 text-slate-600">{item.trip_interest ?? "-"}</td>
                            <td className="py-3 pr-4">
                              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-ocean-700">
                                {item.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-cyan-50 text-ocean-700">
                      <History aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-bold text-ocean-950">Historique portefeuille AI_CREDIT</h2>
                      <p className="text-sm text-slate-500">Achats, ajustements et consommations abstraites.</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {stats.aiWalletTransactions.length ? (
                      stats.aiWalletTransactions.map((transaction) => (
                        <WalletTransactionCard key={transaction.id} transaction={transaction} />
                      ))
                    ) : (
                      <p className="rounded-[8px] bg-cyan-50/70 p-4 text-sm font-semibold text-slate-600">
                        Aucune transaction AI_CREDIT pour le moment.
                      </p>
                    )}
                  </div>
                </div>

                <UsageOverview usage={stats.aiUsageSummary} />
              </div>
            </div>

            {mailboxOpen ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-950/55 p-4 backdrop-blur-sm">
                <div className="flex max-h-[86vh] w-full max-w-5xl flex-col overflow-hidden rounded-[8px] bg-white shadow-2xl">
                  <div className="flex flex-col gap-4 border-b border-cyan-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">Messagerie</p>
                      <h2 className="mt-1 text-2xl font-bold text-ocean-950">Demandes clients</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={markAllMessagesRead}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-bold text-ocean-800 transition hover:bg-cyan-100"
                      >
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                        Tout marquer lu
                      </button>
                      <button
                        type="button"
                        onClick={() => setMailboxOpen(false)}
                        className="inline-flex min-h-10 items-center justify-center rounded-full bg-ocean-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-ocean-700"
                      >
                        Fermer
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto bg-cyan-50/50 p-5">
                    {messagesLoading ? (
                      <div className="inline-flex items-center gap-3 rounded-[8px] bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">
                        <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
                        Chargement des messages...
                      </div>
                    ) : contactMessages.length ? (
                      <div className="grid gap-4">
                        {contactMessages.map((item) => (
                          <ContactMessageCard key={item.id} message={item} onMarkRead={() => markMessagesRead([item.id])} />
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-[8px] bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">
                        Aucun message reçu pour le moment.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

function ContactMessageCard({
  message,
  compact = false,
  onMarkRead
}: {
  message: ContactMessage;
  compact?: boolean;
  onMarkRead: () => void;
}) {
  const whatsappHref = buildClientWhatsAppUrl(message);

  return (
    <article className="rounded-[8px] border border-cyan-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-ocean-950">{message.full_name}</h3>
            {message.status === "new" ? (
              <span className="rounded-full bg-sun-100 px-2.5 py-1 text-xs font-black text-sun-700">Nouveau</span>
            ) : (
              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-black text-ocean-700">Lu</span>
            )}
          </div>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">{message.service}</p>
          <p className="mt-2 text-sm text-slate-500">
            {message.full_phone} · {message.country_name}
            {message.destination ? ` · ${message.destination}` : ""}
          </p>
          {message.email ? <p className="mt-1 text-sm text-slate-500">{message.email}</p> : null}
          <p className="mt-2 text-xs font-semibold text-slate-400">{formatDateTime(message.created_at)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {message.status === "new" ? (
            <button
              type="button"
              onClick={onMarkRead}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-bold text-ocean-800 transition hover:bg-cyan-100"
            >
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Marquer lu
            </button>
          ) : null}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-600"
          >
            WhatsApp
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>

      <p className={compact ? "mt-3 line-clamp-2 text-sm leading-6 text-slate-700" : "mt-4 whitespace-pre-line text-sm leading-7 text-slate-700"}>
        {message.message}
      </p>
    </article>
  );
}

function PackPriceRow({
  pack,
  value,
  saving,
  onChange,
  onSave
}: {
  pack: AiCreditPack;
  value: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-3 sm:grid-cols-[1fr_8rem_auto] sm:items-center">
      <div>
        <p className="text-sm font-bold text-ocean-950">{pack.name}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{formatNumber(pack.credits)} AI_CREDIT</p>
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="number"
        min={0}
        className="min-h-10 rounded-[8px] border border-cyan-100 bg-white px-3 text-sm outline-none transition focus:border-ocean-500"
        aria-label={`Prix ${pack.name}`}
      />
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-ocean-800 shadow-sm transition hover:bg-cyan-100 disabled:opacity-60"
      >
        {saving ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
        Sauver
      </button>
    </div>
  );
}

function CreditRuleInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="flex items-center overflow-hidden rounded-[8px] border border-cyan-100 bg-cyan-50/60 focus-within:border-ocean-500">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          min={1}
          className="min-h-12 w-full bg-transparent px-4 text-sm outline-none"
        />
        <span className="whitespace-nowrap border-l border-cyan-100 px-3 text-xs font-black text-ocean-700">
          AI_CREDIT
        </span>
      </div>
    </label>
  );
}

function WalletTransactionCard({ transaction }: { transaction: AiWalletTransaction }) {
  const isPositive = transaction.amount > 0;

  return (
    <div className="rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={isPositive ? "font-bold text-palm-600" : "font-bold text-sun-600"}>
            {isPositive ? "+" : ""}
            {formatNumber(transaction.amount)} AI_CREDIT
          </p>
          <p className="mt-2 text-sm text-slate-600">{transaction.reason}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-ocean-700 shadow-sm">
          {formatTransactionType(transaction.transaction_type)}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500">
        Solde après : {formatNumber(transaction.balance_after)} · {formatDateTime(transaction.created_at)}
      </p>
    </div>
  );
}

function UsageOverview({ usage }: { usage: AiUsageSummary }) {
  return (
    <div className="rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-white text-ocean-700 shadow-sm">
          <BarChart3 aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold text-ocean-950">Consommation AI_CREDIT</h2>
          <p className="text-sm text-slate-500">Vue par période et par utilisateur, sans données fournisseur.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-[8px] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Par utilisateur</p>
          <div className="mt-3 grid gap-3">
            {usage.consumptionByUser.length ? (
              usage.consumptionByUser.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-black text-ocean-950">{formatNumber(item.credits)} AI_CREDIT</span>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-500">Aucune consommation enregistrée.</p>
            )}
          </div>
        </div>

        <div className="rounded-[8px] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Période récente</p>
          <div className="mt-3 grid gap-3">
            {usage.consumptionByPeriod.length ? (
              usage.consumptionByPeriod.map((item) => (
                <div key={item.date} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-sm">
                  <span className="font-semibold text-slate-500">{formatShortDate(item.date)}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-cyan-100">
                    <span
                      className="block h-full rounded-full bg-ocean-700"
                      style={{ width: `${Math.min(100, Math.max(8, item.credits / 10))}%` }}
                    />
                  </span>
                  <span className="font-black text-ocean-950">{formatNumber(item.credits)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-500">Aucune période à afficher.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-cyan-50 text-ocean-700">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-ocean-950">{value}</p>
    </div>
  );
}

function SubscriptionField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-ocean-950">{value || "À renseigner"}</p>
    </div>
  );
}

function ChatModeButton({
  active,
  disabled,
  title,
  copy,
  onClick
}: {
  active: boolean;
  disabled: boolean;
  title: string;
  copy: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        active
          ? "rounded-[8px] border border-ocean-300 bg-ocean-950 p-4 text-left text-white transition disabled:opacity-60"
          : "rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-4 text-left text-ocean-950 transition hover:border-ocean-300 disabled:opacity-60"
      }
    >
      <span className="block text-sm font-bold">{title}</span>
      <span className={active ? "mt-1 block text-sm leading-6 text-cyan-50" : "mt-1 block text-sm leading-6 text-slate-600"}>
        {copy}
      </span>
    </button>
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return "À renseigner";
  }

  return new Intl.DateTimeFormat("fr-CM", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("fr-CM", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("fr-CM", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-CM").format(value);
}

function formatMoney(value: number) {
  return `${formatNumber(value)} FCFA`;
}

function formatTransactionType(value: AiWalletTransaction["transaction_type"]) {
  if (value === "purchase") {
    return "Achat";
  }

  if (value === "consumption") {
    return "Consommation";
  }

  if (value === "refund") {
    return "Remboursement";
  }

  return "Ajustement";
}

function formatBillingCycle(value?: BillingCycle | null) {
  if (value === "annual") {
    return "Annuel";
  }

  if (value === "monthly") {
    return "Mensuel";
  }

  return null;
}

function isSubscriptionActive(value: AdminStats["cloudSubscription"]) {
  if (!value || value.status?.toLowerCase() !== "active" || !value.expires_at) {
    return false;
  }

  const expiresAt = new Date(`${value.expires_at}T23:59:59`);
  return Number.isFinite(expiresAt.getTime()) && expiresAt.getTime() >= Date.now();
}

function defaultPaymentPhone() {
  return brand.whatsapp.replace(/^237/, "");
}

function getWalletAlert(totalPurchased: number, remainingCredits: number) {
  if (totalPurchased <= 0) {
    return null;
  }

  const percent = (remainingCredits / totalPurchased) * 100;

  if (percent <= 5) {
    return {
      title: "Alerte critique : moins de 5 % d'AI_CREDIT restants",
      copy: "Le portefeuille global est presque épuisé. Achetez un nouveau pack pour éviter l'arrêt des réponses automatiques."
    };
  }

  if (percent <= 10) {
    return {
      title: "Alerte forte : moins de 10 % d'AI_CREDIT restants",
      copy: "La réserve devient faible. Un achat rapide est recommandé pour maintenir le service."
    };
  }

  if (percent <= 25) {
    return {
      title: "Alerte : moins de 25 % d'AI_CREDIT restants",
      copy: "Surveillez le portefeuille et préparez un nouveau pack si le trafic augmente."
    };
  }

  return null;
}

function buildClientWhatsAppUrl(message: ContactMessage) {
  const phone = message.full_phone.replace(/[^\d]/g, "");
  const text = [
    `Bonjour ${message.full_name}, ici ${brand.name}.`,
    `Nous avons bien reçu votre demande concernant : ${message.service}.`,
    message.destination ? `Destination indiquée : ${message.destination}.` : "",
    "Nous vous contactons pour finaliser les détails et vous proposer un accompagnement adapté.",
    "",
    `Rappel de votre message : ${message.message.slice(0, 260)}`
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${phone || brand.whatsapp}?text=${encodeURIComponent(text)}`;
}
