import type { JournalEntryMeta } from "@/lib/types";
import { journalEntries } from "@/content/journal";

export function getAllEntries(): JournalEntryMeta[] {
  return journalEntries
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((entry) => ({
      title: entry.title,
      slug: entry.slug,
      date: entry.date,
      tags: entry.tags,
      excerpt: entry.excerpt,
    }));
}

export function getEntry(slug: string) {
  return journalEntries.find((entry) => entry.slug === slug) ?? null;
}
