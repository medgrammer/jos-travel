import type { Metadata } from "next";
import { SiteAnalytics } from "@/components/site-analytics";
import "./globals.css";

const siteTitle = "JOS-Travel | Agence de voyage et tourisme premium";
const siteDescription =
  "JOS-Travel organise vos voyages au Cameroun et à l'international : billets, visas, hôtels, séjours, bourses d'études, assurances, excursions et accompagnement 24h/24.";
const previewImage = "/media/jos-link-preview-20260612.png";
const siteUrl = "https://jostravel.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "JOS-Travel",
  alternates: {
    canonical: siteUrl
  },
  title: {
    default: siteTitle,
    template: "%s | JOS-Travel"
  },
  description: siteDescription,
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
  icons: {
    icon: "/media/jos-logo.jpeg",
    shortcut: "/media/jos-logo.jpeg",
    apple: "/media/jos-logo.jpeg"
  },
  openGraph: {
    type: "website",
    locale: "fr_CM",
    url: siteUrl,
    siteName: "JOS-Travel",
    title: "JOS-Travel | Chaque voyage devient une histoire inoubliable",
    description: siteDescription,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "JOS-Travel - Agence tourisme premium"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JOS-Travel | Agence de voyage et tourisme premium",
    description: siteDescription,
    images: [previewImage]
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
