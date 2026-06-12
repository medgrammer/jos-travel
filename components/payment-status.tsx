"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, RefreshCw, ShieldAlert } from "lucide-react";

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
  const [frameLoaded, setFrameLoaded] = useState(false);

  const isDone = payment?.status === "COMPLETED" || Boolean(payment?.applied_at);
  const isFailed = ["FAILED", "REJECTED", "CANCELLED", "failed_to_start"].includes(payment?.status ?? "");
  const canPay = Boolean(payment?.payment_url && !isDone && !isFailed);
  const subscriptionUsdPrice = getSubscriptionUsdPrice(payment);
  const subscriptionRate = getSubscriptionFxRate(payment);
  const steps = useMemo(() => getPaymentSteps(payment, isDone, isFailed), [payment, isDone, isFailed]);
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

  useEffect(() => {
    setFrameLoaded(false);
  }, [payment?.payment_url]);

  return (
    <main className="min-h-screen bg-jos-radial px-4 py-12 text-ocean-950 md:py-20">
      <section className="mx-auto max-w-6xl rounded-[8px] border border-cyan-100 bg-white p-5 shadow-lift md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-sun-600">Paiement JOS-Travel</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">{title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Finalisez le paiement sans quitter cette page. La progression se met a jour automatiquement apres validation.
            </p>
          </div>
          <StatusIcon done={isDone} failed={isFailed} />
        </div>

        {error ? (
          <p className="mt-6 rounded-[8px] border border-orange-100 bg-orange-50 p-4 text-sm font-semibold text-sun-700">
            {error}
          </p>
        ) : null}

        <PaymentStepper steps={steps} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
          </div>

          <div className="rounded-[8px] border border-cyan-100 bg-cyan-50/50 p-3">
            <div className="mb-3 flex items-center justify-between gap-3 px-2">
              <div>
                <h2 className="font-bold text-ocean-950">Paiement sécurisé</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">Module PawaPay intégré à la page interne.</p>
              </div>
              {canPay && !frameLoaded ? <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin text-ocean-700" /> : null}
            </div>

            {canPay ? (
              <div className="relative overflow-hidden rounded-[8px] border border-cyan-100 bg-white">
                {!frameLoaded ? (
                  <div className="absolute inset-0 z-10 grid place-items-center bg-white/85 text-center">
                    <div>
                      <LoaderCircle aria-hidden="true" className="mx-auto h-7 w-7 animate-spin text-ocean-700" />
                      <p className="mt-3 text-sm font-semibold text-slate-600">Chargement du module de paiement...</p>
                    </div>
                  </div>
                ) : null}
                <iframe
                  title="Paiement sécurisé PawaPay"
                  src={payment?.payment_url ?? undefined}
                  className="h-[640px] w-full bg-white"
                  onLoad={() => setFrameLoaded(true)}
                  allow="payment *; clipboard-read; clipboard-write"
                  sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                />
              </div>
            ) : (
              <div className="grid min-h-[360px] place-items-center rounded-[8px] border border-cyan-100 bg-white p-6 text-center">
                <div>
                  <StatusIcon done={isDone} failed={isFailed} />
                  <p className="mt-4 text-sm font-semibold text-slate-600">
                    {isDone
                      ? "Paiement confirme. La plateforme est mise a jour."
                      : isFailed
                        ? "Ce paiement n'est plus disponible. Relancez une nouvelle demande depuis l'administration."
                        : "Preparation du module de paiement..."}
                  </p>
                </div>
              </div>
            )}
          </div>
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

type StepState = "complete" | "active" | "pending" | "failed";

type PaymentStep = {
  label: string;
  description: string;
  state: StepState;
};

function PaymentStepper({ steps }: { steps: PaymentStep[] }) {
  return (
    <div className="mt-8 grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={`rounded-[8px] border p-4 transition ${
            step.state === "complete"
              ? "border-palm-200 bg-palm-50 text-palm-800"
              : step.state === "active"
                ? "border-cyan-200 bg-cyan-50 text-ocean-950 shadow-sm"
                : step.state === "failed"
                  ? "border-orange-200 bg-orange-50 text-sun-800"
                  : "border-slate-200 bg-white text-slate-500"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                step.state === "complete"
                  ? "bg-palm-600 text-white"
                  : step.state === "active"
                    ? "bg-ocean-950 text-white"
                    : step.state === "failed"
                      ? "bg-sun-600 text-white"
                      : "bg-slate-100 text-slate-500"
              }`}
            >
              {step.state === "complete" ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : index + 1}
            </span>
            <div>
              <p className="text-sm font-bold">{step.label}</p>
              <p className="mt-1 text-xs font-semibold opacity-75">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getPaymentSteps(payment: Payment | null, isDone: boolean, isFailed: boolean): PaymentStep[] {
  const status = payment?.status?.toUpperCase() ?? "";
  const hasPaymentPage = Boolean(payment?.payment_url);
  const isProcessing = ["ACCEPTED", "SUBMITTED", "PROCESSING"].includes(status);

  if (isFailed) {
    return [
      { label: "Préparation", description: "Demande créée", state: "complete" },
      { label: "Paiement", description: "Demande refusée", state: "failed" },
      { label: "Validation", description: "Non confirmée", state: "pending" },
      { label: "Finalisation", description: "Action requise", state: "pending" }
    ];
  }

  return [
    {
      label: "Préparation",
      description: payment ? "Référence générée" : "Chargement",
      state: payment ? "complete" : "active"
    },
    {
      label: "Paiement",
      description: hasPaymentPage ? "Module disponible" : "En attente",
      state: isDone || isProcessing ? "complete" : hasPaymentPage ? "active" : "pending"
    },
    {
      label: "Validation",
      description: isDone ? "Validée" : isProcessing ? "En cours" : "Mobile Money",
      state: isDone ? "complete" : isProcessing ? "active" : "pending"
    },
    {
      label: "Finalisation",
      description: isDone ? "Plateforme mise à jour" : "Après confirmation",
      state: isDone ? "complete" : "pending"
    }
  ];
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
