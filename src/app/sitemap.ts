import type { MetadataRoute } from "next";
import { seo } from "@/lib/seo";
import { getAllEntries } from "@/lib/journal";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const journalEntries = getAllEntries().map((entry) => ({
    url: `${seo.siteUrl}/journal/${entry.slug}`,
    lastModified: new Date(entry.updated ?? entry.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const projectPages = projects.map((project) => ({
    url: `${seo.siteUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: seo.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${seo.siteUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...journalEntries,
    ...projectPages,
  ];
}
