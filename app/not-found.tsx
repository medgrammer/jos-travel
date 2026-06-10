import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F6F2] px-5 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-start justify-center">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-cyan-600">JOS-Travel</p>
        <h1 className="max-w-3xl text-balance text-5xl font-black leading-tight text-sky-950 md:text-7xl">
          Cette escale n&apos;existe pas.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
          La page demandée est introuvable. Revenez à l&apos;accueil pour continuer votre voyage avec JOS-Travel.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-500/25 transition hover:scale-105"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
