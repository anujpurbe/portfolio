import { ArrowUpRight, Boxes, Compass, Shield, Route } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const facets = [
  {
    icon: Boxes,
    label: "What I Build",
    text: "Modular, efficient software and DB-backed systems.",
  },
  {
    icon: Compass,
    label: "What I Explore",
    text: "Competitive programming, backend systems, and AI.",
  },
  {
    icon: Shield,
    label: "What I Care About",
    text: "Clean code, algorithmic efficiency, correctness.",
  },
  {
    icon: Route,
    label: "Current Direction",
    text: "A software engineering internship; deeper backend + systems knowledge.",
  },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Who I am, how I build"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
        <Reveal>
          <div className="space-y-5">
            {profile.about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="leading-8 text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {facets.map((facet, i) => {
            const Icon = facet.icon;
            return (
              <Reveal key={facet.label} delay={i * 0.07}>
                <a
                  href="#contact"
                  className="card group block h-full p-5 transition-colors hover:border-accent/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className="size-5 text-accent" />
                    <ArrowUpRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold">{facet.label}</h3>
                  <p className="text-sm leading-6 text-muted">{facet.text}</p>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
