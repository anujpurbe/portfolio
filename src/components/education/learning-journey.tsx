import { GraduationCap } from "lucide-react";
import { learningJourney } from "@/data/education";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function LearningJourney() {
  return (
    <Section
      id="journey"
      eyebrow="Learning journey"
      title="How I got here"
      description="The engineering path so far — updated as semesters pass."
    >
      <div className="relative mx-auto max-w-3xl">
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-accent/60 via-border to-border"
        />
        <div className="space-y-6">
          {learningJourney.map((node, i) => {
            const isLast = i === learningJourney.length - 1;
            return (
              <Reveal key={node.label} delay={i * 0.08}>
                <div className="relative flex gap-5">
                  <span
                    className={cn(
                      "relative z-10 mt-1 grid size-10 shrink-0 place-items-center rounded-full border bg-card shadow-card",
                      node.current
                        ? "border-accent text-accent animate-pulse-soft"
                        : "border-border text-accent",
                    )}
                  >
                    <GraduationCap className="size-5" />
                  </span>
                  <div className="card min-w-0 flex-1 p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-semibold">{node.label}</h3>
                      {node.period && (
                        <span className="font-mono text-xs text-subtle">
                          {node.period}
                        </span>
                      )}
                    </div>
                    {node.title && (
                      <p className="mt-1 text-sm font-medium text-accent">
                        {node.title}
                      </p>
                    )}
                    {node.text && (
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {node.text}
                      </p>
                    )}
                    {node.items && node.items.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {node.items.map((item) => (
                          <li
                            key={item}
                            className="inline-flex rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {isLast && node.current && (
                      <p className="mt-3 inline-flex rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent">
                        NOW
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
