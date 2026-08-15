import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllEntries } from "@/lib/journal";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { JournalEntryCard } from "@/components/journal/entry-card";

export function JournalSection() {
  const entries = getAllEntries().slice(0, 3);

  return (
    <Section
      id="journal"
      eyebrow="Journal"
      title="Notes & lessons"
      description="Dated entries on what I'm learning and building — engineering notes, technical lessons, and project decisions. New entries land roughly every two weeks."
    >
      {entries.length > 0 && (
        <Reveal>
          <h3 className="mt-12 mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
            Journal entries
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, i) => (
              <Reveal key={entry.slug} delay={i * 0.07}>
                <JournalEntryCard entry={entry} index={entries.length - i} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/journal"
              className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm font-medium"
            >
              Read all entries
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
