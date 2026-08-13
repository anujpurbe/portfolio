"use client";

import { useReducedMotion } from "motion/react";
import {
  Binary,
  Braces,
  Database,
  FileQuestion,
  Target,
} from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  PROBLEM: FileQuestion,
  ALGORITHM: Binary,
  CODE: Braces,
  DATA: Database,
  RESULT: Target,
};

const colors = [
  "text-amber-300 bg-amber-400/10 border-amber-400/20",
  "text-sky-300 bg-sky-400/10 border-sky-400/20",
  "text-violet-300 bg-violet-400/10 border-violet-400/20",
  "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
];

// A single pulse travels left-to-right through the connectors in sequence.
// Each connector gets its own keyframes so the pulse only moves during its
// window of the shared cycle (STEP * connectorCount).
function buildKeyframes(n: number) {
  const step = 0.45;
  const total = step * n;
  const f = 100 / n;
  const xFrames: string[] = [];
  const yFrames: string[] = [];
  for (let i = 0; i < n; i++) {
    const start = i * f;
    const fadeIn = start + f * 0.2;
    const fadeOut = start + f * 0.8;
    const end = (i + 1) * f;
    xFrames.push(`@keyframes pulse-x-${i}{0%{left:0;opacity:0}${start}%{left:0;opacity:0}${fadeIn}%{left:0;opacity:1}${fadeOut}%{left:calc(100% - 6px);opacity:1}${end}%{left:calc(100% - 6px);opacity:0}100%{left:calc(100% - 6px);opacity:0}}`);
    yFrames.push(`@keyframes pulse-y-${i}{0%{top:0;opacity:0}${start}%{top:0;opacity:0}${fadeIn}%{top:0;opacity:1}${fadeOut}%{top:calc(100% - 6px);opacity:1}${end}%{top:calc(100% - 6px);opacity:0}100%{top:calc(100% - 6px);opacity:0}}`);
  }
  return {
    total,
    xFrames,
    yFrames,
  };
}

export function SystemDiagram({ steps }: { steps: string[] }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { total, xFrames, yFrames } = buildKeyframes(steps.length);

  function onPointerMove(e: React.PointerEvent) {
    if (reduceMotion || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
  }

  function onPointerLeave() {
    if (!ref.current) return;
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="[perspective:1200px] select-none"
    >
      <style>{[...xFrames, ...yFrames].join("")}</style>
      <div
        aria-hidden="true"
        className="grid gap-y-2 rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur-sm transition-transform duration-300 ease-out will-change-transform sm:p-5"
        style={{
          transform:
            "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        }}
      >
        <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
          {steps.map((step, i) => {
            const Icon = icons[step] ?? Target;
            const isLast = i === steps.length - 1;
            return (
              <div
                key={step}
                className="flex flex-col items-center gap-2 md:flex-1 md:flex-row"
              >
                <div
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:ring-1 hover:ring-accent/50 md:w-auto md:flex-1",
                    colors[i % colors.length],
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} />
                  <span className="font-mono text-xs font-medium tracking-wide">
                    {step}
                  </span>
                </div>
                {!isLast && (
                  <div className="relative h-6 w-0.5 md:h-0.5 md:w-8 lg:w-12">
                    <span className="absolute inset-0 rounded-full bg-border" />
                    <span
                      className={cn(
                        "absolute size-1.5 rounded-full bg-accent",
                        !reduceMotion &&
                          `animate-[pulse-y-${i}_${total}s_linear_infinite] md:animate-[pulse-x-${i}_${total}s_linear_infinite]`,
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-2 border-t border-border pt-3 text-center">
          <p className="font-mono text-[11px] tracking-wide text-subtle">
            how I think — dsa first, always
          </p>
        </div>
      </div>
    </div>
  );
}
