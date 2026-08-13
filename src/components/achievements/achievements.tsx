import { ExternalLink, Image as ImageIcon, Paperclip, Trophy, Users } from "lucide-react";
import { achievements } from "@/data/profile";
import type { Achievement } from "@/lib/types";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

function ProofIcon({ proof }: { proof: NonNullable<Achievement["proof"]> }) {
  if (proof.image) return <ImageIcon className="size-3.5" />;
  if (proof.file) return <Paperclip className="size-3.5" />;
  return <ExternalLink className="size-3.5" />;
}

const iconFor = (achievement: Achievement) => {
  const title = achievement.title.toLowerCase();
  if (title.includes("rank") || title.includes("top")) return Trophy;
  return Users;
};

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="Achievements"
      title="Milestones & leadership"
      description="Backed by evidence where it exists — no unfalsifiable claims."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement, i) => {
          const Icon = iconFor(achievement);
          return (
            <Reveal key={achievement.title} delay={i * 0.08}>
              <div className="card flex h-full flex-col items-start gap-4 p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="size-5" />
                </span>
                <div className="flex-1">
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
                  {achievement.proof && (
                    <a
                      href={
                        achievement.proof.url ??
                        achievement.proof.image ??
                        achievement.proof.file
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring muted-link mt-4 inline-flex items-center gap-1.5 rounded-md text-xs font-medium"
                    >
                      <ProofIcon proof={achievement.proof} />
                      View proof
                      <ExternalLink className="size-3" />
                    </a>
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
