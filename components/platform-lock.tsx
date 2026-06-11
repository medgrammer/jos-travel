import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { AuthWidget } from "@/components/auth-widget";
import { brand } from "@/lib/site-data";
import type { CloudSubscription } from "@/lib/platform/billing";

export function PlatformLock({ subscription }: { subscription?: CloudSubscription | null }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-jos-radial px-4 py-20 text-ocean-950">
      <section className="w-full max-w-3xl rounded-[8px] border border-cyan-100 bg-white p-6 text-center shadow-lift md:p-10">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[8px] bg-cyan-50 text-ocean-700">
          <LockKeyhole aria-hidden="true" className="h-7 w-7" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase text-sun-600">Acces temporairement restreint</p>
        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{brand.name}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
          La plateforme publique est verrouillee en attendant le renouvellement de l&apos;abonnement cloud.
          L&apos;espace administrateur reste disponible pour regulariser la situation.
        </p>
        <div className="mx-auto mt-6 grid max-w-xl gap-3 rounded-[8px] border border-cyan-100 bg-cyan-50/60 p-4 text-left text-sm text-slate-700 md:grid-cols-2">
          <div>
            <span className="block text-xs font-bold uppercase text-slate-500">Statut</span>
            <strong className="mt-1 block text-ocean-950">{subscription?.status || "A renseigner"}</strong>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-slate-500">Expiration</span>
            <strong className="mt-1 block text-ocean-950">{subscription?.expires_at || "A renseigner"}</strong>
          </div>
        </div>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <AuthWidget />
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ocean-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-ocean-700"
          >
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Acces admin
          </Link>
        </div>
      </section>
    </main>
  );
}
