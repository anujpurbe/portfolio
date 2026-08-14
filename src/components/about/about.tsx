import Link from "next/link";
import { ArrowUpRight, Boxes, Compass, User, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const facetIcons: Record<string, LucideIcon> = {
  "Who I am": User,
  "What I build": Boxes,
  "What I'm learning": Compass,
  "Where I'm headed": Route,
};

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Who I am, how I build">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {profile.about.map((block, i) => {
          const Icon = facetIcons[block.heading] ?? User;
          const inner = (
            <>
              <div className="mb-3 flex items-center justify-between">
                <Icon className="size-5 text-accent" />
                {block.href && (
                  <ArrowUpRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </div>
              <h3 className="mb-1.5 text-sm font-semibold">{block.heading}</h3>
              <p className="text-sm leading-6 text-muted">{block.text}</p>
            </>
          );
          const cardClass =
            "card group flex h-full flex-col p-5 transition-colors";
          return (
            <Reveal key={block.heading} delay={i * 0.07}>
              {block.href ? (
                <Link
                  href={block.href}
                  className={cn(cardClass, "hover:border-accent/50")}
                >
                  {inner}
                </Link>
              ) : (
                <div className={cardClass}>{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
