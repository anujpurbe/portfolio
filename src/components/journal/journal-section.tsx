import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllEntries } from "@/lib/journal";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { JournalEntryCard } from "@/components/journal/entry-card";

export function JournalSection() {
  const entries = getAllEntries().slice(0, 3);

  if (entries.length === 0) return null;

  return (
    <Section
      id="journal"
      eyebrow="Journal"
      title="Build log"
      description="Dated entries on what I'm learning, building, and fixing — this is what keeps the site alive between big launches."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <Reveal key={entry.slug} delay={i * 0.07}>
            <JournalEntryCard entry={entry} index={entries.length - i} />
          </Reveal>
        ))}
      </div>
      <Reveal>
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
    </Section>
  );
}
