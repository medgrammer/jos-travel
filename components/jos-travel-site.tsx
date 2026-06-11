"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Globe2,
  GraduationCap,
  Headphones,
  LoaderCircle,
  Mail,
  MapPin,
  MapPinned,
  Menu,
  MessageCircle,
  Phone,
  Plane,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  WalletCards,
  X
} from "lucide-react";
import { AiChatbot } from "@/components/ai-chatbot";
import { AuthWidget } from "@/components/auth-widget";
import {
  brand,
  featuredGallery,
  media,
  scholarshipFlyers,
  scholarshipOffer,
} from "@/lib/site-data";

type IconType = LucideIcon;
type Language = "fr" | "en";

const siteCopy = {
  fr: {
    langLabel: "FR",
    nextLangLabel: "EN",
    languageAria: "Afficher le site en anglais",
    brandSubtitle: "Agence tourisme premium",
    whatsapp: "WhatsApp",
    nav: [
      { label: "Accueil", href: "#accueil" },
      { label: "Destinations", href: "#destinations" },
      { label: "Services", href: "#services" },
      { label: "Bourses", href: "#bourses" },
      { label: "À propos", href: "#apropos" },
      { label: "Galerie", href: "#galerie" },
      { label: "Témoignages", href: "#temoignages" },
      { label: "Contact", href: "#contact" }
    ],
    hero: {
      title: "JOS-Travel",
      subtitle: "Chaque voyage devient une histoire inoubliable.",
      copy:
        "Découvrez le Cameroun et le monde autrement avec une agence humaine, précise et disponible à chaque étape.",
      primaryCta: "Réserver maintenant",
      whatsappCta: "Parler sur WhatsApp",
      explore: "Explorer"
    },
    destinations: {
      eyebrow: "Destinations",
      title: "Des paysages qui appellent déjà votre prochain départ.",
      copy:
        "Plages, chutes, safaris, villes modernes et séjours premium au Cameroun comme à l'international.",
      cards: [
        { title: "Kribi, Cameroun", tag: "Plages & détente", image: media[21] },
        { title: "Chutes & nature", tag: "Écotourisme", image: media[43] },
        { title: "Séjours premium", tag: "Villas & resorts", image: media[18] },
        { title: "International", tag: "Billets & visa", image: media[45] },
        { title: "Patrimoine camerounais", tag: "Culture & histoire", image: media[49] }
      ]
    },
    services: {
      eyebrow: "Services & procédure de réservation",
      title: "Tout est clair avant de confirmer votre voyage.",
      copy:
        "Choisissez le service, envoyez vos informations essentielles, recevez un devis détaillé, puis confirmez avec l'acompte adapté au fournisseur.",
      badge: "Devis détaillé sous 24h",
      introTitle: "JOS-Travel coordonne chaque étape : vol, hôtel, visa, assurance, transport et assistance locale.",
      introCopy:
        "Nos offres couvrent les voyages loisirs, safaris, études, hôtels, voitures, visas, événements et partenariats tour-opérateurs. Tous les devis sont valables 7 jours, selon saison et disponibilité.",
      quoteCta: "Demander un devis",
      items: [
        {
          title: "Packages touristiques",
          tag: "Leisure, safari, study tours",
          copy:
            "Envoyez destination, dates et nombre de voyageurs. Nous préparons un devis complet sous 24h.",
          details: [
            "Vols, hôtel, visa, transferts et visites guidées",
            "Safaris au Kenya, Tanzanie, Ouganda et Afrique du Sud",
            "Game drives et assistance terrain"
          ],
          icon: MapPinned,
          image: media[9].src
        },
        {
          title: "Réservations d'hôtels",
          tag: "Business ou loisirs",
          copy:
            "Réservation d'hôtels dans le monde entier avec options comparées selon votre budget.",
          details: [
            "Dates check-in / check-out et ville nécessaires",
            "Prix, petit-déjeuner et politique d'annulation",
            "20% d'acompte pour confirmer"
          ],
          icon: BedIcon,
          image: media[28].src
        },
        {
          title: "Location de véhicules",
          tag: "Aéroport ou ville",
          copy:
            "Pick-up aéroport et location en ville au Cameroun et dans les pays partenaires.",
          details: [
            "Type de véhicule, chauffeur en option",
            "Assurance et kilométrage inclus dans le devis",
            "Réservation 48h à l'avance"
          ],
          icon: Car,
          image: media[33].src
        },
        {
          title: "Assurance voyage",
          tag: "Sécurité internationale",
          copy:
            "Couverture médicale, annulation, bagages perdus et rapatriement selon votre profil.",
          details: [
            "Obligatoire pour Schengen et Dubai",
            "Recommandée pour tous les voyages internationaux",
            "Prime selon destination, durée et âge"
          ],
          icon: ShieldCheck,
          image: media[41].src
        },
        {
          title: "Services visa",
          tag: "Touriste, étudiant, bourse",
          copy:
            "Assistance visa pour Chine, Dubai, Turquie, Schengen et autres destinations.",
          details: [
            "Préparation documentaire",
            "Rendez-vous ambassade",
            "Suivi de demande selon délais du pays"
          ],
          icon: FileCheck2,
          image: media[4].src
        },
        {
          title: "Événements & groupes",
          tag: "Retraites, familles, tours",
          copy:
            "Coordination complète des voyages d'entreprise, événements familiaux et groupes.",
          details: [
            "Réservation lieu, catering et transport",
            "Coordination des tours et excursions",
            "Demande 30 jours à l'avance conseillée"
          ],
          icon: BriefcaseBusiness,
          image: media[48].src
        },
        {
          title: "Partenariats tour-opérateurs",
          tag: "Guides locaux licenciés",
          copy:
            "Opérateurs locaux sélectionnés pour safaris, city tours et support 24/7 sur place.",
          details: [
            "Contact WhatsApp JOS-Travel",
            "Guide local pendant le voyage",
            "Assistance terrain continue"
          ],
          icon: Users,
          image: media[16].src
        },
        {
          title: "Booking & paiement",
          tag: "Confirmation transparente",
          copy:
            "Acomptes adaptés au service et solde réglé avant départ pour sécuriser vos réservations.",
          details: [
            "Tourisme, safari, événements : 60%",
            "Hôtel, voiture, assurance : 20 à 50%",
            "Mobile Money, virement ou cash à Douala"
          ],
          icon: WalletCards,
          image: media[1].src
        },
        {
          title: "Support voyage",
          tag: "Avant le départ",
          copy:
            "Itinéraire final, vouchers et contact WhatsApp support envoyés avant le voyage.",
          details: [
            "Documents transmis 7 jours avant départ",
            "Support WhatsApp dédié",
            "Suivi humain jusqu'au retour"
          ],
          icon: Headphones,
          image: media[45].src
        }
      ],
      payment: {
        title: "Règles de réservation",
        rows: [
          "Tourisme, safari, événements : 60% d'acompte pour confirmer.",
          "Hôtel, location de voiture, assurance : 20 à 50% selon fournisseur.",
          "Solde dû 20 jours avant le voyage.",
          "Paiement : Mobile Money, virement bancaire ou espèces au bureau de Douala."
        ],
        note: "Tous les devis sont valables 7 jours. Les prix évoluent selon saison et disponibilité."
      }
    },
    scholarship: {
      eyebrow: "Bourses d'études",
      title: "Étudiez en Chine avec une bourse complète.",
      copy:
        "Une rubrique dédiée aux étudiants : JOS-Travel vous accompagne pour vérifier votre profil, constituer le dossier et suivre la procédure jusqu'au dépôt.",
      stats: [
        { value: "Diploma", label: "Master & PhD" },
        { value: "100 000 F", label: "Ouverture dossier" },
        { value: "10 juin", label: "Fin promotion" }
      ],
      pageCta: "Voir la rubrique complète",
      whatsappCta: "Discuter sur WhatsApp",
      whatsappMessage:
        "Bonjour JOS-Travel, je souhaite être accompagné pour le service Bourses d'études en Chine.\n\nJe veux vérifier mon éligibilité, préparer mon dossier et connaître les prochaines étapes."
    },
    about: {
      eyebrow: "Qui sommes-nous ?",
      title: "L'art de créer des voyages qui vous ressemblent.",
      copy:
        "Chez JOS-Travel, nous ne planifions pas seulement des trajets : nous composons des expériences. Notre équipe accompagne les particuliers et les entreprises avec une expertise locale et internationale, des conseils personnalisés et une assistance continue.",
      badgeTitle: "Voyage sans stress",
      badgeCopy: "Un accompagnement humain, précis et disponible 24h/24.",
      stats: [
        { value: "24h/24", label: "Assistance", icon: CalendarDays },
        { value: "+40", label: "Destinations", icon: Globe2 },
        { value: "100%", label: "Sur mesure", icon: Users }
      ]
    },
    gallery: {
      eyebrow: "Galerie",
      title: "Une bibliothèque visuelle pensée comme un carnet de voyage.",
      copy:
        "Identité officielle, destinations, nature, vols, hôtels et moments de détente : les médias fournis deviennent la matière immersive du site."
    },
    testimonials: {
      eyebrow: "Expérience client",
      title: "La confiance commence bien avant le décollage.",
      items: [
        {
          quote:
            "L'équipe a transformé un départ compliqué en expérience fluide. Les formalités, l'hôtel et les transferts étaient parfaitement coordonnés.",
          author: "Nadia M.",
          role: "Voyage familial"
        },
        {
          quote:
            "Pour notre séminaire, JOS-Travel a trouvé les bons lieux, les bons trajets et un accompagnement constant. Très professionnel.",
          author: "Arnaud T.",
          role: "Déplacement d'entreprise"
        },
        {
          quote:
            "Le suivi WhatsApp pendant le séjour nous a rassurés. Réponse rapide, conseils pratiques et vraie disponibilité.",
          author: "Grace B.",
          role: "Séjour premium"
        }
      ],
      stats: [
        { value: "+500", label: "Voyages organisés", icon: Plane },
        { value: "98%", label: "Clients satisfaits", icon: Star },
        { value: "+40", label: "Destinations couvertes", icon: MapPin }
      ]
    },
    process: {
      eyebrow: "Processus",
      title: "Votre voyage, orchestré étape par étape.",
      labels: ["Consultation", "Planification", "Réservation", "Voyage", "Assistance continue"],
      steps: [
        "Nous clarifions votre destination, vos dates, votre budget, vos attentes et vos contraintes.",
        "L'équipe propose un itinéraire, sélectionne les meilleures options et affine chaque détail.",
        "Billets, hôtels, visa, transferts et documents sont coordonnés avec un suivi rigoureux.",
        "Vous voyagez avec les bons vouchers, contacts et instructions avant le départ.",
        "Vous restez accompagné avant, pendant et après le voyage, avec une équipe disponible."
      ]
    },
    faq: {
      eyebrow: "FAQ",
      title: "Les réponses essentielles avant de préparer votre départ.",
      copy: "Une expérience premium commence aussi par des informations simples, lisibles et rassurantes.",
      items: [
        {
          question: "Combien de temps un devis reste-t-il valable ?",
          answer: "Chaque devis JOS-Travel est valable 7 jours. Les prix peuvent changer selon la saison et la disponibilité."
        },
        {
          question: "Quels moyens de paiement sont acceptés ?",
          answer: "Vous pouvez payer par Mobile Money, virement bancaire ou espèces au bureau de Douala."
        },
        {
          question: "Quand reçoit-on les documents de voyage ?",
          answer: "L'itinéraire final, les vouchers et le contact support WhatsApp sont envoyés 7 jours avant le départ."
        }
      ]
    },
    contact: {
      eyebrow: "Contact",
      title: "Votre aventure commence avec JOS-Travel.",
      copy:
        "Envoyez votre besoin, votre destination ou votre idée de séjour. L'équipe vous accompagne pour construire une expérience claire, fiable et mémorable.",
      formTitle: "Demander une offre personnalisée",
      placeholders: {
        name: "Nom complet",
        email: "Email (optionnel)",
        country: "Pays",
        searchCountry: "Rechercher un pays...",
        phone: "Téléphone / WhatsApp",
        destination: "Destination souhaitée",
        service: "Type de service",
        message: "Décrivez votre projet de voyage"
      },
      options: [
        "Type de service",
        "Package touristique",
        "Réservation hôtel",
        "Location de véhicule",
        "Assurance voyage",
        "Assistance visa",
        "Bourses d'études",
        "Événement / groupe"
      ],
      submit: "Envoyer ma demande",
      sending: "Envoi en cours...",
      successTitle: "Demande envoyée",
      success:
        "Merci. Votre demande a bien été enregistrée. L'équipe JOS-Travel vous répondra rapidement.",
      error: "Impossible d'envoyer la demande pour le moment. Merci de réessayer.",
      whatsappIntro: "Bonjour JOS-Travel, je souhaite une offre personnalisée.",
      fields: {
        name: "Nom",
        email: "Email",
        country: "Pays",
        phone: "Téléphone",
        destination: "Destination",
        service: "Service",
        message: "Message"
      }
    },
    footerRights: "Tous droits réservés."
  },
  en: {
    langLabel: "EN",
    nextLangLabel: "FR",
    languageAria: "Show the site in French",
    brandSubtitle: "Premium travel agency",
    whatsapp: "WhatsApp",
    nav: [
      { label: "Home", href: "#accueil" },
      { label: "Destinations", href: "#destinations" },
      { label: "Services", href: "#services" },
      { label: "Scholarships", href: "#bourses" },
      { label: "About", href: "#apropos" },
      { label: "Gallery", href: "#galerie" },
      { label: "Testimonials", href: "#temoignages" },
      { label: "Contact", href: "#contact" }
    ],
    hero: {
      title: "JOS-Travel",
      subtitle: "Every trip becomes an unforgettable story.",
      copy:
        "Discover Cameroon and the world differently with a human, precise agency available at every step.",
      primaryCta: "Book now",
      whatsappCta: "Talk on WhatsApp",
      explore: "Explore"
    },
    destinations: {
      eyebrow: "Destinations",
      title: "Landscapes already calling your next departure.",
      copy:
        "Beaches, waterfalls, safaris, modern cities and premium stays in Cameroon and around the world.",
      cards: [
        { title: "Kribi, Cameroon", tag: "Beaches & leisure", image: media[21] },
        { title: "Waterfalls & nature", tag: "Ecotourism", image: media[43] },
        { title: "Premium stays", tag: "Villas & resorts", image: media[18] },
        { title: "International", tag: "Flights & visa", image: media[45] },
        { title: "Cameroonian heritage", tag: "Culture & history", image: media[49] }
      ]
    },
    services: {
      eyebrow: "Services & booking procedure",
      title: "Everything is clear before you confirm your trip.",
      copy:
        "Choose the service, send your essential information, receive a detailed quote, then confirm with the supplier-specific deposit.",
      badge: "Detailed quote within 24h",
      introTitle: "JOS-Travel coordinates every step: flight, hotel, visa, insurance, transport and local support.",
      introCopy:
        "Our offers cover leisure travel, safaris, study tours, hotels, cars, visas, events and tour-operator partnerships. All quotes are valid for 7 days, subject to season and availability.",
      quoteCta: "Request a quote",
      items: [
        {
          title: "Tourism packages",
          tag: "Leisure, safari, study tours",
          copy:
            "Send destination, dates and number of travelers. We prepare a complete quote within 24h.",
          details: [
            "Flights, hotel, visa, transfers and guided tours",
            "Safari game drives in Kenya, Tanzania, Uganda and South Africa",
            "On-ground support during the trip"
          ],
          icon: MapPinned,
          image: media[9].src
        },
        {
          title: "Hotel reservations",
          tag: "Business or leisure",
          copy:
            "Worldwide hotel booking with options compared according to your budget.",
          details: [
            "Check-in / check-out dates and location required",
            "Price, breakfast and cancellation policy",
            "20% deposit confirms booking"
          ],
          icon: BedIcon,
          image: media[28].src
        },
        {
          title: "Car rentals",
          tag: "Airport or city",
          copy:
            "Airport pick-up and city rentals in Cameroon and partner countries.",
          details: [
            "Vehicle type and driver option",
            "Insurance and mileage included in the quote",
            "Book 48h in advance"
          ],
          icon: Car,
          image: media[33].src
        },
        {
          title: "Trip insurance",
          tag: "International safety",
          copy:
            "Medical emergencies, trip cancellation, lost baggage and repatriation coverage.",
          details: [
            "Required for Schengen and Dubai",
            "Recommended for all international trips",
            "Premium depends on destination, duration and age"
          ],
          icon: ShieldCheck,
          image: media[41].src
        },
        {
          title: "Visa services",
          tag: "Tourist, student, scholarship",
          copy:
            "Visa assistance for China, Dubai, Turkey, Schengen and other destinations.",
          details: [
            "Document preparation",
            "Embassy appointment",
            "Application follow-up according to country timelines"
          ],
          icon: FileCheck2,
          image: media[4].src
        },
        {
          title: "Events & group travel",
          tag: "Retreats, family events, tours",
          copy:
            "Full coordination for corporate retreats, family events and group tours.",
          details: [
            "Venue booking, catering and transport",
            "Tour and excursion coordination",
            "Request 30 days in advance for best rates"
          ],
          icon: BriefcaseBusiness,
          image: media[48].src
        },
        {
          title: "Tour operator partnerships",
          tag: "Licensed local guides",
          copy:
            "Selected local operators for safari, city tours and 24/7 on-ground support.",
          details: [
            "Direct JOS-Travel WhatsApp contact",
            "Local guide during your trip",
            "Continuous on-ground assistance"
          ],
          icon: Users,
          image: media[16].src
        },
        {
          title: "Booking & payment",
          tag: "Transparent confirmation",
          copy:
            "Deposits adapted to the service and balance paid before departure to secure bookings.",
          details: [
            "Tourism, safari, events: 60%",
            "Hotel, car rental, insurance: 20 to 50%",
            "Mobile Money, bank transfer or cash at Douala office"
          ],
          icon: WalletCards,
          image: media[1].src
        },
        {
          title: "Support",
          tag: "Before departure",
          copy:
            "Final itinerary, vouchers and WhatsApp support contact sent before travel.",
          details: [
            "Documents sent 7 days before departure",
            "Dedicated WhatsApp support",
            "Human follow-up until return"
          ],
          icon: Headphones,
          image: media[45].src
        }
      ],
      payment: {
        title: "Booking rules",
        rows: [
          "Tourism, safari, events: 60% deposit to confirm.",
          "Hotel, car rental, insurance: 20 to 50% depending on supplier.",
          "Balance due 20 days before travel.",
          "Payment: Mobile Money, bank transfer, or cash at Douala office."
        ],
        note: "All quotes are valid for 7 days. Prices change with season and availability."
      }
    },
    scholarship: {
      eyebrow: "Study scholarships",
      title: "Study in China with a full scholarship.",
      copy:
        "A dedicated section for students: JOS-Travel helps you verify your profile, prepare the file and follow the procedure until submission.",
      stats: [
        { value: "Diploma", label: "Master & PhD" },
        { value: "100,000 XAF", label: "File opening" },
        { value: "June 10", label: "Promotion ends" }
      ],
      pageCta: "View full section",
      whatsappCta: "Talk on WhatsApp",
      whatsappMessage:
        "Hello JOS-Travel, I would like support for the Study Scholarships in China service.\n\nI want to verify my eligibility, prepare my file and understand the next steps."
    },
    about: {
      eyebrow: "Who are we?",
      title: "The art of creating trips that feel like you.",
      copy:
        "At JOS-Travel, we do not only plan routes: we compose experiences. Our team supports individuals and companies with local and international expertise, personalized advice and continuous assistance.",
      badgeTitle: "Stress-free travel",
      badgeCopy: "Human, precise support available 24/7.",
      stats: [
        { value: "24/7", label: "Support", icon: CalendarDays },
        { value: "+40", label: "Destinations", icon: Globe2 },
        { value: "100%", label: "Tailor-made", icon: Users }
      ]
    },
    gallery: {
      eyebrow: "Gallery",
      title: "A visual library designed like a travel journal.",
      copy:
        "Official identity, destinations, nature, flights, hotels and relaxing moments: your media becomes the immersive material of the site."
    },
    testimonials: {
      eyebrow: "Client experience",
      title: "Trust begins long before takeoff.",
      items: [
        {
          quote:
            "The team turned a complicated departure into a smooth experience. Formalities, hotel and transfers were perfectly coordinated.",
          author: "Nadia M.",
          role: "Family trip"
        },
        {
          quote:
            "For our seminar, JOS-Travel found the right venues, routes and constant support. Very professional.",
          author: "Arnaud T.",
          role: "Corporate travel"
        },
        {
          quote:
            "The WhatsApp support during the stay reassured us. Fast replies, practical advice and real availability.",
          author: "Grace B.",
          role: "Premium stay"
        }
      ],
      stats: [
        { value: "+500", label: "Trips organized", icon: Plane },
        { value: "98%", label: "Satisfied clients", icon: Star },
        { value: "+40", label: "Covered destinations", icon: MapPin }
      ]
    },
    process: {
      eyebrow: "Process",
      title: "Your trip, orchestrated step by step.",
      labels: ["Consultation", "Planning", "Booking", "Travel", "Continuous support"],
      steps: [
        "We clarify your destination, dates, budget, expectations and constraints.",
        "The team proposes an itinerary, selects the best options and refines each detail.",
        "Flights, hotels, visa, transfers and documents are coordinated with rigorous follow-up.",
        "You travel with the right vouchers, contacts and instructions before departure.",
        "You remain supported before, during and after the trip by an available team."
      ]
    },
    faq: {
      eyebrow: "FAQ",
      title: "Essential answers before preparing your departure.",
      copy: "A premium experience also starts with simple, readable and reassuring information.",
      items: [
        {
          question: "How long is a quote valid?",
          answer: "Each JOS-Travel quote is valid for 7 days. Prices may change according to season and availability."
        },
        {
          question: "Which payment methods are accepted?",
          answer: "You can pay via Mobile Money, bank transfer or cash at the Douala office."
        },
        {
          question: "When do we receive travel documents?",
          answer: "The final itinerary, vouchers and WhatsApp support contact are sent 7 days before departure."
        }
      ]
    },
    contact: {
      eyebrow: "Contact",
      title: "Your adventure begins with JOS-Travel.",
      copy:
        "Send your need, destination or travel idea. The team helps you build a clear, reliable and memorable experience.",
      formTitle: "Request a personalized offer",
      placeholders: {
        name: "Full name",
        email: "Email (optional)",
        country: "Country",
        searchCountry: "Search a country...",
        phone: "Phone / WhatsApp",
        destination: "Desired destination",
        service: "Service type",
        message: "Describe your travel project"
      },
      options: [
        "Service type",
        "Tourism package",
        "Hotel reservation",
        "Car rental",
        "Trip insurance",
        "Visa services",
        "Study scholarships",
        "Event / group travel"
      ],
      submit: "Send my request",
      sending: "Sending...",
      successTitle: "Request sent",
      success:
        "Thank you. Your request has been saved. The JOS-Travel team will reply shortly.",
      error: "We could not send the request right now. Please try again.",
      whatsappIntro: "Hello JOS-Travel, I would like a personalized offer.",
      fields: {
        name: "Name",
        email: "Email",
        country: "Country",
        phone: "Phone",
        destination: "Destination",
        service: "Service",
        message: "Message"
      }
    },
    footerRights: "All rights reserved."
  }
} as const;

