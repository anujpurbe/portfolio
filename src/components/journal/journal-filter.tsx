"use client";

import { useMemo, useState } from "react";
import type { JournalEntryMeta } from "@/lib/types";
import { JournalEntryCard } from "@/components/journal/entry-card";
import { cn } from "@/lib/utils";

export function JournalFilter({ entries }: { entries: JournalEntryMeta[] }) {
  const tags = useMemo(() => {
    const all = new Set<string>();
    for (const entry of entries) {
      for (const tag of entry.tags) all.add(tag);
    }
    return ["All", ...Array.from(all).sort()];
  }, [entries]);

  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? entries
      : entries.filter((entry) => entry.tags.includes(active));

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            className={cn(
              "focus-ring rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
              active === tag
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-border text-muted hover:border-accent/40 hover:text-foreground",
            )}
          >
            {tag}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted">No entries with this tag yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry, i) => (
            <JournalEntryCard key={entry.slug} entry={entry} index={entries.length - i} />
          ))}
        </div>
      )}
    </>
  );
}
