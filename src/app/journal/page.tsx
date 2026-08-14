import type { Metadata } from "next";
import { getAllEntries } from "@/lib/journal";
import { Reveal } from "@/components/ui/reveal";
import { JournalFilter } from "@/components/journal/journal-filter";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "An engineering log: what Anuj Purbe is learning, building, and fixing — DSA notes, project logs, and lessons from competitive programming.",
};

export default function JournalPage() {
  const entries = getAllEntries();

  return (
    <div className="pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container-shell">
        <Reveal>
          <header className="mb-12 max-w-2xl">
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
              Journal
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Engineering log
            </h1>
            <p className="mt-4 leading-7 text-muted">
              Dated notes on what I&apos;m learning, building, and fixing. No
              full CMS — one MDX file per entry — and a new entry lands roughly
              every two weeks.
            </p>
          </header>
        </Reveal>

        {entries.length === 0 ? (
          <Reveal>
            <p className="text-muted">No entries yet — check back soon.</p>
          </Reveal>
        ) : (
          <JournalFilter entries={entries} />
        )}
      </div>
    </div>
  );
}
