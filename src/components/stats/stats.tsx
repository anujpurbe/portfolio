"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, FolderGit2, GraduationCap, Award } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

function CountUp({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value * eased);
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const stats = [
  {
    label: "Projects built",
    value: 6,
    suffix: "",
    icon: FolderGit2,
  },
  {
    label: "Problems solved",
    value: 100,
    suffix: "+",
    icon: Code2,
  },
  {
    label: "Certificates",
    value: 4,
    suffix: "",
    icon: Award,
  },
  {
    label: "CGPA",
    value: 8.6,
    decimals: 2,
    suffix: "",
    icon: GraduationCap,
  },
];

export function Stats() {
  return (
    <Section
      id="stats"
      eyebrow="By the numbers"
      title="Verified, not inflated"
      description="Every figure below is real — from projects shipped, problems solved, and credentials earned."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="card group flex h-full flex-col items-start gap-4 p-6 transition-colors hover:border-accent/50">
                <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    suffix={stat.suffix}
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
