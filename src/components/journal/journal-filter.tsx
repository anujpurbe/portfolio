"use client";

import { useMemo, useState } from "react";
import type { JournalEntryMeta } from "@/lib/types";
import { JournalEntryCard } from "@/components/journal/entry-card";
import { cn } from "@/lib/utils";

const chipClass = (active: boolean) =>
  cn(
    "focus-ring rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
    active
      ? "border-accent/60 bg-accent/10 text-accent"
      : "border-border text-muted hover:border-accent/40 hover:text-foreground",
  );

export function JournalFilter({ entries }: { entries: JournalEntryMeta[] }) {
  const tags = useMemo(() => {
    const all = new Set<string>();
    for (const entry of entries) {
      for (const tag of entry.tags) all.add(tag);
    }
    return ["All", ...Array.from(all).sort()];
  }, [entries]);

  const categories = useMemo(() => {
    const all = new Set<string>();
    for (const entry of entries) {
      if (entry.category) all.add(entry.category);
    }
    return Array.from(all).sort();
  }, [entries]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState("All");

  const filtered = entries.filter(
    (entry) =>
      (!activeCategory || entry.category === activeCategory) &&
      (activeTag === "All" || entry.tags.includes(activeTag)),
  );

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-6">
          <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-subtle">
            Topics
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory((current) =>
                    current === category ? null : category,
                  )
                }
                aria-pressed={activeCategory === category}
                className={chipClass(activeCategory === category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
            className={chipClass(activeTag === tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted">No entries with this filter yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry, i) => (
            <JournalEntryCard
              key={entry.slug}
              entry={entry}
              index={entries.length - i}
            />
          ))}
        </div>
      )}
    </>
  );
}
