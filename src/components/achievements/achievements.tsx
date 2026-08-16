"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Image as ImageIcon, Paperclip, Trophy, Users, X } from "lucide-react";
import { achievements } from "@/data/achievements";
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
  const [proofOpen, setProofOpen] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!proofOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setProofOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [proofOpen]);

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
                    <button
                      type="button"
                      onClick={() => setProofOpen(achievement)}
                      className="focus-ring muted-link mt-4 inline-flex items-center gap-1.5 rounded-md text-xs font-medium"
                    >
                      <ProofIcon proof={achievement.proof} />
                      {achievement.proof.image ? "View certificate" : "View proof"}
                      <ExternalLink className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {proofOpen?.proof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-title"
          onClick={() => setProofOpen(null)}
        >
          <div
            className="card w-full max-w-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 id="certificate-title" className="font-semibold">
                  {proofOpen.title}
                </h3>
                <p className="mt-0.5 font-mono text-xs text-subtle">
                  {proofOpen.context}
                  {proofOpen.year ? ` · ${proofOpen.year}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProofOpen(null)}
                aria-label="Close certificate"
                className="focus-ring grid size-8 shrink-0 place-items-center rounded-md border border-border text-muted transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              {proofOpen.proof.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proofOpen.proof.image}
                  alt={`Certificate for ${proofOpen.title}`}
                  className="h-auto max-h-[65vh] w-full object-contain"
                />
              ) : (
                <div className="p-6 text-sm text-muted">
                  {proofOpen.proof.file ?? proofOpen.proof.url}
                </div>
              )}
            </div>

            {proofOpen.proof.file && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-subtle">
                  Opens the full certificate PDF in a new tab.
                </p>
                <a
                  href={proofOpen.proof.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                  Open PDF
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}
