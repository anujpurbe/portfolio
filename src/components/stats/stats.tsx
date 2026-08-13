"use client";

import { Code2, FolderGit2, GraduationCap, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { stats } from "@/data/stats";

type StatItem = {
  key: keyof typeof stats;
  label: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
};

const statItems: StatItem[] = [
  {
    key: "projects",
    label: "Projects built",
    icon: FolderGit2,
  },
  {
    key: "problemsSolved",
    label: "Problems solved",
    suffix: "+",
    icon: Code2,
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: Award,
  },
  {
    key: "cgpa",
    label: "CGPA",
    decimals: 2,
    icon: GraduationCap,
  },
];

export function Stats() {
  return (
    <Section
      id="stats"
      eyebrow="By the numbers"
      title="By the numbers"
      description="Selected metrics from projects, problem solving, academics, and credentials."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statItems.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Reveal key={stat.key} delay={i * 0.08}>
              <div className="card group flex h-full flex-col items-start gap-4 p-6 transition-colors hover:border-accent/50">
                <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <CountUp
                    value={stats[stat.key]}
                    decimals={stat.decimals ?? 0}
                    suffix={stat.suffix ?? ""}
                    className="tabular-nums"
                  />
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
