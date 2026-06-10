import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, CheckCircle2, FileText, GraduationCap, MessageCircle, Plane, ShieldCheck } from "lucide-react";
import { brand, scholarshipFlyers, scholarshipOffer } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Bourses d'études en Chine",
  description:
    "Programme JOS-Travel pour les opportunités d'études en Chine avec bourse complète, accompagnement de dossier et suivi de procédure."
};

const whatsappMessage = [
  "Bonjour JOS-Travel, je souhaite obtenir des informations sur le service Bourses d'études en Chine.",
  "Je veux être accompagné pour vérifier mon éligibilité, préparer mon dossier et connaître les prochaines étapes."
].join("\n\n");

function whatsappUrl() {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
}

export default function BoursesEtudesPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2] text-slate-900">
      <section className="relative overflow-hidden bg-sky-950 px-5 pb-20 pt-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.28),transparent_34%),linear-gradient(135deg,rgba(14,165,233,0.28),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/#bourses" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-cyan-50 backdrop-blur transition hover:bg-white/20">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Retour aux bourses
          </Link>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-cyan-100">
                <GraduationCap aria-hidden="true" className="h-4 w-4" />
                Service spécialisé
              </p>
              <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] md:text-7xl">
                {scholarshipOffer.hero}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-100">{scholarshipOffer.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full bg-sun-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-orange-900/20">
                  {scholarshipOffer.promo}
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-cyan-50">
                  {scholarshipOffer.fee}
                </span>
              </div>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-950/30 transition hover:scale-[1.02]"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                Demander un accompagnement sur WhatsApp
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {scholarshipFlyers.map((flyer) => (
                <figure key={flyer.src} className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur">
                  <div className="relative aspect-[0.7] overflow-hidden rounded-[1.55rem] bg-white">
                    <Image src={flyer.src} alt={flyer.alt} fill priority className="object-cover" sizes="(min-width: 1024px) 340px, 90vw" />
                  </div>
                  <figcaption className="px-3 py-4 text-sm font-bold text-cyan-50">{flyer.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <InfoPanel
            icon={GraduationCap}
            title="Niveaux concernés"
            items={scholarshipOffer.levels}
            note="Opportunités ouvertes aux étudiants souhaitant poursuivre leurs études en Chine."
          />
          <InfoPanel
            icon={ShieldCheck}
            title="Prise en charge gratuite"
            items={scholarshipOffer.coverage}
            note="Selon les conditions du programme affichées sur les flyers."
          />
          <InfoPanel
            icon={Plane}
            title="Promotion"
            items={["Occasion exceptionnelle", "Offres promotionnelles", scholarshipOffer.deadline]}
            note={scholarshipOffer.support}
          />
        </div>
      </section>

      <section className="bg-white px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <Checklist
            eyebrow="Conditions principales"
            title="Profil attendu"
            description="Avant le dépôt, JOS-Travel vérifie avec vous les éléments essentiels pour présenter un dossier sérieux."
            items={scholarshipOffer.conditions}
          />
          <Checklist
            eyebrow="Dossiers à fournir"
            title="Pièces demandées"
            description="Préparez les documents indiqués sur le flyer afin de faciliter l'ouverture et le suivi de votre dossier."
            items={scholarshipOffer.documents}
          />
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-sky-950 p-8 text-white shadow-2xl md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">Contact service bourses</p>
          <h2 className="mt-4 font-display text-4xl font-black md:text-5xl">Passez à l&apos;accompagnement personnalisé.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <ContactLine label="Téléphones" value={scholarshipOffer.contacts.join(" / ")} />
            <ContactLine label="Email" value={scholarshipOffer.email} />
            <ContactLine label="Adresse" value={scholarshipOffer.address} />
            <ContactLine label="Frais dossier" value={scholarshipOffer.fee.replace("Frais d'ouverture du dossier : ", "")} />
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-black text-sky-950 shadow-xl transition hover:scale-[1.02]"
          >
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
            Discuter du dossier sur WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  items,
  note
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
  note: string;
}) {
  return (
    <article className="rounded-[2rem] border border-cyan-100 bg-white p-7 shadow-xl shadow-sky-900/5">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-sky-700">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-sky-950">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-cyan-500" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm leading-6 text-slate-500">{note}</p>
    </article>
  );
}

function Checklist({
  eyebrow,
  title,
  description,
  items
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <article className="rounded-[2rem] bg-[#F8F6F2] p-8">
      <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.24em] text-cyan-600">
        <FileText aria-hidden="true" className="h-4 w-4" />
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl font-black text-sky-950">{title}</h2>
      <p className="mt-4 leading-7 text-slate-600">{description}</p>
      <ul className="mt-7 grid gap-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-white px-5 py-4 font-bold text-sky-950 shadow-sm">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ContactLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">{label}</p>
      <p className="mt-2 font-bold text-white">{value}</p>
    </div>
  );
}
