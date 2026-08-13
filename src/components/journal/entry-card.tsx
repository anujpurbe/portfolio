import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { JournalEntryMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function JournalEntryCard({
  entry,
  index,
}: {
  entry: JournalEntryMeta;
  index?: number;
}) {
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className="card focus-ring group flex h-full flex-col p-6 transition-colors hover:border-accent/50"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-subtle">
          {formatDate(entry.date)}
        </span>
        <span className="flex items-center gap-3">
          {entry.readingTime && (
            <span className="font-mono text-xs text-subtle">
              {entry.readingTime}
            </span>
          )}
          {typeof index === "number" && (
            <span className="font-mono text-xs text-subtle">
              {String(index).padStart(2, "0")}
            </span>
          )}
        </span>
      </div>
      <h3 className="font-semibold leading-6 tracking-tight">
        {entry.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">
        {entry.excerpt}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-subtle transition-colors group-hover:text-accent" />
      </div>
    </Link>
  );
}
