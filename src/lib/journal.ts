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
      tags: entry.tags,
      excerpt: entry.excerpt,
      readingTime: readingTimeFor(entry.slug),
    }));
}

export function getEntry(slug: string) {
  const entry = journalEntries.find((entry) => entry.slug === slug) ?? null;
  if (!entry) return null;
  return { ...entry, readingTime: readingTimeFor(entry.slug) };
}
