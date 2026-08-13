import { GraduationCap, MapPin } from "lucide-react";
import { education } from "@/data/education";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[19px] w-px bg-border"
        />
        <div className="space-y-6">
          {education.map((item, i) => (
            <Reveal key={item.institution} delay={i * 0.08}>
              <div className="relative flex gap-5">
                <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card text-accent shadow-card">
                  <GraduationCap className="size-5" />
                </span>
                <div className="card min-w-0 flex-1 p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-semibold">{item.institution}</h3>
                    <span className="font-mono text-xs text-subtle">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-accent">
                    {item.degree}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-subtle">
                    <MapPin className="size-3.5" />
                    {item.location}
                  </p>
                  {item.highlight && (
                    <p className="mt-3 inline-flex rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent">
                      {item.highlight}
                    </p>
                  )}
                  {item.details && (
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {item.details}
                    </p>
                  )}
                  {item.coursework && item.coursework.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.coursework.map((course) => (
                        <Badge key={course}>{course}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
