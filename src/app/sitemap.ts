import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllEntries } from "@/lib/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getAllEntries().map((entry) => ({
    url: `${site.url}/journal/${entry.slug}`,
    lastModified: new Date(entry.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...entries,
  ];
}
