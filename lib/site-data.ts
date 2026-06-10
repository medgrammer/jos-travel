import {
  Award,
  BriefcaseBusiness,
  Car,
  Clock3,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  Headphones,
  HeartHandshake,
  Home,
  LockKeyhole,
  MapPinned,
  PackageCheck,
  ShieldCheck,
  Ticket,
  UsersRound,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceItem = {
  title: string;
  copy: string;
  icon: LucideIcon;
  href?: string;
  image?: string;
  cta?: string;
  featured?: boolean;
};

export const brand = {
  name: "JOS-Travel",
  baseline: "Où chaque voyage devient une histoire inoubliable.",
  legal: "Agence de tourisme agréée de 3e catégorie",
  email: "jostravel2026@gmail.com",
  address: "Damas sis dépôt de bois",
  phones: ["+237 222 316 237", "+237 671 057 243", "+237 674 32 35 65", "+237 641 62 07 66"],
  whatsapp: "237671057243"
};

export const media = Array.from({ length: 65 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    src: `/media/jos-travel-${String(id).padStart(2, "0")}.jpeg`,
    alt: `Univers visuel JOS-Travel ${id}`
  };
});

export const scholarshipFlyers = [
  {
    src: "/media/jos-travel-bourses-chine-offre.jpeg",
    alt: "Flyer JOS-Travel pour les bourses complètes en Chine",
    title: "Étudiez en Chine avec bourse complète"
  },
  {
    src: "/media/jos-travel-bourses-chine-conditions.jpeg",
    alt: "Flyer JOS-Travel des conditions et dossiers à fournir pour les bourses en Chine",
    title: "Conditions principales et dossiers à fournir"
  }
];

export const scholarshipOffer = {
  title: "Bourses d'études en Chine",
  hero: "Étudiez en Chine avec bourse complète",
  subtitle:
    "Opportunités ouvertes aux étudiants avec accompagnement complet de JOS-Travel pour la constitution et le suivi du dossier.",
  promo: "Offre promotionnelle jusqu'au 10 juin",
  fee: "Frais d'ouverture du dossier : 100 000 F",
  deadline: "Dépôt de candidature ouvert jusqu'au 10 juin",
  support: "Accompagnement complet pour la procédure",
  contacts: ["+237 671 05 72 43", "+237 641 62 07 66"],
  email: "jostravel2026@gmail.com",
  address: "Sis Damas dépôt de bois",
  levels: ["Diploma / durée 3 ans", "Master", "PhD"],
  coverage: ["Scolarité", "Hébergement", "Assurance médicale", "Billet d'avion inclus"],
  conditions: [
    "Être titulaire du diplôme requis",
    "Avoir un passeport valide",
    "Présenter un dossier académique acceptable",
    "Avoir la motivation pour étudier en Chine"
  ],
  documents: ["Diplômes et relevés", "Photos d'identité", "CV", "Passeport"]
};

export const navItems = [
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Galerie", href: "#galerie" },
  { label: "Contact", href: "#contact" }
];

export const trustMarkers = [
  {
    label: "Agence agréée",
    value: "3e catégorie",
    icon: Award
  },
  {
    label: "Accompagnement",
    value: "24h/24",
    icon: Clock3
  },
  {
    label: "Paiements",
    value: "sécurisés",
    icon: LockKeyhole
  },
  {
    label: "Voyages",
    value: "sur mesure",
    icon: Compass
  }
];

export const services: ServiceItem[] = [
  {
    title: "Bourses d'études",
    copy:
      "Accompagnement pour les opportunités d'études en Chine avec bourse complète, constitution du dossier et suivi de la procédure.",
    icon: GraduationCap,
    href: "/bourses-etudes",
    image: scholarshipFlyers[0].src,
    cta: "Voir le programme",
    featured: true
  },
  {
    title: "Tourisme",
    copy: "Circuits culturels, aventures nature, écotourisme et escapades locales au Cameroun.",
    icon: Compass
  },
  {
    title: "Billets & hôtels",
    copy: "Réservation de billets d'avion, chambres, séjours et prestations liées à votre itinéraire.",
    icon: Ticket
  },
  {
    title: "Séjours & affaires",
    copy: "Vacances, voyages d'affaires, retraites d'équipe et déplacements corporate maîtrisés.",
    icon: BriefcaseBusiness
  },
  {
    title: "Location de véhicules",
    copy: "Solutions de mobilité fiables pour vos courses, transferts, circuits ou événements.",
    icon: Car
  },
  {
    title: "Visites guidées",
    copy: "Excursions, découverte des sites emblématiques et expériences locales accompagnées.",
    icon: MapPinned
  },
  {
    title: "Visa & formalités",
    copy: "Assistance administrative, constitution des dossiers et suivi jusqu'au départ.",
    icon: FileCheck2
  },
  {
    title: "Événements & séminaires",
    copy: "Organisation logistique pour groupes, entreprises, cérémonies et rencontres professionnelles.",
    icon: UsersRound
  },
  {
    title: "Conseil personnalisé",
    copy: "Recommandations adaptées à votre budget, votre rythme et votre style de voyage.",
    icon: Headphones
  },
  {
    title: "Immobilier & achats",
    copy: "Accompagnement dans les recherches, achats centralisés et demandes spécifiques.",
    icon: Home
  },
  {
    title: "Import / export",
    copy: "Commerce général, services d'import-export et coordination de besoins transverses.",
    icon: PackageCheck
  }
];

