import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdmin } from "@/lib/platform/auth";

export const metadata: Metadata = {
  title: "Gestion de la plateforme",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  const admin = await requireAdmin();

  if (!admin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-jos-radial px-4 text-ocean-950">
        <section className="max-w-xl rounded-[8px] border border-cyan-100 bg-white p-6 text-center shadow-lift">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-[8px] bg-cyan-50 text-ocean-700">
            <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">Accès admin requis</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Connectez-vous avec un compte administrateur JOS Travel pour gérer les utilisateurs et le crédit de l&apos;agent IA.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-ocean-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-700"
          >
            Retour au site
          </Link>
        </section>
      </main>
    );
  }

  return <AdminDashboard />;
}
