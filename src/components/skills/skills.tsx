"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { skillCategories, skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const categoryIntro: Record<string, string> = {
  Languages: "What I write software in.",
  "Core CS": "The fundamentals everything else rests on.",
  Mathematics: "Applied math from coursework.",
  Database: "Structured data, querying, modeling.",
  Tools: "The everyday toolchain.",
};

export function Skills() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedSkill = skills.find((s) => s.name === selected);

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Evidence-backed, not self-rated"
      description="No percentage bars — skills are grouped by area. Select a skill to see which project actually uses it."
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          {skillCategories.map((category) => {
            const categorySkills = skills.filter(
              (s) => s.category === category,
            );
            return (
              <Reveal key={category}>
                <div>
                  <div className="mb-3 flex items-baseline gap-3">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                      {category}
                    </h3>
                    <p className="text-xs text-subtle">
                      {categoryIntro[category]}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => {
                      const active = selected === skill.name;
                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onClick={() =>
                            setSelected(active ? null : skill.name)
                          }
                          aria-pressed={active}
                          className={cn(
                            "focus-ring rounded-lg border px-3.5 py-2 text-sm transition-colors",
                            active
                              ? "border-accent bg-accent-soft text-foreground"
                              : "border-border bg-card text-muted hover:border-accent/50 hover:text-foreground",
                          )}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="card sticky top-24 min-h-52 p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-subtle">
                Skill detail
              </span>
              <ArrowDownRight className="size-3.5 text-subtle" />
            </div>

            <AnimatePresence mode="wait">
              {selectedSkill ? (
                <motion.div
                  key={selectedSkill.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold">
                    {selectedSkill.name}
                  </h3>
                  {selectedSkill.note && (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {selectedSkill.note}
                    </p>
                  )}
                  {selectedSkill.usedIn.length > 0 ? (
                    <div className="mt-4">
                      <p className="mb-2 text-xs uppercase tracking-widest text-subtle">
                        Used in
                      </p>
                      <ul className="space-y-1.5">
                        {selectedSkill.usedIn.map((slug) => {
                          const project = projects.find(
                            (p) => p.slug === slug,
                          );
                          if (!project) return null;
                          return (
                            <li key={slug}>
                              <a
                                href="#projects"
                                onClick={() =>
                                  document
                                    .getElementById("projects")
                                    ?.scrollIntoView({ behavior: "smooth" })
                                }
                                className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm"
                              >
                                <span className="text-accent">↳</span>
                                {project.title}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-subtle">
                      Learned and practiced — appears in coursework and personal
                      work. Will be linked here as soon as a project uses it.
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
                    Select a skill on the left to see where it shows up in real
                    work.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