type SiteCopy = (typeof siteCopy)[Language];

function BedIcon(props: ComponentProps<"svg">) {
  return <Ticket {...props} />;
}

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

type CountryOption = {
  code: string;
  dialCode: string;
  nameFr: string;
  nameEn: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "CM", dialCode: "+237", nameFr: "Cameroun", nameEn: "Cameroon" },
  { code: "FR", dialCode: "+33", nameFr: "France", nameEn: "France" },
  { code: "CN", dialCode: "+86", nameFr: "Chine", nameEn: "China" },
  { code: "AE", dialCode: "+971", nameFr: "Émirats arabes unis", nameEn: "United Arab Emirates" },
  { code: "TR", dialCode: "+90", nameFr: "Turquie", nameEn: "Turkey" },
  { code: "ZA", dialCode: "+27", nameFr: "Afrique du Sud", nameEn: "South Africa" },
  { code: "KE", dialCode: "+254", nameFr: "Kenya", nameEn: "Kenya" },
  { code: "TZ", dialCode: "+255", nameFr: "Tanzanie", nameEn: "Tanzania" },
  { code: "UG", dialCode: "+256", nameFr: "Ouganda", nameEn: "Uganda" },
  { code: "US", dialCode: "+1", nameFr: "États-Unis", nameEn: "United States" },
  { code: "CA", dialCode: "+1", nameFr: "Canada", nameEn: "Canada" },
  { code: "GB", dialCode: "+44", nameFr: "Royaume-Uni", nameEn: "United Kingdom" },
  { code: "BE", dialCode: "+32", nameFr: "Belgique", nameEn: "Belgium" },
  { code: "CH", dialCode: "+41", nameFr: "Suisse", nameEn: "Switzerland" },
  { code: "DE", dialCode: "+49", nameFr: "Allemagne", nameEn: "Germany" },
  { code: "IT", dialCode: "+39", nameFr: "Italie", nameEn: "Italy" },
  { code: "ES", dialCode: "+34", nameFr: "Espagne", nameEn: "Spain" },
  { code: "PT", dialCode: "+351", nameFr: "Portugal", nameEn: "Portugal" },
  { code: "NL", dialCode: "+31", nameFr: "Pays-Bas", nameEn: "Netherlands" },
  { code: "LU", dialCode: "+352", nameFr: "Luxembourg", nameEn: "Luxembourg" },
  { code: "MA", dialCode: "+212", nameFr: "Maroc", nameEn: "Morocco" },
  { code: "DZ", dialCode: "+213", nameFr: "Algérie", nameEn: "Algeria" },
  { code: "TN", dialCode: "+216", nameFr: "Tunisie", nameEn: "Tunisia" },
  { code: "SN", dialCode: "+221", nameFr: "Sénégal", nameEn: "Senegal" },
  { code: "CI", dialCode: "+225", nameFr: "Côte d'Ivoire", nameEn: "Ivory Coast" },
  { code: "GA", dialCode: "+241", nameFr: "Gabon", nameEn: "Gabon" },
  { code: "CG", dialCode: "+242", nameFr: "Congo", nameEn: "Congo" },
  { code: "CD", dialCode: "+243", nameFr: "RD Congo", nameEn: "DR Congo" },
  { code: "CF", dialCode: "+236", nameFr: "Centrafrique", nameEn: "Central African Republic" },
  { code: "TD", dialCode: "+235", nameFr: "Tchad", nameEn: "Chad" },
  { code: "GQ", dialCode: "+240", nameFr: "Guinée équatoriale", nameEn: "Equatorial Guinea" },
  { code: "NG", dialCode: "+234", nameFr: "Nigeria", nameEn: "Nigeria" },
  { code: "GH", dialCode: "+233", nameFr: "Ghana", nameEn: "Ghana" },
  { code: "BJ", dialCode: "+229", nameFr: "Bénin", nameEn: "Benin" },
  { code: "TG", dialCode: "+228", nameFr: "Togo", nameEn: "Togo" },
  { code: "RW", dialCode: "+250", nameFr: "Rwanda", nameEn: "Rwanda" },
  { code: "BI", dialCode: "+257", nameFr: "Burundi", nameEn: "Burundi" },
  { code: "ET", dialCode: "+251", nameFr: "Éthiopie", nameEn: "Ethiopia" },
  { code: "EG", dialCode: "+20", nameFr: "Égypte", nameEn: "Egypt" },
  { code: "IN", dialCode: "+91", nameFr: "Inde", nameEn: "India" },
  { code: "JP", dialCode: "+81", nameFr: "Japon", nameEn: "Japan" },
  { code: "KR", dialCode: "+82", nameFr: "Corée du Sud", nameEn: "South Korea" },
  { code: "BR", dialCode: "+55", nameFr: "Brésil", nameEn: "Brazil" },
  { code: "MX", dialCode: "+52", nameFr: "Mexique", nameEn: "Mexico" },
  { code: "AU", dialCode: "+61", nameFr: "Australie", nameEn: "Australia" }
];

