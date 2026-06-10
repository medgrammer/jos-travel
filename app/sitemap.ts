import type { MetadataRoute } from "next";

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
    }
  ];
}
