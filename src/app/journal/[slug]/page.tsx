import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllEntries, getEntry } from "@/lib/journal";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.excerpt,
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.excerpt,
      publishedTime: entry.date,
      tags: entry.tags,
    },
  };
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const EntryComponent = entry.Component;

  return (
    <article className="pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container-shell max-w-3xl">
        <Link
          href="/journal"
          className="focus-ring muted-link mb-10 inline-flex items-center gap-1.5 rounded-md text-sm"
        >
          <ArrowLeft className="size-4" />
          All entries
        </Link>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <time
              dateTime={entry.date}
              className="font-mono text-xs uppercase tracking-widest text-subtle"
            >
              {formatDate(entry.date)}
            </time>
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {entry.title}
          </h1>
        </header>

        <div className="max-w-none">
          <EntryComponent />
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/journal"
            className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm"
          >
            <ArrowLeft className="size-4" />
            Back to all entries
          </Link>
        </div>
      </div>
    </article>
  );
}
