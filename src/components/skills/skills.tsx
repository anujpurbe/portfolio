"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { aspiringStack, currentStack, type TechItem } from "@/data/skills";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { TechRing } from "@/components/skills/tech-ring";

function findItem(items: TechItem[], name: string) {
  return items.find((item) => item.name === name) ?? null;
}

function AspiringChip({ item }: { item: TechItem }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground">
      <span className="size-1.5 rounded-full bg-accent/60" aria-hidden="true" />
      {item.name}
    </span>
  );
}

export function Skills() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = selected
    ? findItem(currentStack, selected)
    : null;

  return (
    <Section
      id="skills"
      eyebrow="Tech stack"
      title="What I work with"
      description="No percentage bars — tap a technology to see where it actually shows up in real work."
    >
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <TechRing
            items={currentStack}
            selected={selected}
            onSelect={setSelected}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card min-h-52 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-subtle">
                Selected
              </span>
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="focus-ring rounded-md font-mono text-xs text-subtle hover:text-foreground"
                >
                  clear
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div
                  key={selectedItem.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold">
                    {selectedItem.name}
                  </h3>
                  {selectedItem.note && (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {selectedItem.note}
                    </p>
                  )}
                  {selectedItem.usedIn && selectedItem.usedIn.length > 0 ? (
                    <div className="mt-4">
                      <p className="mb-2 text-xs uppercase tracking-widest text-subtle">
                        Where it shows up
                      </p>
                      <ul className="space-y-1.5">
                        {selectedItem.usedIn.map((slug) => {
                          const project = projects.find((p) => p.slug === slug);
                          if (!project) return null;
                          return (
                            <li key={slug}>
                              <Link
                                href={`/projects/${slug}`}
                                className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm"
                              >
                                <span className="text-accent">↳</span>
                                {project.title}
                                <ArrowUpRight className="size-3" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-subtle">
                      Part of my everyday toolchain — linked to a project here
                      as soon as one ships with it.
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm leading-6 text-subtle">
                    Tap a technology on the ring to see the evidence — which
                    project uses it and what it does there.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
              <Sparkles className="size-3.5" />
              Aspiring to master
            </h3>
            <div className="flex flex-wrap gap-2">
              {aspiringStack.map((item) => (
                <AspiringChip key={item.name} item={item} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
