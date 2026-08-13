import Link from "next/link";
import { ArrowUpRight, Compass, Hammer, BookOpen } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type CurrentlyItem = { label: string; tech: string; href?: string };

function ItemRow({ item }: { item: CurrentlyItem }) {
  const content = (
    <>
      <span className="leading-6 text-foreground">{item.label}</span>
      <span className="mt-0.5 block font-mono text-[11px] text-subtle">
        {item.tech}
      </span>
    </>
  );
  if (item.href) {
    return (
      <li>
        <Link
          href={item.href}
          className="focus-ring group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface"
        >
          <span>{content}</span>
          <ArrowUpRight
            className={cn(
              "size-4 shrink-0 text-subtle transition-transform duration-200",
              "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent",
            )}
          />
        </Link>
      </li>
    );
  }
  return (
    <li className="px-2 py-1.5">
      {content}
    </li>
  );
}

const blocks = [
  {
    icon: BookOpen,
    label: "LEARNING",
    hint: "what I'm studying",
    items: profile.currently.learning,
  },
  {
    icon: Hammer,
    label: "BUILDING",
    hint: "what I'm shipping",
    items: profile.currently.building,
  },
  {
    icon: Compass,
    label: "EXPLORING",
    hint: "where I'm heading",
    items: profile.currently.exploring,
  },
];

export function Currently() {
  return (
    <Section
      eyebrow="Currently"
      title="What I'm working on right now"
      description="The tools and topics I'm focused on this term — updated as my focus shifts."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((block, i) => {
          const Icon = block.icon;
          return (
            <Reveal key={block.label} delay={i * 0.08}>
              <div className="card h-full p-6">
                <div className="mb-4 flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-accent" />
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
                      {block.label}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                    {block.hint}
                  </span>
                </div>
                <ul className="space-y-1">
                  {block.items.map((item) => (
                    <ItemRow key={item.label} item={item} />
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
