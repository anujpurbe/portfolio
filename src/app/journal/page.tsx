import type { Metadata } from "next";
import { getAllEntries } from "@/lib/journal";
import { Reveal } from "@/components/ui/reveal";
import { JournalFilter } from "@/components/journal/journal-filter";
import { FeaturedEntry } from "@/components/journal/featured-entry";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Engineering notes, technical lessons, project decisions, and things I'm learning while building.",
};

export default function JournalPage() {
  const entries = getAllEntries();
  const [featured, ...rest] = entries;

  return (
    <div className="pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container-shell">
        <Reveal>
          <header className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
              Journal
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Journal
            </h1>
            <p className="mt-4 leading-7 text-muted">
              Engineering notes, technical lessons, project decisions, and
              things I&apos;m learning while building.
            </p>
          </header>
        </Reveal>

        {entries.length === 0 ? (
          <Reveal>
            <p className="text-muted">No entries yet — check back soon.</p>
          </Reveal>
        ) : (
          <>
            {featured && (
              <Reveal>
                <FeaturedEntry entry={featured} />
              </Reveal>
            )}
            <Reveal>
              <h3 className="mt-14 mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
                Journal entries
              </h3>
            </Reveal>
            <JournalFilter entries={rest} />
          </>
        )}
      </div>
    </div>
  );
}
