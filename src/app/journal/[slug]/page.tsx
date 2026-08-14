import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getAllEntries,
  getEntry,
  getEntryHeadings,
  getAdjacentEntries,
  getRelatedEntries,
} from "@/lib/journal";
import { formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/projects";
import { ReadingProgress } from "@/components/journal/reading-progress";
import { CopyLink } from "@/components/journal/copy-link";

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
      modifiedTime: entry.updated,
      tags: entry.tags,
    },
  };
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const headings = getEntryHeadings(slug);
  const { prev, next } = getAdjacentEntries(slug);
  const relatedEntries = getRelatedEntries(slug, 2);
  const relatedProject = entry.relatedProject
    ? projects.find((project) => project.slug === entry.relatedProject)
    : null;
  const EntryComponent = entry.Component;

  return (
    <>
      <ReadingProgress />
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
              {entry.updated && (
                <span className="font-mono text-xs uppercase tracking-widest text-subtle">
                  Updated {formatDate(entry.updated)}
                </span>
              )}
              {entry.readingTime && (
                <span className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {entry.readingTime}
                </span>
              )}
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <span className="ml-auto">
                <CopyLink />
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {entry.title}
            </h1>
          </header>

          {headings.length >= 3 && (
            <nav
              aria-label="On this page"
              className="mb-10 rounded-lg border border-border bg-surface-2/60 p-5"
            >
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-subtle">
                On this page
              </p>
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={cn(
                        "focus-ring muted-link rounded text-sm transition-colors hover:text-foreground",
                        heading.level === 3 && "pl-4",
                      )}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="journal-body max-w-none">
            <EntryComponent />
          </div>

          {relatedProject && (
            <div className="mt-14 rounded-lg border border-border p-5">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-subtle">
                Related project
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-semibold">{relatedProject.title}</p>
                <Link
                  href={`/projects/${relatedProject.slug}`}
                  className="focus-ring muted-link inline-flex shrink-0 items-center gap-1.5 rounded-md text-sm"
                >
                  Explore project
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}

          {(prev || next) && (
            <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row">
              {prev ? (
                <Link
                  href={`/journal/${prev.slug}`}
                  className="card focus-ring group flex-1 p-5 transition-colors hover:border-accent/50"
                >
                  <span className="font-mono text-xs text-subtle">
                    ← Previous article
                  </span>
                  <span className="mt-1.5 block text-sm font-medium leading-6 group-hover:text-accent">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden flex-1 sm:block" aria-hidden />
              )}
              {next ? (
                <Link
                  href={`/journal/${next.slug}`}
                  className="card focus-ring group flex-1 p-5 text-right transition-colors hover:border-accent/50"
                >
                  <span className="font-mono text-xs text-subtle">
                    Next article →
                  </span>
                  <span className="mt-1.5 block text-sm font-medium leading-6 group-hover:text-accent">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden flex-1 sm:block" aria-hidden />
              )}
            </div>
          )}

          {relatedEntries.length > 0 && (
            <section className="mt-14" aria-label="More journal entries">
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
                More journal entries
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedEntries.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/journal/${related.slug}`}
                    className="card focus-ring group flex h-full flex-col p-5 transition-colors hover:border-accent/50"
                  >
                    <span className="font-mono text-xs text-subtle">
                      {formatDate(related.date)} · {related.readingTime}
                    </span>
                    <span className="mt-2 font-medium leading-6 group-hover:text-accent">
                      {related.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

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
    </>
  );
}
