import { Trophy, Users } from "lucide-react";
import { achievements } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const iconFor = (i: number) => (i === 0 ? Trophy : Users);

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="Achievements"
      title="Milestones & leadership"
      description="Structured so hackathons, competitive-programming milestones, and future awards slot straight in."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement, i) => {
          const Icon = iconFor(i);
          return (
            <Reveal key={achievement.title} delay={i * 0.08}>
              <div className="card flex h-full items-start gap-4 p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold leading-6">
                    {achievement.title}
                  </h3>
                  <p className="mt-1 text-sm text-subtle">
                    {achievement.context}
                    {achievement.year ? ` · ${achievement.year}` : ""}
                  </p>
                  {achievement.details && (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {achievement.details}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