function getCountryByCode(code: string) {
  return COUNTRY_OPTIONS.find((country) => country.code === code) ?? COUNTRY_OPTIONS[0];
}

function getCountryLabel(country: CountryOption, language: Language) {
  return language === "en" ? country.nameEn : country.nameFr;
}

function buildFullContactPhone(dialCode: string, phone: string) {
  const digits = phone.replace(/[^\d]/g, "").replace(/^0+/, "");
  return digits ? `${dialCode}${digits}` : "";
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

function LanguageToggle({
  copy,
  onToggle,
  scrolled
}: {
  copy: SiteCopy;
  onToggle: () => void;
  scrolled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={copy.languageAria}
      className={cx(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-black shadow-sm transition hover:scale-105",
        scrolled ? "border-cyan-100 bg-white text-sky-950" : "border-white/30 bg-white/15 text-white backdrop-blur-xl"
      )}
    >
      <Globe2 aria-hidden="true" className="h-4 w-4" />
      <span>{copy.langLabel}</span>
      <span className="opacity-50">/</span>
      <span>{copy.nextLangLabel}</span>
    </button>
  );
}

function Header({
  copy,
  onLanguageToggle
}: {
  copy: SiteCopy;
  onLanguageToggle: () => void;
}) {
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
          "mx-auto flex max-w-[92rem] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-4 transition-all duration-500 md:px-6",
          scrolled
            ? "rounded-[2rem] border border-white/50 bg-white/86 shadow-2xl shadow-sky-900/10 backdrop-blur-2xl"
            : "bg-transparent"
        )}
      >
        <a href="#accueil" className="flex min-w-[210px] items-center gap-4">
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
            <span className={cx("block whitespace-nowrap text-lg font-black tracking-tight", scrolled ? "text-sky-950" : "text-white")}>
              {brand.name}
            </span>
            <span className={cx("hidden whitespace-nowrap text-xs font-semibold sm:block", scrolled ? "text-cyan-600" : "text-cyan-100")}>
              {copy.brandSubtitle}
            </span>
          </span>
        </a>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <LanguageToggle copy={copy} onToggle={onLanguageToggle} scrolled={scrolled} />
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-5 py-2 text-sm font-black text-white shadow-lg shadow-cyan-500/30 transition hover:scale-105 lg:inline-flex"
          >
            {copy.whatsapp}
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

        <div
          className={cx(
            "hidden w-full items-center justify-center gap-2 border-t pt-3 xl:flex",
            scrolled ? "border-cyan-100/80" : "border-white/20"
          )}
        >
          {copy.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cx(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold leading-none transition hover:-translate-y-0.5 hover:bg-cyan-50 hover:text-cyan-600",
                scrolled ? "text-slate-700" : "text-white hover:bg-white/15 hover:text-white"
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 mt-3 rounded-[2rem] border border-white/60 bg-white/92 p-4 shadow-2xl backdrop-blur-xl xl:hidden"
        >
          {copy.nav.map((item) => (
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

function Hero({ copy }: { copy: SiteCopy }) {
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
            {copy.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl"
          >
            {copy.hero.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-7 max-w-2xl text-lg font-medium leading-8 text-sky-50 md:text-2xl"
          >
            {copy.hero.copy}
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
              {copy.hero.primaryCta}
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-500/30 transition hover:scale-105"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              {copy.hero.whatsappCta}
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-white/80"
        animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-xs font-bold uppercase tracking-[0.35em]">{copy.hero.explore}</div>
        <div className="mx-auto mt-3 h-10 w-6 rounded-full border border-white/50 p-1">
          <div className="mx-auto h-2 w-2 rounded-full bg-white" />
        </div>
      </motion.div>
    </section>
  );
}

function About({ copy }: { copy: SiteCopy }) {
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
              <span className="text-xl font-black">{copy.about.badgeTitle}</span>
            </div>
            <p className="mt-2 max-w-xs text-sm font-medium text-slate-600">
              {copy.about.badgeCopy}
            </p>
          </div>
        </motion.div>

        <div>
          <SectionTitle
            eyebrow={copy.about.eyebrow}
            title={copy.about.title}
            copy={copy.about.copy}
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {copy.about.stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} />
            ))}
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

function Services({ copy }: { copy: SiteCopy }) {
  return (
    <section id="services" className="relative bg-gradient-to-b from-white via-cyan-50/60 to-white px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={copy.services.eyebrow}
          title={copy.services.title}
          copy={copy.services.copy}
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 overflow-hidden rounded-[2.5rem] bg-sky-950 shadow-2xl shadow-sky-900/20"
        >
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[340px]">
              <Image
                src={media[13].src}
                alt="Avion au décollage"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-950/35 to-sky-950/75 lg:bg-gradient-to-r" />
            </div>
            <div className="p-7 text-white md:p-10 lg:p-12">
              <div className="mb-5 inline-flex rounded-full bg-cyan-400/18 px-4 py-2 text-sm font-black text-cyan-100">
                {copy.services.badge}
              </div>
              <h3 className="text-balance text-3xl font-black leading-tight md:text-5xl">
                {copy.services.introTitle}
              </h3>
              <p className="mt-6 text-base leading-8 text-sky-50/85">{copy.services.introCopy}</p>
              <a
                href="#contact"
                className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-black text-sky-950 shadow-xl transition hover:scale-105"
              >
                {copy.services.quoteCta}
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {copy.services.items.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.04, duration: 0.55 }}
                className="group overflow-hidden rounded-[2rem] border border-cyan-100 bg-white shadow-xl shadow-sky-900/5 transition hover:-translate-y-2 hover:shadow-cyan-500/20"
              >
                <div className="relative h-48 overflow-hidden bg-cyan-50">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-100 to-sky-100 text-sky-700 transition group-hover:scale-110">
                      <Icon aria-hidden="true" className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-sky-950">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.copy}</p>
                  <ul className="mt-5 space-y-3">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700">
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-cyan-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-sky-950 p-7 text-white shadow-2xl shadow-sky-900/15">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-cyan-200">
              <WalletCards aria-hidden="true" className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-3xl font-black">{copy.services.payment.title}</h3>
            <div className="mt-6 grid gap-3">
              {copy.services.payment.rows.map((row) => (
                <div key={row} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-semibold leading-6 text-sky-50">
                  {row}
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-2xl shadow-sky-900/8">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-cyan-100" />
            <div className="relative">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-sky-700">
                <Headphones aria-hidden="true" className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-3xl font-black text-sky-950">Support</h3>
              <p className="mt-4 text-lg leading-8 text-slate-600">{copy.services.payment.note}</p>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-7 py-4 font-black text-white shadow-xl shadow-cyan-500/25 transition hover:scale-105"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                {copy.hero.whatsappCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Scholarships({ copy }: { copy: SiteCopy }) {
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
            eyebrow={copy.scholarship.eyebrow}
            title={copy.scholarship.title}
            copy={copy.scholarship.copy}
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <Stat value={copy.scholarship.stats[0].value} label={copy.scholarship.stats[0].label} icon={GraduationCap} />
            <Stat value={copy.scholarship.stats[1].value} label={copy.scholarship.stats[1].label} icon={WalletCards} />
            <Stat value={copy.scholarship.stats[2].value} label={copy.scholarship.stats[2].label} icon={CalendarDays} />
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
              {copy.scholarship.pageCta}
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <a
              href={whatsappUrl(copy.scholarship.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-400 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-500/25 transition hover:scale-105"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              {copy.scholarship.whatsappCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Destinations({ copy }: { copy: SiteCopy }) {
  return (
    <section id="destinations" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle
            eyebrow={copy.destinations.eyebrow}
            title={copy.destinations.title}
          />
          <p className="max-w-md text-lg leading-8 text-slate-600">
            {copy.destinations.copy}
          </p>
        </div>

        <div className="mt-12 flex gap-6 overflow-x-auto pb-6 [scrollbar-width:none]">
          {copy.destinations.cards.map((destination, index) => (
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

function Gallery({ copy }: { copy: SiteCopy }) {
  return (
    <section id="galerie" className="bg-white px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={copy.gallery.eyebrow}
          title={copy.gallery.title}
          copy={copy.gallery.copy}
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

function Testimonials({ copy }: { copy: SiteCopy }) {
  return (
    <section id="temoignages" className="relative bg-sky-950 px-5 py-24 text-white">
      <div className="relative mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={copy.testimonials.eyebrow}
          title={copy.testimonials.title}
          align="center"
          light
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {copy.testimonials.items.map((testimonial) => (
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
          {copy.testimonials.stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} icon={stat.icon} dark />
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ copy }: { copy: SiteCopy }) {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          eyebrow={copy.process.eyebrow}
          title={copy.process.title}
          align="center"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-5">
          {copy.process.labels.map((step, index) => (
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
                {copy.process.steps[index]}
              </p>
              <CheckCircle2 aria-hidden="true" className="mt-6 h-6 w-6 text-green-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ copy }: { copy: SiteCopy }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-5 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionTitle
          eyebrow={copy.faq.eyebrow}
          title={copy.faq.title}
          copy={copy.faq.copy}
        />

        <div className="space-y-3">
          {copy.faq.items.map((faq, index) => {
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

type ContactSubmitState = {
  type: "success" | "error";
  message: string;
} | null;

function Contact({ copy, language }: { copy: SiteCopy; language: Language }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "CM",
    phone: "",
    destination: "",
    service: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<ContactSubmitState>(null);

  const selectedCountry = useMemo(() => getCountryByCode(form.countryCode), [form.countryCode]);
  const fullPhone = useMemo(() => buildFullContactPhone(selectedCountry.dialCode, form.phone), [form.phone, selectedCountry]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitState(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.name,
        email: form.email,
        countryName: getCountryLabel(selectedCountry, language),
        countryCode: selectedCountry.code,
        dialCode: selectedCountry.dialCode,
        phone: form.phone,
        fullPhone,
        destination: form.destination,
        service: form.service,
        message: form.message,
        locale: language
      })
    });

    const payload = await response.json().catch(() => null);

    if (response.ok) {
      setForm((state) => ({
        name: "",
        email: "",
        countryCode: state.countryCode,
        phone: "",
        destination: "",
        service: "",
        message: ""
      }));
      setSubmitState({ type: "success", message: payload?.message ?? copy.contact.success });
    } else {
      setSubmitState({ type: "error", message: payload?.error ?? copy.contact.error });
    }

    setSubmitting(false);
  }

  return (
    <section id="contact" className="relative px-5 py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-sky-100" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionTitle
            eyebrow={copy.contact.eyebrow}
            title={copy.contact.title}
            copy={copy.contact.copy}
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
          <div className="mb-6 text-2xl font-black text-sky-950">{copy.contact.formTitle}</div>
          {submitState ? (
            <div
              role={submitState.type === "success" ? "status" : "alert"}
              className={cx(
                "mb-5 rounded-3xl border p-4 text-sm font-bold leading-6 shadow-sm",
                submitState.type === "success"
                  ? "border-green-100 bg-green-50 text-green-800"
                  : "border-red-100 bg-red-50 text-red-700"
              )}
            >
              <span className="flex items-center gap-2">
                {submitState.type === "success" ? <CheckCircle2 aria-hidden="true" className="h-5 w-5" /> : null}
                {submitState.type === "success" ? copy.contact.successTitle : copy.contact.error}
              </span>
              <span className="mt-1 block font-semibold">{submitState.message}</span>
            </div>
          ) : null}
          <div className="grid gap-4">
            <Input
              placeholder={copy.contact.placeholders.name}
              value={form.name}
              onChange={(value) => setForm((state) => ({ ...state, name: value }))}
              required
            />
            <Input
              type="email"
              placeholder={copy.contact.placeholders.email}
              value={form.email}
              onChange={(value) => setForm((state) => ({ ...state, email: value }))}
            />
            <CountrySelect
              language={language}
              value={form.countryCode}
              label={copy.contact.placeholders.country}
              searchPlaceholder={copy.contact.placeholders.searchCountry}
              onChange={(value) => setForm((state) => ({ ...state, countryCode: value }))}
            />
            <div className="flex min-h-14 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">
              <span className="inline-flex min-w-20 items-center justify-center border-r border-slate-200 bg-cyan-50 px-4 text-sm font-black text-sky-900">
                {selectedCountry.dialCode}
              </span>
              <input
                value={form.phone}
                onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))}
                required
                inputMode="tel"
                autoComplete="tel-national"
                className="min-w-0 flex-1 bg-transparent px-5 py-4 outline-none"
                placeholder={copy.contact.placeholders.phone}
              />
            </div>
            <Input
              placeholder={copy.contact.placeholders.destination}
              value={form.destination}
              onChange={(value) => setForm((state) => ({ ...state, destination: value }))}
            />
            <select
              value={form.service}
              onChange={(event) => setForm((state) => ({ ...state, service: event.target.value }))}
              required
              className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              {copy.contact.options.map((option, index) => (
                <option key={option} value={index === 0 ? "" : option}>
                  {option}
                </option>
              ))}
            </select>
            <textarea
              value={form.message}
              onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))}
              required
              rows={5}
              className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              placeholder={copy.contact.placeholders.message}
            />
            <button
              type="submit"
              disabled={submitting}
              className="group mt-2 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-600 to-cyan-400 px-7 py-4 font-black text-white shadow-2xl shadow-cyan-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? copy.contact.sending : copy.contact.submit}
              {submitting ? (
                <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
              ) : (
                <Send aria-hidden="true" className="h-5 w-5 transition group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function CountrySelect({
  language,
  value,
  label,
  searchPlaceholder,
  onChange
}: {
  language: Language;
  value: string;
  label: string;
  searchPlaceholder: string;
  onChange: (countryCode: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCountry = getCountryByCode(value);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCountries = useMemo(
    () =>
      COUNTRY_OPTIONS.filter((country) => {
        const searchable = `${country.nameFr} ${country.nameEn} ${country.code} ${country.dialCode}`.toLowerCase();
        return searchable.includes(normalizedQuery);
      }),
    [normalizedQuery]
  );

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-left outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
        aria-expanded={open}
      >
        <span>
          <span className="block text-xs font-black uppercase tracking-[0.18em] text-cyan-600">{label}</span>
          <span className="mt-1 block font-bold text-sky-950">
            {getCountryLabel(selectedCountry, language)} · {selectedCountry.dialCode}
          </span>
        </span>
        <ChevronDown aria-hidden="true" className={cx("h-5 w-5 shrink-0 text-cyan-600 transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-2xl">
          <label className="flex items-center gap-3 border-b border-cyan-50 px-4 py-3">
            <Search aria-hidden="true" className="h-4 w-4 text-cyan-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder={searchPlaceholder}
              autoFocus
            />
          </label>
          <div className="max-h-72 overflow-y-auto p-2">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setQuery("");
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left text-sm transition hover:bg-cyan-50",
                  country.code === selectedCountry.code && "bg-cyan-50"
                )}
              >
                <span className="font-bold text-sky-950">{getCountryLabel(country, language)}</span>
                <span className="font-black text-cyan-700">{country.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      required={required}
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

function Footer({ copy }: { copy: SiteCopy }) {
  return (
    <footer className="bg-sky-950 px-5 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="text-3xl font-black">{brand.name}</div>
          <p className="mt-2 text-cyan-100">{brand.baseline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-sky-100">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-cyan-300">
              {item.label}
            </a>
          ))}
        </div>
        <div className="text-sm text-sky-200">© 2026 {brand.name}. {copy.footerRights}</div>
      </div>
    </footer>
  );
}

export function JosTravelSite() {
  const [language, setLanguage] = useState<Language>("fr");
  const copy = siteCopy[language];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("jos-travel-language");
    if (savedLanguage === "fr" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function toggleLanguage() {
    setLanguage((current) => {
      const next = current === "fr" ? "en" : "fr";
      window.localStorage.setItem("jos-travel-language", next);
      return next;
    });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F6F2] text-slate-900">
      <Header copy={copy} onLanguageToggle={toggleLanguage} />
      <Hero copy={copy} />
      <Destinations copy={copy} />
      <Services copy={copy} />
      <Scholarships copy={copy} />
      <About copy={copy} />
      <Gallery copy={copy} />
      <Testimonials copy={copy} />
      <Process copy={copy} />
      <Faq copy={copy} />
      <Contact copy={copy} language={language} />
      <Footer copy={copy} />
      <AiChatbot />
    </main>
  );
}
