import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { JournalEntryMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function FeaturedEntry({ entry }: { entry: JournalEntryMeta }) {
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className="card focus-ring group block p-6 transition-colors hover:border-accent/50 sm:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Featured entry
        </span>
        <span className="font-mono text-xs text-subtle">
          {formatDate(entry.date)}
        </span>
        {entry.readingTime && (
          <span className="font-mono text-xs text-subtle">
            {entry.readingTime}
          </span>
        )}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {entry.title}
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted">{entry.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {entry.tags.map((tag) => (
          <Badge key={tag}>#{tag}</Badge>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm text-accent">
        Read article
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
