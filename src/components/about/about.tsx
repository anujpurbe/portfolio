import { ArrowUpRight, Boxes, Compass, User, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const facetIcons: Record<string, LucideIcon> = {
  "Who I am": User,
  "What I build": Boxes,
  "What I'm learning": Compass,
  "Where I'm headed": Route,
};

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Who I am, how I build">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
        <Reveal>
          <div className="space-y-7">
            {profile.about.map((block) => (
              <div key={block.heading}>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                  {block.heading}
                </h3>
                <p className="leading-8 text-muted">{block.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {profile.about.map((block, i) => {
            const Icon = facetIcons[block.heading] ?? User;
            return (
              <Reveal key={block.heading} delay={i * 0.07}>
                <a
                  href="#contact"
                  className="card group block h-full p-5 transition-colors hover:border-accent/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className="size-5 text-accent" />
                    <ArrowUpRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold">{block.heading}</h3>
                  <p className="text-sm leading-6 text-muted">{block.text}</p>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
