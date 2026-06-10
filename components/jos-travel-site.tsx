"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards,
  X
} from "lucide-react";
import { AiChatbot } from "@/components/ai-chatbot";
import { AuthWidget } from "@/components/auth-widget";
import {
  brand,
  faqs,
  featuredGallery,
  media,
  processSteps,
  scholarshipFlyers,
  scholarshipOffer,
  services,
  testimonials
} from "@/lib/site-data";

type IconType = LucideIcon;

const navItems = [
  { label: "Accueil", href: "#accueil" },
  { label: "Destinations", href: "#destinations" },
  { label: "Services", href: "#services" },
  { label: "Bourses", href: "#bourses" },
  { label: "À propos", href: "#apropos" },
  { label: "Galerie", href: "#galerie" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "Contact", href: "#contact" }
];

const destinationCards = [
  {
    title: "Kribi, Cameroun",
    tag: "Plages & détente",
    image: media[21]
  },
  {
    title: "Chutes & nature",
    tag: "Écotourisme",
    image: media[43]
  },
  {
    title: "Séjours premium",
    tag: "Villas & resorts",
    image: media[18]
  },
  {
    title: "International",
    tag: "Billets & visa",
    image: media[45]
  },
  {
    title: "Patrimoine camerounais",
    tag: "Culture & histoire",
    image: media[49]
  }
];

