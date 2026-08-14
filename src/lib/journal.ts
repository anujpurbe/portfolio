import type { JournalEntryMeta } from "@/lib/types";
import { journalEntries } from "@/content/journal";
import { readFileSync } from "node:fs";

const WORDS_PER_MINUTE = 200;

function stripMeta(source: string) {
  const start = source.indexOf("export const meta");
  if (start === -1) return source;
  let depth = 0;
  let i = source.indexOf("{", start);
  for (; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const end = source.indexOf("\n", i);
  return source.slice(end + 1);
}

function readingTimeFor(slug: string) {
  const file = `${process.cwd()}/src/content/journal/${slug}.mdx`;
  try {
    const source = stripMeta(readFileSync(file, "utf8"));
    const words = source
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/[#>*_\[\]()-]/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    return `${minutes} min read`;
  } catch {
    return "1 min read";
  }
}

export function getAllEntries(): JournalEntryMeta[] {
  return journalEntries
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((entry) => ({
      title: entry.title,
      slug: entry.slug,
      date: entry.date,
      updated: entry.updated,
      tags: entry.tags,
      excerpt: entry.excerpt,
      category: entry.category,
      relatedProject: entry.relatedProject,
      readingTime: readingTimeFor(entry.slug),
    }));
}

export function getEntry(slug: string) {
  const entry = journalEntries.find((entry) => entry.slug === slug) ?? null;
  if (!entry) return null;
  return { ...entry, readingTime: readingTimeFor(entry.slug) };
}

export type EntryHeading = { id: string; text: string; level: 2 | 3 };

export function getEntryHeadings(slug: string): EntryHeading[] {
  const file = `${process.cwd()}/src/content/journal/${slug}.mdx`;
  try {
    const source = stripMeta(readFileSync(file, "utf8"));
    const headings: EntryHeading[] = [];
    for (const line of source.split("\n")) {
      const match = line.match(/^<h([23])\s+id="([^"]+)"[^>]*>(.*)<\/h[23]>$/);
      if (!match) continue;
      const level = match[1] === "2" ? 2 : 3;
      const id = match[2];
      const text = match[3]
        .replace(/<[^>]+>/g, "")
        .replace(/`([^`]*)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
      headings.push({ id, text, level });
    }
    return headings;
  } catch {
    return [];
  }
}

export function getAdjacentEntries(slug: string) {
  const entries = getAllEntries();
  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: entries[index + 1] ?? null,
    next: entries[index - 1] ?? null,
  };
}

export function getRelatedEntries(slug: string, limit = 2) {
  const current = getEntry(slug);
  const others = getAllEntries().filter((entry) => entry.slug !== slug);
  if (!current) return others.slice(0, limit);
  const score = (entry: JournalEntryMeta) => {
    const tagOverlap = current.tags.filter((tag) =>
      entry.tags.includes(tag),
    ).length;
    const sameCategory = entry.category === current.category ? 2 : 0;
    return tagOverlap + sameCategory;
  };
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}
