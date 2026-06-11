"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, LoaderCircle, RefreshCw, ShieldAlert } from "lucide-react";

type Payment = {
  deposit_id: string;
  payment_type: "subscription" | "ai_credit";
  status: string;
  amount_xaf: number;
  currency: string;
  billing_cycle: "monthly" | "annual" | null;
  credits: number | null;
  payment_url: string | null;
  applied_at: string | null;
  metadata: Record<string, unknown>;
  updated_at: string;
};

export function PaymentStatus({ depositId }: { depositId: string }) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDone = payment?.status === "COMPLETED" || Boolean(payment?.applied_at);
  const isFailed = ["FAILED", "REJECTED", "CANCELLED", "failed_to_start"].includes(payment?.status ?? "");
  const subscriptionUsdPrice = getSubscriptionUsdPrice(payment);
  const subscriptionRate = getSubscriptionFxRate(payment);
  const title = useMemo(() => {
    if (isDone) {
      return "Paiement confirme";
    }
    if (isFailed) {
      return "Paiement non valide";
    }
    return "Paiement en cours";
  }, [isDone, isFailed]);

  useEffect(() => {
    let active = true;

    async function load() {
      const response = await fetch(`/api/payments/${depositId}`, { cache: "no-store" }).catch(() => null);
      const payload = response ? await response.json().catch(() => null) : null;

      if (!active) {
        return;
      }

      if (response?.ok && payload?.payment) {
        setPayment(payload.payment);
        setError(null);
      } else {
        setError(payload?.error ?? "Statut de paiement indisponible.");
      }

    }

    void load();
    const timer = window.setInterval(load, 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [depositId]);

  return (
    <main className="min-h-screen bg-jos-radial px-4 py-20 text-ocean-950">
      <section className="mx-auto max-w-3xl rounded-[8px] border border-cyan-100 bg-white p-6 shadow-lift md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-sun-600">Paiement JOS-Travel</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">{title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Cette page suit l&apos;evolution du paiement PawaPay et met a jour la plateforme lorsque la transaction est
              confirmee.
            </p>
          </div>
          <StatusIcon done={isDone} failed={isFailed} />
        </div>

        {error ? (
          <p className="mt-6 rounded-[8px] border border-orange-100 bg-orange-50 p-4 text-sm font-semibold text-sun-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Info label="Reference" value={depositId} />
          <Info label="Statut" value={payment?.status ?? "Chargement"} />
          <Info label="Montant" value={payment ? `${payment.amount_xaf.toLocaleString("fr-CM")} ${payment.currency}` : "-"} />
          <Info label="Type" value={payment?.payment_type === "subscription" ? "Abonnement cloud" : "Achat pack AI_CREDIT"} />
          <Info label="Cycle" value={payment?.billing_cycle === "annual" ? "Annuel" : payment?.billing_cycle === "monthly" ? "Mensuel" : "-"} />
          {payment?.payment_type === "subscription" ? (
            <>
              <Info label="Tarif abonnement" value={subscriptionUsdPrice ? formatUsd(subscriptionUsdPrice) : "-"} />
              <Info label="Conversion" value={subscriptionRate ? `1 USD = ${subscriptionRate.toLocaleString("fr-CM")} XAF` : "Au paiement"} />
            </>
          ) : null}
          <Info label="AI_CREDIT" value={payment?.credits ? payment.credits.toLocaleString("fr-CM") : "-"} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {payment?.payment_url && !isDone && !isFailed ? (
            <a
              href={payment.payment_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ocean-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-700"
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              Continuer le paiement PawaPay
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cyan-100 bg-white px-6 py-3 text-sm font-semibold text-ocean-950 transition hover:border-ocean-300"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Actualiser
          </button>
          <Link
            href="/admin"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-100 bg-white px-6 py-3 text-sm font-semibold text-ocean-950 transition hover:border-ocean-300"
          >
            Retour admin
          </Link>
        </div>
      </section>
    </main>
  );
}

function StatusIcon({ done, failed }: { done: boolean; failed: boolean }) {
  const className = "h-14 w-14";

  if (done) {
    return <CheckCircle2 aria-hidden="true" className={`${className} text-palm-600`} />;
  }

  if (failed) {
    return <ShieldAlert aria-hidden="true" className={`${className} text-sun-600`} />;
  }

  return <LoaderCircle aria-hidden="true" className={`${className} animate-spin text-ocean-700`} />;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-ocean-950">{value}</p>
    </div>
  );
}

function getSubscriptionUsdPrice(payment: Payment | null) {
  return normalizePositiveNumber(payment?.metadata?.subscription_price_usd);
}

function getSubscriptionFxRate(payment: Payment | null) {
  return normalizePositiveNumber(payment?.metadata?.usd_to_xaf_rate);
}

function normalizePositiveNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatUsd(value: number) {
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2
  }).format(value)}`;
}
