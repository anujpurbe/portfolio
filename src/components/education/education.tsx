import { GraduationCap } from "lucide-react";
import { education } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="space-y-4">
        {education.map((item, i) => (
          <Reveal key={item.institution} delay={i * 0.08}>
            <div className="card flex items-start gap-4 p-6 sm:gap-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                <GraduationCap className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-semibold">{item.institution}</h3>
                  <span className="font-mono text-xs text-subtle">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-accent">
                  {item.degree}
                </p>
                <p className="mt-1 text-sm text-subtle">{item.location}</p>
                {item.highlight && (
                  <p className="mt-2 inline-flex rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent">
                    {item.highlight}
                  </p>
                )}
                <p className="mt-3 text-sm leading-6 text-muted">
                  {item.details}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
