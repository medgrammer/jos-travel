import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { PlatformLock } from "@/components/platform-lock";
import { getPlatformSubscriptionStatus } from "@/lib/platform/subscription";
import { brand, featuredOffers, type FeaturedOffer } from "@/lib/site-data";

type OfferPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

function getOffer(slug: string) {
  return featuredOffers.find((offer) => offer.slug === slug);
}

function whatsappHref(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);

  if (!offer) {
    return {};
  }

  return {
    title: offer.title,
    description: offer.summary,
    alternates: {
      canonical: `https://jostravel.site${offer.href}`
    },
    openGraph: {
      title: `${offer.title} | JOS-Travel`,
      description: offer.summary,
      url: `https://jostravel.site${offer.href}`,
      images: [
        {
          url: offer.flyer,
          width: 900,
          height: 1100,
          alt: offer.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${offer.title} | JOS-Travel`,
      description: offer.summary,
      images: [offer.flyer]
    }
  };
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[2rem] border border-cyan-100 bg-white p-6 shadow-xl shadow-sky-900/5">
      <h2 className="text-2xl font-black text-sky-950">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-cyan-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DestinationGrid({ offer }: { offer: FeaturedOffer }) {
  if (!offer.destinations?.length) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-cyan-100 bg-white p-6 shadow-xl shadow-sky-900/5">
      <h2 className="text-2xl font-black text-sky-950">Destinations proposées</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {offer.destinations.map((destination) => (
          <article key={destination.country} className="rounded-3xl bg-cyan-50/70 p-5">
            <h3 className="text-lg font-black text-sky-950">{destination.country}</h3>
            <ul className="mt-3 grid gap-2">
              {destination.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm font-semibold leading-6 text-slate-700">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const offer = getOffer(slug);

  if (!offer) {
    notFound();
  }

  const subscriptionStatus = await getPlatformSubscriptionStatus();

  if (!subscriptionStatus.active) {
    return <PlatformLock subscription={subscriptionStatus.subscription} />;
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-slate-900">
      <section className="relative overflow-hidden bg-sky-950 px-5 py-8 text-white md:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_80%_5%,rgba(251,146,60,0.18),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/#offres"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-cyan-50 backdrop-blur-xl transition hover:bg-white/18"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Retour aux offres
          </Link>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="inline-flex rounded-full bg-cyan-400/18 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-100">
                {offer.category}
              </div>
              <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black leading-tight md:text-6xl">
                {offer.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50/85">{offer.summary}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                {offer.badges.map((badge) => (
                  <span key={badge} className="rounded-full bg-white/12 px-4 py-2 text-sm font-black text-white">
                    {badge}
                  </span>
                ))}
              </div>

              <a
                href={whatsappHref(offer.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-7 py-4 font-black text-white shadow-xl shadow-cyan-500/25 transition hover:scale-105"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                Demander les détails sur WhatsApp
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white">
                <Image
                  src={offer.flyer}
                  alt={offer.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.74fr_1.26fr]">
          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-cyan-100 bg-white p-6 shadow-xl shadow-sky-900/5">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-600">
                <CalendarDays aria-hidden="true" className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-sky-950">Informations clés</h2>
              <div className="mt-5 grid gap-3">
                {offer.facts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl bg-cyan-50/75 p-4">
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{fact.label}</div>
                    <div className="mt-1 text-base font-black text-sky-950">{fact.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-6 shadow-xl shadow-orange-900/5">
              <Sparkles aria-hidden="true" className="h-7 w-7 text-orange-500" />
              <h2 className="mt-4 text-xl font-black text-sky-950">Action recommandée</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                Les informations de ces flyers peuvent évoluer selon la disponibilité, les délais et les conditions
                des partenaires. Contactez JOS-Travel pour une validation personnalisée de votre dossier.
              </p>
            </div>
          </aside>

          <div className="space-y-7">
            <InfoList title="Ce que contient cette offre" items={offer.details} />
            {offer.requirements?.length ? <InfoList title="Documents ou exigences" items={offer.requirements} /> : null}
            {offer.benefits?.length ? <InfoList title="Avantages et programme" items={offer.benefits} /> : null}
            <DestinationGrid offer={offer} />
          </div>
        </div>
      </section>
    </main>
  );
}
