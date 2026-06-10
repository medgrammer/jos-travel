import type { Metadata } from "next";
import { SiteAnalytics } from "@/components/site-analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jostravel.site"),
  title: {
    default: "JOS-Travel | Agence de tourisme premium au Cameroun",
    template: "%s | JOS-Travel"
  },
  description:
    "JOS-Travel accompagne particuliers et entreprises dans la création de voyages sur mesure, billets, visas, bourses d'études, hôtels, excursions et séjours au Cameroun comme à l'international.",
  keywords: [
    "JOS-Travel",
    "agence de voyage Cameroun",
    "tourisme Cameroun",
    "réservation billets avion",
    "assistance visa",
    "bourses d'études Chine",
    "séjours de vacances",
    "voyage d'affaires"
  ],
  openGraph: {
    type: "website",
    locale: "fr_CM",
    url: "https://jostravel.site",
    siteName: "JOS-Travel",
    title: "JOS-Travel | Où chaque voyage devient une histoire inoubliable",
    description:
      "Agence agréée de 3e catégorie spécialisée dans les voyages sur mesure, l'assistance visa, les séjours, les excursions et les voyages d'affaires.",
    images: [
      {
        url: "/media/jos-travel-02.jpeg",
        width: 1809,
        height: 2560,
        alt: "Affiche officielle de JOS-Travel"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JOS-Travel",
    description: "Voyagez l'esprit libre, JOS-Travel s'occupe du reste.",
    images: ["/media/jos-travel-02.jpeg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
