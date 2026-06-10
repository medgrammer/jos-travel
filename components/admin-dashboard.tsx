"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Bot, CreditCard, LoaderCircle, RefreshCw, ShieldCheck, UsersRound } from "lucide-react";

type AdminStats = {
  userCount: number;
  aiSettings: {
    monthly_credits: number;
    remaining_credits: number;
    updated_at: string;
  } | null;
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
};

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [amount, setAmount] = useState("50");
  const [reason, setReason] = useState("Recharge crédit agent IA");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    const response = await fetch("/api/admin/stats", { cache: "no-store" });
    const payload = await response.json().catch(() => null);

    if (response.ok) {
      setStats(payload);
      setMessage(null);
    } else {
      setMessage(payload?.error ?? "Chargement impossible.");
    }

    setLoading(false);
  }

  async function handleRecharge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/admin/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), reason })
    });

    const payload = await response.json().catch(() => null);
    if (response.ok) {
      setMessage("Crédit IA mis à jour.");
      await loadStats();
    } else {
      setMessage(payload?.error ?? "Recharge impossible.");
    }

    setSaving(false);
  }

  return (
    <section className="min-h-screen bg-jos-radial px-4 py-24 text-ocean-950">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-ocean-700 hover:text-ocean-950">
              Retour au site
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase text-sun-600">Gestion interne</p>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">Plateforme JOS Travel</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Vue admin pour suivre les comptes clients et contrôler le crédit de l&apos;agent IA OpenAI.
            </p>
          </div>
          <button
            type="button"
            onClick={loadStats}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ocean-950 shadow-sm transition hover:-translate-y-0.5"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Actualiser
          </button>
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
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Metric icon={UsersRound} label="Utilisateurs" value={String(stats.userCount)} />
              <Metric icon={Bot} label="Crédits IA restants" value={String(stats.aiSettings?.remaining_credits ?? 0)} />
              <Metric icon={ShieldCheck} label="Rôle actif" value="Admin" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
              <form onSubmit={handleRecharge} className="rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-orange-50 text-sun-600">
                    <CreditCard aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold text-ocean-950">Recharge crédit agent IA</h2>
                    <p className="text-sm text-slate-500">1 crédit = 1 réponse chatbot.</p>
                  </div>
                </div>
                <label className="mt-6 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Montant</span>
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    type="number"
                    className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-cyan-50/60 px-4 text-sm outline-none transition focus:border-ocean-500"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Motif</span>
                  <input
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-cyan-50/60 px-4 text-sm outline-none transition focus:border-ocean-500"
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-sun-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sun-600 disabled:opacity-60"
                >
                  {saving ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                  Recharger
                </button>
              </form>

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

            <div className="mt-6 rounded-[8px] border border-cyan-100 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-ocean-950">Historique crédits IA</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {stats.creditEvents.map((event) => (
                  <div key={event.id} className="rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-4">
                    <p className={event.amount >= 0 ? "font-bold text-palm-600" : "font-bold text-sun-600"}>
                      {event.amount >= 0 ? "+" : ""}
                      {event.amount} crédit(s)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{event.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof UsersRound; label: string; value: string }) {
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
