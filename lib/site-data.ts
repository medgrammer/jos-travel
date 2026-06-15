import {
  Award,
  BriefcaseBusiness,
  Car,
  Clock3,
  Compass,
  FileCheck2,
  Globe2,
  Headphones,
  HeartHandshake,
  LockKeyhole,
  MapPinned,
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

export type FeaturedOffer = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  image: string;
  alt: string;
  href: string;
  badges: string[];
  facts: Array<{ label: string; value: string }>;
  details: string[];
  requirements?: string[];
  benefits?: string[];
  destinations?: Array<{ country: string; items: string[] }>;
  whatsappMessage: string;
};

export const brand = {
  name: "JOS-Travel",
  baseline: "Où chaque voyage devient une histoire inoubliable.",
  legal: "Agence de tourisme agréée de 3e catégorie",
  email: "jostravel2026@gmail.com",
  address: "Damas sis dépôt de bois",
  gps: "3.817848,11.489876",
  mapsUrl: "https://maps.google.com/?q=3.817848,11.489876",
  mapsEmbedUrl: "https://www.google.com/maps?q=3.817848,11.489876&output=embed",
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

export const scholarshipVisuals = [
  {
    src: "/media/jos-travel-bourses-chine-offre.jpeg",
    alt: "Visuel JOS-Travel Master Scholarship in China Program 2026",
    title: "Master Scholarship in China - Program 2026"
  }
];

export const scholarshipOffer = {
  title: "Master Scholarship in China Program 2026",
  hero: "Master Scholarship in China - Program 2026",
  subtitle:
    "Programme de bourse Master en Chine avec accompagnement JOS-Travel pour vérifier votre profil, préparer le dossier et suivre la procédure.",
  promo: "Inscriptions ouvertes jusqu'au 20/06/2026",
  fee: "Stipend : 750 000 F CFA/an",
  deadline: "Inscription ouverte jusqu'au 20/06/2026",
  support: "Accompagnement complet pour la candidature et la procédure",
  contacts: ["+237 671 05 72 43", "+237 641 62 07 66"],
  email: "jostravel2026@gmail.com",
  address: "Sis Damas dépôt de bois",
  levels: ["Master", "Durée indicative : 3 ans", "Ville : Huai'an", "Langue : anglais selon programme"],
  coverage: [
    "Scolarité gratuite",
    "Dortoir gratuit",
    "Billet d'avion gratuit",
    "Assurance médicale",
    "Stipend 750 000 F CFA/an",
    "Opportunités pour les meilleurs profils académiques"
  ],
  conditions: [
    "Être éligible à une admission en Master",
    "Présenter un dossier académique solide",
    "Préparer les pièces nécessaires pour l'inscription",
    "Être motivé(e) pour poursuivre ses études en Chine"
  ],
  documents: ["Diplômes et relevés", "Passeport", "CV", "Photos d'identité", "Documents académiques utiles"],
  programs: [
    "Electronic Information",
    "Computer Technology",
    "International Business",
    "Energy and Power",
    "Transportation",
    "Agriculture",
    "Mechanical Engineering",
    "Civil Engineering and Hydraulic Engineering",
    "Materials and Chemical Engineering",
    "Social Work"
  ]
};

export const navItems = [
  { label: "Offres", href: "#offres" },
  { label: "Services", href: "#services" },
  { label: "Bourses", href: "#bourses" },
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

export const featuredOffers: FeaturedOffer[] = [
  {
    slug: "vacances-yaounde-2026",
    title: "Vacances Yaoundé avec JOS-Travel 2026",
    shortTitle: "Vacances Yaoundé 2026",
    category: "Événement enfants",
    summary:
      "Un programme de vacances encadré pour offrir aux enfants une aventure exceptionnelle, riche en découvertes, loisirs et nouvelles amitiés.",
    image: "/media/jos-travel-vacances-yaounde-2026.jpeg",
    alt: "Visuel Vacances Yaoundé avec JOS-Travel 2026",
    href: "/offres/vacances-yaounde-2026",
    badges: ["Découvre", "Explore", "Savoure"],
    facts: [
      { label: "Public", value: "Enfants de 5 à 18 ans" },
      { label: "Dates", value: "Du 15 juin au 15 août 2026" },
      { label: "Places", value: "Limitées" }
    ],
    details: [
      "Vacances inoubliables dans un cadre sécurisé.",
      "Encadrement par des animateurs qualifiés du secteur du tourisme.",
      "Découvertes culturelles, excursions, visites et activités ludiques.",
      "Ateliers éducatifs pour apprendre autrement pendant les vacances.",
      "Moments de partage pour créer de nouvelles amitiés."
    ],
    benefits: [
      "Découvertes culturelles",
      "Excursions et visites",
      "Jeux et activités ludiques",
      "Ateliers éducatifs",
      "Nouvelles amitiés",
      "Encadrement professionnel"
    ],
    whatsappMessage:
      "Bonjour JOS-Travel, je souhaite inscrire un enfant au programme Vacances Yaoundé 2026.\n\nMerci de m'envoyer les informations d'inscription, les modalités, le programme détaillé et les places disponibles."
  },
  {
    slug: "travailleurs-saisonniers-royaume-uni",
    title: "Royaume-Uni - Programme de recrutement de travailleurs saisonniers",
    shortTitle: "Travailleurs saisonniers UK",
    category: "Visa travail",
    summary:
      "Un accompagnement pour les candidats intéressés par des opportunités d'emploi saisonnier légal au Royaume-Uni.",
    image: "/media/jos-travel-royaume-uni-travailleurs-saisonniers.jpeg",
    alt: "Visuel Royaume-Uni programme de recrutement de travailleurs saisonniers",
    href: "/offres/travailleurs-saisonniers-royaume-uni",
    badges: ["Emploi légal", "Maximum 30 jours", "3 postes disponibles"],
    facts: [
      { label: "Destination", value: "Royaume-Uni" },
      { label: "Délai", value: "Maximum 30 jours" },
      { label: "Disponibilité", value: "3 postes disponibles" }
    ],
    details: [
      "Opportunités d'emploi saisonnier légales au Royaume-Uni.",
      "Option compte bloqué disponible.",
      "Paiement possible après approbation du visa selon les conditions du dossier.",
      "Les candidats sont invités à soumettre leurs documents dès que possible pour évaluation.",
      "Vérification de l'éligibilité avant orientation vers la suite de la procédure."
    ],
    requirements: ["Passeport valide", "Photo d'identité récente", "CV / Resume à jour"],
    benefits: [
      "Opportunité d'emploi saisonnier légale",
      "Traitement rapide",
      "Assistance professionnelle pour votre dossier",
      "Hébergement inclus",
      "Billet d'avion inclus"
    ],
    whatsappMessage:
      "Bonjour JOS-Travel, je souhaite des informations sur le programme de recrutement de travailleurs saisonniers au Royaume-Uni.\n\nMerci de m'indiquer les conditions, les documents à fournir et les prochaines étapes pour vérifier mon éligibilité."
  },
  {
    slug: "visa-travail-touristique",
    title: "Visa Travail & Visa Touristique",
    shortTitle: "Visa Travail & Touristique",
    category: "Accompagnement visa",
    summary:
      "Des solutions pour travailler ou visiter l'étranger avec procédures rapides, dossiers sécurisés et assistance jusqu'à destination.",
    image: "/media/jos-travel-visa-travail-touristique.jpeg",
    alt: "Visuel Visa Travail et Visa Touristique JOS-Travel",
    href: "/offres/visa-travail-touristique",
    badges: ["Procédures rapides", "Accompagnement complet", "Dossiers sécurisés"],
    facts: [
      { label: "Type", value: "Visa travail et touristique" },
      { label: "Support", value: "Assistance jusqu'à destination" },
      { label: "Offres", value: "Logement, nourriture, compte bloqué selon pays" }
    ],
    details: [
      "Accompagnement complet pour travailler ou visiter l'étranger.",
      "Dossiers sécurisés et suivi professionnel.",
      "Destinations proposées avec conditions spécifiques selon les pays.",
      "Les offres peuvent inclure logement, nourriture, sécurité financière et assistance jusqu'à destination."
    ],
    benefits: [
      "Procédures rapides",
      "Accompagnement complet",
      "Dossiers sécurisés",
      "Destinations garanties",
      "Logement inclus selon destination",
      "Nourriture assurée selon destination",
      "Sécurité financière avec compte bloqué selon dossier",
      "Assistance jusqu'à destination"
    ],
    destinations: [
      {
        country: "Malaisie",
        items: ["Procédure : 2 semaines max", "Logement + nourriture + transport", "Compte bloqué"]
      },
      {
        country: "Île Maurice",
        items: ["Procédure : 1 semaine", "Logement + emploi garanti", "Compte bloqué"]
      },
      {
        country: "Turquie",
        items: ["Procédure : 1 semaine", "Logement + emploi garanti", "Compte bloqué"]
      },
      {
        country: "Dubaï",
        items: ["Procédure : 2 semaines", "Contrat de travail", "Billet d'avion inclus", "Compte bloqué"]
      },
      {
        country: "Portugal",
        items: ["Logement + nourriture", "Compte bloqué sur 3 mois"]
      },
      {
        country: "Italie",
        items: ["Logement + nourriture", "Compte bloqué"]
      },
      {
        country: "Pays-Bas",
        items: ["Logement + nourriture"]
      },
      {
        country: "Afrique du Sud",
        items: ["Procédure : 2 semaines", "Compte bloqué"]
      },
      {
        country: "Serbie",
        items: ["Voyage à crédit", "Logement + emploi possible", "Compte bloqué"]
      },
      {
        country: "Espagne",
        items: ["Logement + travail", "Assistance complète"]
      },
      {
        country: "Roumanie",
        items: ["Logement + emploi garanti", "Assistance complète"]
      },
      {
        country: "Luxembourg",
        items: ["Opportunités de travail", "Accompagnement complet"]
      },
      {
        country: "Moldova",
        items: ["Procédure : 1 mois", "Compte bloqué"]
      },
      {
        country: "Albanie",
        items: ["Logement + nutrition", "Compte bloqué"]
      }
    ],
    whatsappMessage:
      "Bonjour JOS-Travel, je souhaite être accompagné pour un visa travail ou touristique.\n\nMerci de m'aider à choisir la destination adaptée et de m'envoyer les conditions, documents requis, délais et modalités."
  }
];

export const services: ServiceItem[] = [
  {
    title: "Packages touristiques",
    copy:
      "Voyages loisirs, safaris et study tours. Le client envoie destination, dates et nombre de voyageurs ; JOS-Travel transmet un devis détaillé sous 24h incluant vols, hôtel, visa, transferts, visites guidées et safaris au Kenya, Tanzanie, Ouganda ou Afrique du Sud.",
    icon: MapPinned,
    image: media[8].src
  },
  {
    title: "Réservations d'hôtels",
    copy:
      "Réservation d'hôtels dans le monde entier pour affaires ou loisirs. Le client envoie les dates check-in/check-out et la ville ; JOS-Travel propose des options avec prix, petit-déjeuner et conditions d'annulation. 20% d'acompte confirme la réservation.",
    icon: Ticket,
    image: media[28].src
  },
  {
    title: "Location de véhicules",
    copy:
      "Pick-up aéroport ou location en ville au Cameroun et dans les pays partenaires. Les devis précisent le type de véhicule, l'option chauffeur, l'assurance et le kilométrage. Réservation conseillée 48h à l'avance.",
    icon: Car,
    image: media[33].src
  },
  {
    title: "Assurance voyage",
    copy:
      "Assurance couvrant urgences médicales, annulation, perte de bagages et rapatriement. Obligatoire pour Schengen et Dubai, recommandée pour tout voyage international. Prime selon destination, durée et âge.",
    icon: ShieldCheck,
    image: media[41].src
  },
  {
    title: "Visa & formalités",
    copy:
      "Visas touristiques Chine, Dubai, Turquie, Schengen et autres destinations. Visas étudiants et bourses : préparation documentaire, rendez-vous ambassade et suivi de dossier. Frais et délais selon le pays.",
    icon: FileCheck2,
    image: media[3].src
  },
  {
    title: "Événements & voyages de groupe",
    copy:
      "Retraites d'entreprise, événements familiaux et tours de groupe avec réservation de lieux, catering, transport et coordination des visites. Demande recommandée 30 jours à l'avance pour obtenir les meilleurs tarifs.",
    icon: BriefcaseBusiness,
    image: media[47].src
  },
  {
    title: "Partenariats tour-opérateurs",
    copy:
      "Opérateurs locaux licenciés pour safaris, city tours et assistance terrain 24/7. Le voyageur dispose d'un contact WhatsApp direct avec JOS-Travel et le guide local pendant le séjour.",
    icon: UsersRound,
    image: media[15].src
  },
  {
    title: "Booking & paiement",
    copy:
      "Tourisme, safari et événements : 60% d'acompte pour confirmer. Hôtel, voiture et assurance : 20 à 50% selon fournisseur. Solde dû 20 jours avant départ. Paiement par Mobile Money, virement ou espèces au bureau de Douala.",
    icon: WalletCards,
    image: media[0].src
  },
  {
    title: "Support voyage",
    copy:
      "Itinéraire final, vouchers et contact WhatsApp support envoyés 7 jours avant le départ. Tous les devis sont valables 7 jours ; les prix changent selon la saison et la disponibilité.",
    icon: Headphones,
    image: media[44].src
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
    title: "Consultation",
    copy: "Nous clarifions la destination, les dates, le nombre de voyageurs, le budget, les attentes et les contraintes."
  },
  {
    title: "Devis détaillé",
    copy: "JOS-Travel prépare une proposition claire sous 24h quand les informations essentielles sont disponibles."
  },
  {
    title: "Confirmation",
    copy: "La réservation est confirmée par l'acompte adapté : 60% pour tourisme, safari et événements ; 20 à 50% pour hôtel, voiture ou assurance."
  },
  {
    title: "Préparation",
    copy: "Le solde est réglé 20 jours avant départ, puis les vouchers, contacts et instructions sont transmis avant le voyage."
  },
  {
    title: "Support",
    copy: "Le voyageur reste accompagné par WhatsApp avant, pendant et après le séjour, avec un suivi humain et réactif."
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
    question: "Combien de temps un devis JOS-Travel reste-t-il valable ?",
    answer:
      "Chaque devis est valable 7 jours. Les prix peuvent évoluer selon la saison, la disponibilité des fournisseurs et les conditions des compagnies."
  },
  {
    question: "Quel acompte faut-il prévoir pour confirmer ?",
    answer:
      "Tourisme, safari et événements nécessitent généralement 60% d'acompte. Hôtel, location de voiture et assurance demandent 20 à 50% selon le fournisseur."
  },
  {
    question: "Quels moyens de paiement sont acceptés ?",
    answer:
      "JOS-Travel accepte Mobile Money, virement bancaire et paiement en espèces au bureau de Douala."
  },
  {
    question: "Quand reçoit-on les documents de voyage ?",
    answer:
      "L'itinéraire final, les vouchers et le contact WhatsApp support sont envoyés 7 jours avant le départ."
  }
];

export const featuredGallery = [
  {
    id: 66,
    label: "Accueil JOS-Travel",
    image: {
      id: 66,
      src: "/media/jos-travel-galerie-agence-01.jpeg",
      alt: "Mur d'accueil JOS-Travel avec logo et services"
    }
  },
  {
    id: 67,
    label: "Bureau JOS-Travel",
    image: {
      id: 67,
      src: "/media/jos-travel-galerie-agence-02.jpeg",
      alt: "Bureau JOS-Travel avec décoration murale de l'agence"
    }
  },
  { id: 2, label: "Identité officielle" },
  { id: 1, label: "Agence & accueil" },
  { id: 44, label: "Chutes du Cameroun" },
  { id: 19, label: "Séjour premium" },
  { id: 29, label: "Hôtel vue mer" },
  { id: 50, label: "Patrimoine" },
  { id: 42, label: "Confort en vol" },
  { id: 22, label: "Plage locale" }
].map((item) => ({
  ...item,
  image: "image" in item && item.image ? item.image : media[item.id - 1]!
}));