const processLabels = ["Consultation", "Planification", "Réservation", "Voyage", "Assistance continue"];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 }
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function whatsappUrl(message = "Bonjour JOS-Travel, je souhaite réserver ou obtenir des informations pour un voyage.") {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function SectionTitle({
  eyebrow,
  title,
  copy,
  align = "left",
  light = false
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-90px" }}
      variants={fadeInUp}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cx("max-w-3xl", align === "center" && "mx-auto text-center")}
    >
      <p className={cx("mb-4 text-sm font-black uppercase tracking-[0.3em]", light ? "text-cyan-300" : "text-cyan-600")}>
        {eyebrow}
      </p>
      <h2 className={cx("text-balance text-4xl font-black leading-tight md:text-6xl", light ? "text-white" : "text-sky-950")}>
        {title}
      </h2>
      {copy ? (
        <p className={cx("mt-6 text-base leading-8 md:text-lg", light ? "text-sky-50/85" : "text-slate-600")}>
          {copy}
        </p>
      ) : null}
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={cx(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
        scrolled ? "mx-3 mt-3 md:mx-10" : "mx-0 mt-0"
      )}
    >
      <nav
        className={cx(
          "mx-auto flex max-w-7xl items-center justify-between px-4 py-4 transition-all duration-500 md:px-5",
          scrolled
            ? "rounded-full border border-white/50 bg-white/78 shadow-2xl shadow-sky-900/10 backdrop-blur-2xl"
            : "bg-transparent"
        )}
      >
        <a href="#accueil" className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-white/50">
            <Image
              src="/media/jos-logo.jpeg"
              alt="Logo JOS-Travel"
              width={120}
              height={120}
              priority
              className="h-full w-full object-cover"
            />
          </span>
          <span className="leading-tight">
            <span className={cx("block text-lg font-black tracking-tight", scrolled ? "text-sky-950" : "text-white")}>
              {brand.name}
            </span>
            <span className={cx("hidden text-xs font-semibold sm:block", scrolled ? "text-cyan-600" : "text-cyan-100")}>
              Agence tourisme premium
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cx(
                "text-sm font-semibold transition hover:text-cyan-400",
                scrolled ? "text-slate-700" : "text-white"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-5 py-2 text-sm font-black text-white shadow-lg shadow-cyan-500/30 transition hover:scale-105 lg:inline-flex"
          >
            WhatsApp
          </a>
          <AuthWidget />
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/88 text-sky-950 shadow-xl xl:hidden"
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 mt-3 rounded-[2rem] border border-white/60 bg-white/92 p-4 shadow-2xl backdrop-blur-xl xl:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-cyan-50"
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      ) : null}
    </motion.header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 180]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, reduceMotion ? 1 : 0.52]);

  return (
    <section id="accueil" className="relative min-h-screen overflow-hidden">
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
        <Image
          src="/media/jos-hero-reference.jpeg"
          alt="Plage vue du ciel avec bateaux et eau turquoise"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/78 via-sky-900/38 to-cyan-700/25" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#F8F6F2] to-transparent" />
      </motion.div>

      <motion.div
        className="absolute right-[8%] top-28 hidden text-white/80 lg:block"
        animate={reduceMotion ? undefined : { x: [-20, 20, -20], y: [0, -12, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Plane aria-hidden="true" className="h-16 w-16" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 pt-28">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-bold text-cyan-50 backdrop-blur-xl"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4 text-cyan-200" />
            {brand.legal}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-balance text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            JOS-Travel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl"
          >
            Chaque voyage devient une histoire inoubliable.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-7 max-w-2xl text-lg font-medium leading-8 text-sky-50 md:text-2xl"
          >
            Découvrez le Cameroun et le monde autrement avec une agence humaine, précise et
            disponible à chaque étape.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#contact"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-black text-sky-800 shadow-2xl shadow-white/20 transition hover:scale-105"
            >
              Réserver maintenant
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-500/30 transition hover:scale-105"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              Parler sur WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-white/80"
        animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-xs font-bold uppercase tracking-[0.35em]">Explorer</div>
        <div className="mx-auto mt-3 h-10 w-6 rounded-full border border-white/50 p-1">
          <div className="mx-auto h-2 w-2 rounded-full bg-white" />
        </div>
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section id="apropos" className="relative px-5 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative h-[560px] overflow-hidden rounded-[3rem] shadow-2xl">
            <Image
              src="/media/jos-travel-02.jpeg"
              alt="Affiche officielle JOS-Travel"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 rounded-[2rem] border border-white/60 bg-white/78 p-6 shadow-2xl backdrop-blur-2xl md:right-10">
            <div className="flex items-center gap-3 text-sky-900">
              <ShieldCheck aria-hidden="true" className="h-8 w-8 text-cyan-500" />
              <span className="text-xl font-black">Voyage sans stress</span>
            </div>
            <p className="mt-2 max-w-xs text-sm font-medium text-slate-600">
              Un accompagnement humain, précis et disponible 24h/24.
            </p>
          </div>
        </motion.div>

        <div>
          <SectionTitle
            eyebrow="Qui sommes-nous ?"
            title="L'art de créer des voyages qui vous ressemblent."
            copy="Chez JOS-Travel, nous ne planifions pas seulement des trajets : nous composons des expériences. Notre équipe accompagne les particuliers et les entreprises avec une expertise locale et internationale, des conseils personnalisés et une assistance continue."
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <Stat value="24h/24" label="Assistance" icon={CalendarDays} />
            <Stat value="+40" label="Destinations" icon={Globe2} />
            <Stat value="100%" label="Sur mesure" icon={Users} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, icon: Icon, dark = false }: { value: string; label: string; icon: IconType; dark?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={cx(
        "rounded-3xl border p-5 shadow-xl backdrop-blur-xl",
        dark
          ? "border-white/10 bg-white/10 shadow-cyan-950/10"
          : "border-white/50 bg-white/65 shadow-sky-900/10"
      )}
    >
      <Icon aria-hidden="true" className={cx("mb-3 h-7 w-7", dark ? "text-cyan-300" : "text-cyan-500")} />
      <div className={cx("text-3xl font-black", dark ? "text-white" : "text-sky-900")}>{value}</div>
      <div className={cx("mt-1 text-sm font-medium", dark ? "text-sky-100" : "text-slate-600")}>{label}</div>
    </motion.div>
  );
}

function Services() {
  return (
    <section id="services" className="relative bg-gradient-to-b from-white to-cyan-50/60 px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Nos services"
          title="Tout pour voyager avec élégance, sécurité et sérénité."
          copy="Chaque service répond à une étape concrète du voyage : s'inspirer, réserver, préparer, se déplacer, découvrir, puis revenir avec une histoire."
          align="center"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04, duration: 0.55 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={cx(
                  "group rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-sky-900/5 backdrop-blur-xl transition hover:shadow-cyan-500/20",
                  service.featured && "sm:col-span-2 lg:col-span-2"
                )}
              >
                <div className={cx("grid gap-5", service.image && "md:grid-cols-[0.82fr_1fr] md:items-center")}>
                  {service.image ? (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-cyan-50 shadow-lg">
                      <Image src={service.image} alt={`Illustration ${service.title}`} fill className="object-cover" sizes="(min-width: 1024px) 260px, 90vw" />
                    </div>
                  ) : null}
                  <div>
                    <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-100 to-sky-100 text-sky-700 transition group-hover:scale-110">
                      <Icon aria-hidden="true" className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-black text-sky-950">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{service.copy}</p>
                    {service.href ? (
                      <a
                        href={service.href}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-950 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-800"
                      >
                        {service.cta ?? "En savoir plus"}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Scholarships() {
  const message = [
    "Bonjour JOS-Travel, je souhaite être accompagné pour le service Bourses d'études en Chine.",
    "Je veux vérifier mon éligibilité, préparer mon dossier et connaître les prochaines étapes."
  ].join("\n\n");

  return (
    <section id="bourses" className="relative overflow-hidden bg-[#F8F6F2] px-5 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_85%_40%,rgba(251,146,60,0.14),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-5 sm:relative sm:min-h-[610px] sm:block"
        >
          <div className="relative aspect-[0.7] overflow-hidden rounded-[3rem] border border-white bg-white shadow-2xl sm:absolute sm:left-0 sm:top-0 sm:h-[560px] sm:w-[76%]">
            <Image
              src={scholarshipFlyers[0].src}
              alt={scholarshipFlyers[0].alt}
              fill
              sizes="(min-width: 1024px) 430px, 86vw"
              className="object-contain p-2"
            />
          </div>
          <div className="relative aspect-[0.7] overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-2xl shadow-sky-900/15 sm:absolute sm:bottom-0 sm:right-0 sm:h-[430px] sm:w-[54%]">
            <Image
              src={scholarshipFlyers[1].src}
              alt={scholarshipFlyers[1].alt}
              fill
              sizes="(min-width: 1024px) 320px, 60vw"
              className="object-contain p-2"
            />
          </div>
        </motion.div>

        <div>
          <SectionTitle
            eyebrow="Bourses d'études"
            title="Étudiez en Chine avec une bourse complète."
            copy="Une rubrique dédiée aux étudiants : JOS-Travel vous accompagne pour vérifier votre profil, constituer le dossier et suivre la procédure jusqu'au dépôt."
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <Stat value="Diploma" label="Master & PhD" icon={GraduationCap} />
            <Stat value="100 000 F" label="Ouverture dossier" icon={WalletCards} />
            <Stat value="10 juin" label="Fin promotion" icon={CalendarDays} />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[...scholarshipOffer.conditions.slice(0, 2), ...scholarshipOffer.documents.slice(0, 2)].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/78 px-5 py-4 text-sm font-bold text-sky-950 shadow-lg shadow-sky-900/5">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-cyan-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="/bourses-etudes"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-sky-950 px-7 py-4 font-black text-white shadow-2xl shadow-sky-900/15 transition hover:scale-105"
            >
              Voir la rubrique complète
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-500/25 transition hover:scale-105"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              Discuter sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Destinations() {
  return (
    <section id="destinations" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle
            eyebrow="Destinations"
            title="Des paysages qui appellent déjà votre prochain départ."
          />
          <p className="max-w-md text-lg leading-8 text-slate-600">
            Plages, chutes, safaris, villes modernes et séjours premium au Cameroun comme à
            l&apos;international.
          </p>
        </div>

        <div className="mt-12 flex gap-6 overflow-x-auto pb-6 [scrollbar-width:none]">
          {destinationCards.map((destination, index) => (
            <motion.article
              key={destination.title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative h-[470px] min-w-[320px] overflow-hidden rounded-[2.5rem] shadow-2xl md:min-w-[390px]"
            >
              <Image
                src={destination.image.src}
                alt={destination.title}
                fill
                sizes="390px"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-900/20 to-transparent" />
              <div className="absolute bottom-0 p-7 text-white">
                <div className="mb-3 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur-xl">
                  {destination.tag}
                </div>
                <h3 className="text-3xl font-black">{destination.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="galerie" className="bg-white px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Galerie"
          title="Une bibliothèque visuelle pensée comme un carnet de voyage."
          copy="Identité officielle, destinations, nature, vols, hôtels et moments de détente : les médias fournis deviennent la matière immersive du site."
          align="center"
        />

        <div className="mt-14 grid auto-rows-[260px] gap-5 md:grid-cols-4">
          {featuredGallery.map((item, index) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04 }}
              className={cx(
                "group relative overflow-hidden rounded-[2rem] bg-cyan-50 shadow-xl shadow-sky-900/8",
                index === 0 && "md:col-span-2 md:row-span-2",
                index === 1 && "md:col-span-2"
              )}
            >
              <Image
                src={item.image.src}
                alt={item.label}
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sky-950/80 to-transparent p-5 text-sm font-bold text-white">
                {item.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="temoignages" className="relative bg-sky-950 px-5 py-24 text-white">
      <div className="relative mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Expérience client"
          title="La confiance commence bien avant le décollage."
          align="center"
          light
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.author}
              whileHover={{ y: -8 }}
              className="rounded-[2rem] border border-white/10 bg-white/10 p-7 backdrop-blur-xl"
            >
              <div className="mb-5 flex gap-1 text-yellow-300" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-lg leading-8 text-sky-50">&quot;{testimonial.quote}&quot;</p>
              <div className="mt-7 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 font-black">
                  {testimonial.author[0]}
                </div>
                <div>
                  <div className="font-black">{testimonial.author}</div>
                  <div className="text-sm text-cyan-200">{testimonial.role}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Stat value="+500" label="Voyages organisés" icon={Plane} dark />
          <Stat value="98%" label="Clients satisfaits" icon={Star} dark />
          <Stat value="+40" label="Destinations couvertes" icon={MapPin} dark />
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow="Processus"
          title="Votre voyage, orchestré étape par étape."
          align="center"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-5">
          {processLabels.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative rounded-[2rem] border border-cyan-100 bg-white p-6 shadow-xl shadow-sky-900/5"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sky-600 to-cyan-400 font-black text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-black text-sky-950">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {processSteps[index]?.copy ?? "Un suivi clair, humain et professionnel."}
              </p>
              <CheckCircle2 aria-hidden="true" className="mt-6 h-6 w-6 text-green-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-5 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionTitle
          eyebrow="FAQ"
          title="Les réponses essentielles avant de préparer votre départ."
          copy="Une expérience premium commence aussi par des informations simples, lisibles et rassurantes."
        />

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="rounded-[2rem] border border-cyan-100 bg-[#F8F6F2]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-black text-sky-950"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <ChevronDown
                    aria-hidden="true"
                    className={cx("h-5 w-5 shrink-0 text-cyan-600 transition", isOpen && "rotate-180")}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    destination: "",
    service: "Type de service",
    message: ""
  });

  const href = useMemo(() => {
    const text = [
      "Bonjour JOS-Travel, je souhaite une offre personnalisée.",
      form.name ? `Nom: ${form.name}` : "",
      form.phone ? `Téléphone: ${form.phone}` : "",
      form.destination ? `Destination: ${form.destination}` : "",
      form.service && form.service !== "Type de service" ? `Service: ${form.service}` : "",
      form.message ? `Message: ${form.message}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    return whatsappUrl(text);
  }, [form]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="relative px-5 py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-sky-100" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionTitle
            eyebrow="Contact"
            title="Votre aventure commence avec JOS-Travel."
            copy="Envoyez votre besoin, votre destination ou votre idée de séjour. L'équipe vous accompagne pour construire une expérience claire, fiable et mémorable."
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {brand.phones.map((phone, index) => (
              <ContactCard
                key={phone}
                icon={index === 1 ? MessageCircle : Phone}
                label={phone}
                href={index === 1 ? whatsappUrl() : phoneHref(phone)}
                accent={index === 1 ? "green" : "blue"}
              />
            ))}
            <ContactCard icon={Mail} label={brand.email} href={`mailto:${brand.email}`} />
            <ContactCard icon={MapPin} label={brand.address} href={brand.mapsUrl} />
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] shadow-2xl">
            <iframe
              title="Carte JOS-Travel"
              className="h-72 w-full border-0 grayscale-[20%]"
              loading="lazy"
              src={brand.mapsEmbedUrl}
            />
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-[2.5rem] border border-white/60 bg-white/78 p-7 shadow-2xl backdrop-blur-2xl md:p-9"
        >
          <div className="mb-6 text-2xl font-black text-sky-950">Demander une offre personnalisée</div>
          <div className="grid gap-4">
            <Input
              placeholder="Nom complet"
              value={form.name}
              onChange={(value) => setForm((state) => ({ ...state, name: value }))}
            />
            <Input
              placeholder="Téléphone / WhatsApp"
              value={form.phone}
              onChange={(value) => setForm((state) => ({ ...state, phone: value }))}
            />
            <Input
              placeholder="Destination souhaitée"
              value={form.destination}
              onChange={(value) => setForm((state) => ({ ...state, destination: value }))}
            />
            <select
              value={form.service}
              onChange={(event) => setForm((state) => ({ ...state, service: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option>Type de service</option>
              <option>Voyage personnalisé</option>
              <option>Billet d&apos;avion</option>
              <option>Assistance visa</option>
              <option>Bourses d&apos;études</option>
              <option>Excursion</option>
              <option>Séminaire / événement</option>
            </select>
            <textarea
              value={form.message}
              onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))}
              rows={5}
              className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder="Décrivez votre projet de voyage"
            />
            <button
              type="submit"
              className="group mt-2 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-600 to-cyan-400 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-500/30 transition hover:scale-[1.02]"
            >
              Envoyer ma demande
              <Send aria-hidden="true" className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Input({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      placeholder={placeholder}
    />
  );
}

function ContactCard({
  icon: Icon,
  label,
  href,
  accent = "blue"
}: {
  icon: IconType;
  label: string;
  href: string;
  accent?: "blue" | "green";
}) {
  return (
    <a href={href} className="rounded-3xl bg-white p-5 shadow-xl transition hover:-translate-y-1">
      <Icon aria-hidden="true" className={cx("mb-3 h-6 w-6", accent === "green" ? "text-green-500" : "text-sky-600")} />
      <b className="break-words text-sky-950">{label}</b>
    </a>
  );
}

function Footer() {
  return (
    <footer className="bg-sky-950 px-5 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="text-3xl font-black">{brand.name}</div>
          <p className="mt-2 text-cyan-100">{brand.baseline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-sky-100">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-cyan-300">
              {item.label}
            </a>
          ))}
        </div>
        <div className="text-sm text-sky-200">© 2026 {brand.name}. Tous droits réservés.</div>
      </div>
    </footer>
  );
}

export function JosTravelSite() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F6F2] text-slate-900">
      <Header />
      <Hero />
      <Destinations />
      <Services />
      <Scholarships />
      <About />
      <Gallery />
      <Testimonials />
      <Process />
      <Faq />
      <Contact />
      <Footer />
      <AiChatbot />
    </main>
  );
}