export const destinationGroups = [
  {
    key: "cameroun",
    label: "Cameroun",
    title: "Explorer le Cameroun avec des experts locaux",
    copy:
      "Forêts luxuriantes, chutes spectaculaires, villes vivantes, plages de Kribi et patrimoines culturels : JOS-Travel construit des circuits authentiques, encadrés et confortables.",
    cta: "Créer mon circuit local",
    images: [44, 38, 50, 36, 26, 7].map((id) => media[id - 1]),
    stats: ["Guides locaux", "Excursions", "Nature & culture"]
  },
  {
    key: "international",
    label: "International",
    title: "Partir loin, sans stress administratif",
    copy:
      "Billets, hôtels, visas, transferts et coordination : l'équipe prépare chaque détail pour que le voyage reste fluide du premier appel au retour.",
    cta: "Préparer mon départ",
    images: [14, 46, 54, 29, 42, 6].map((id) => media[id - 1]),
    stats: ["Billets avion", "Assistance visa", "Hôtels"]
  },
  {
    key: "vacances",
    label: "Séjours",
    title: "Des vacances qui respirent le calme et la beauté",
    copy:
      "Plages, resorts, villas, parenthèses romantiques ou familiales : les séjours sont pensés pour la détente, la sécurité et le meilleur rapport qualité-prix.",
    cta: "Imaginer mon séjour",
    images: [19, 45, 47, 59, 60, 65].map((id) => media[id - 1]),
    stats: ["Villas", "Resorts", "Famille & couple"]
  }
];

export const processSteps = [
  {
    title: "Écoute",
    copy: "Nous clarifions votre destination, vos dates, votre budget, vos attentes et vos contraintes."
  },
  {
    title: "Design du voyage",
    copy: "L'équipe propose un itinéraire, sélectionne les meilleures options et affine chaque détail."
  },
  {
    title: "Formalités",
    copy: "Billets, hôtels, visa, transferts et documents sont coordonnés avec un suivi rigoureux."
  },
  {
    title: "Accompagnement",
    copy: "Vous restez accompagné avant, pendant et après le voyage, avec une équipe disponible."
  }
];

export const reasons = [
  {
    title: "Expertise locale et internationale",
    copy: "Une connaissance solide du terrain camerounais et des standards attendus à l'international.",
    icon: Globe2
  },
  {
    title: "Service vraiment personnalisé",
    copy: "Chaque recommandation est ajustée à vos objectifs, votre budget et votre façon de voyager.",
    icon: HeartHandshake
  },
  {
    title: "Suivi fiable à chaque étape",
    copy: "Vous savez ce qui est prévu, ce qui est confirmé et ce qui reste à finaliser.",
    icon: ShieldCheck
  },
  {
    title: "Meilleur rapport qualité-prix",
    copy: "Des options équilibrées entre confort, sécurité, budget et expérience mémorable.",
    icon: WalletCards
  }
];

export const testimonials = [
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
      "On voulait découvrir le Cameroun autrement. Les visites étaient bien pensées, rythmées, et surtout rassurantes.",
    author: "Christelle B.",
    role: "Circuit découverte"
  }
];

export const faqs = [
  {
    question: "JOS-Travel accompagne-t-elle les voyages au Cameroun et à l'international ?",
    answer:
      "Oui. L'agence organise des circuits locaux, des séjours de vacances, des voyages d'affaires et des départs internationaux avec assistance sur les billets, hôtels et formalités."
  },
  {
    question: "Pouvez-vous aider pour les visas et documents administratifs ?",
    answer:
      "Oui. L'équipe accompagne la préparation des dossiers, vérifie les pièces nécessaires et assure un suivi clair jusqu'à la finalisation."
  },
  {
    question: "Est-il possible de demander un voyage sur mesure ?",
    answer:
      "Oui. C'est le coeur de l'offre : dates, budget, style de voyage, niveau de confort et envies sont pris en compte pour créer une proposition adaptée."
  },
  {
    question: "Comment contacter rapidement l'agence ?",
    answer:
      "Le plus direct est WhatsApp ou téléphone via les numéros affichés dans la section contact. Vous pouvez aussi écrire à jostravel2026@gmail.com."
  }
];

export const featuredGallery = [
  { id: 2, label: "Identité officielle" },
  { id: 1, label: "Agence & accueil" },
  { id: 44, label: "Chutes du Cameroun" },
  { id: 19, label: "Séjour premium" },
  { id: 29, label: "Hôtel vue mer" },
  { id: 50, label: "Patrimoine" },
  { id: 42, label: "Confort en vol" },
  { id: 22, label: "Plage locale" }
].map((item) => ({ ...item, image: media[item.id - 1] }));
