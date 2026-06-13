import type { MetadataRoute } from "next";
import { featuredOffers } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://jostravel.site",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://jostravel.site/bourses-etudes",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.82
    },
    ...featuredOffers.map((offer) => ({
      url: `https://jostravel.site${offer.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.82
    }))
  ];
}
