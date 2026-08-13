"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, MousePointerClick, Sparkles } from "lucide-react";
import { aspiringStack, currentStack, type TechItem } from "@/data/skills";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { TechRing } from "@/components/skills/tech-ring";
import { cn } from "@/lib/utils";

const tileStyles: Record<string, string> = {
  hiingers: "from-rose-500/25 to-orange-500/10",
  "atomic-endurance": "from-emerald-500/25 to-teal-500/10",
  foodiehub: "from-amber-500/25 to-red-500/10",
  portfolio: "from-indigo-500/25 to-blue-500/10",
  "dsa-algorithms": "from-accent/30 to-indigo-500/10",
  "sql-database": "from-sky-500/25 to-emerald-500/10",
};

const tileCodes: Record<string, string> = {
  hiingers: "HI",
  "atomic-endurance": "BT",
  foodiehub: "FH",
  portfolio: "PF",
  "dsa-algorithms": "DS",
  "sql-database": "DB",
};

function findItem(items: TechItem[], name: string) {
  return items.find((item) => item.name === name) ?? null;
}

export function Skills() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = selected
    ? findItem(currentStack, selected) ?? findItem(aspiringStack, selected)
    : null;
  const isAspiring = Boolean(
    selected && findItem(aspiringStack, selected),
  );

  const usedProjects = selectedItem?.usedIn
    ?.map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  return (
    <Section
      id="skills"
      eyebrow="Tech stack"
      title="What I work with"
      description="No percentage bars — tap a technology on the ring and inspect where it shows up in real work."
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <TechRing
            current={currentStack}
            aspiring={aspiringStack}
            selected={selected}
            onSelect={setSelected}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-amber-400/70" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-emerald-400/70" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs text-subtle">
                {selectedItem ? selectedItem.name : "technology map"}
              </span>
            </div>

            <div className="min-h-[300px] p-6">
              <AnimatePresence mode="wait">
                {selectedItem ? (
                  <motion.div
                    key={selectedItem.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "grid size-14 shrink-0 place-items-center rounded-2xl font-mono text-base font-bold",
                          isAspiring
                            ? "border border-dashed border-border text-subtle"
                            : "bg-accent-soft text-accent",
                        )}
                      >
                        {selectedItem.short}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold tracking-tight">
                          {selectedItem.name}
                        </h3>
                        <span
                          className={cn(
                            "mt-1 inline-flex rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                            isAspiring
                              ? "border border-dashed border-border text-subtle"
                              : "bg-accent-soft text-accent",
                          )}
                        >
                          {isAspiring ? "learning next" : "current stack"}
                        </span>
                      </div>
                    </div>

                    {selectedItem.note && (
                      <p className="mt-4 text-sm leading-6 text-muted">
                        {selectedItem.note}
                      </p>
                    )}

                    {usedProjects && usedProjects.length > 0 ? (
                      <div className="mt-5">
                        <p className="mb-2 text-xs uppercase tracking-widest text-subtle">
                          Where it shows up
                        </p>
                        <div className="space-y-2">
                          {usedProjects.map((project) => (
                            <Link
                              key={project.slug}
                              href={`/projects/${project.slug}`}
                              className="focus-ring group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-accent/50 hover:bg-surface"
                            >
                              <span
                                className={cn(
                                  "grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br font-mono text-xs font-bold",
                                  tileStyles[project.slug] ??
                                    "from-accent/25 to-indigo-500/10",
                                )}
                              >
                                {tileCodes[project.slug] ?? "WK"}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium group-hover:text-accent">
                                  {project.title}
                                </span>
                                <span className="block text-xs text-subtle">
                                  {project.category}
                                </span>
                              </span>
                              <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-6 text-subtle">
                        Part of my everyday toolchain — linked to a project
                        here as soon as one ships with it.
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
                    className="flex h-full flex-col items-start justify-center gap-4"
                  >
                    <div className="flex -space-x-3" aria-hidden="true">
                      {["PY", "TS", "DS"].map((code, i) => (
                        <span
                          key={code}
                          className={cn(
                            "grid size-12 place-items-center rounded-2xl border font-mono text-sm font-bold shadow-elevated backdrop-blur-sm",
                            i === 0 && "z-30 border-accent bg-accent-soft text-accent",
                            i === 1 && "z-20 border-border bg-card text-foreground",
                            i === 2 && "z-10 border-border bg-card text-muted",
                          )}
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-6 text-muted">
                      The ring spins on its own when it scrolls into view. Tap
                      any chip to pin it here — the outer ring is my current
                      stack, the dashed inner ring is what I&apos;m learning
                      next. Every skill links to a real project.
                    </p>
                    <p className="inline-flex items-center gap-2 font-mono text-xs text-subtle">
                      <MousePointerClick className="size-3.5" />
                      Try: DSA, Python, Supabase…
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
              <Sparkles className="size-3.5" />
              Learning next
            </h3>
            <div className="flex flex-wrap gap-2">
              {aspiringStack.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelected(item.name)}
                  className={cn(
                    "focus-ring inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    selected === item.name
                      ? "border-accent bg-accent-soft text-foreground"
                      : "border-border bg-card text-muted hover:border-accent/40 hover:text-foreground",
                  )}
                >
                  <span
                    className="size-1.5 rounded-full bg-accent/60"
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
