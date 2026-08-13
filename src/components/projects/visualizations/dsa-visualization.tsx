"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  Pause,
  Play,
  RefreshCw,
  StepForward,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ARRAY = [3, 7, 12, 19, 24, 31, 42, 55, 60, 74, 81, 93];
const TARGETS = [12, 31, 55, 74, 88];

type State = {
  lo: number;
  hi: number;
  mid: number;
  found: number | null;
  step: number;
  log: string[];
};

function initialState(target: number): State {
  return {
    lo: 0,
    hi: ARRAY.length - 1,
    mid: -1,
    found: null,
    step: 0,
    log: [`binarySearch(${JSON.stringify(ARRAY)}, ${target})`],
  };
}

function advance(s: State, target: number): State {
  if (s.found !== null) return s;
  const next: State = { ...s, step: s.step + 1, log: [...s.log] };
  if (s.mid >= 0 && ARRAY[s.mid] === target) {
    next.found = s.mid;
    next.log.push(`✓ arr[${s.mid}] === ${target} — found`);
    return next;
  }
  if (s.lo > s.hi) {
    next.found = -1;
    next.log.push(`✗ search space exhausted — ${target} not present`);
    return next;
  }
  const mid = Math.floor((s.lo + s.hi) / 2);
  next.mid = mid;
  if (ARRAY[mid] === target) {
    next.found = mid;
    next.log.push(`✓ mid = ${mid}, arr[${mid}] === ${target} — found`);
    return next;
  }
  if (ARRAY[mid] < target) {
    next.log.push(
      `arr[${mid}] = ${ARRAY[mid]} < ${target} — drop left half`,
    );
    next.lo = mid + 1;
  } else {
    next.log.push(
      `arr[${mid}] = ${ARRAY[mid]} > ${target} — drop right half`,
    );
    next.hi = mid - 1;
  }
  return next;
}

export function DsaVisualization() {
  const reduceMotion = useReducedMotion();
  const [target, setTarget] = useState(55);
  const [state, setState] = useState<State>(() => initialState(55));
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (running) {
      timer.current = setInterval(() => {
        setState((s) => {
          const n = advance(s, target);
          if (n.found !== null || n.lo > n.hi) setRunning(false);
          return n;
        });
      }, reduceMotion ? 150 : 900);
    } else if (timer.current) {
      clearInterval(timer.current);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running, target, reduceMotion]);

  function reset(nextTarget = target) {
    setRunning(false);
    setTarget(nextTarget);
    setState(initialState(nextTarget));
  }

  const done = state.found !== null;
  const active = state.mid >= 0;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-subtle">
          binary search · O(log n)
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            disabled={done}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {running ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
            {running ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => setState((s) => advance(s, target))}
            disabled={done}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground disabled:opacity-50"
          >
            <StepForward className="size-3.5" />
            Step
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-subtle">
          <Target className="size-3" /> target:
        </span>
        {TARGETS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => reset(t)}
            className={cn(
              "focus-ring rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
              t === target
                ? "border-accent bg-accent-soft text-foreground"
                : "border-border text-muted hover:border-accent/50",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-1.5" aria-live="polite">
        {ARRAY.map((value, i) => {
          const inRange = state.lo <= i && i <= state.hi;
          const isMid = active && i === state.mid;
          const isFound = state.found === i;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              {isMid && (
                <span className="font-mono text-[9px] text-accent">
                  mid
                </span>
              )}
              <div
                className={cn(
                  "grid h-8 w-full place-items-center rounded-md border font-mono text-xs transition-all duration-200",
                  isFound
                    ? "border-emerald-400 bg-emerald-400/15 text-emerald-500"
                    : isMid
                      ? "border-accent bg-accent/15 text-foreground shadow-glow"
                      : inRange
                        ? "border-border bg-card text-foreground"
                        : "border-border/50 bg-surface text-subtle/40",
                )}
              >
                {value}
              </div>
              <span className="font-mono text-[9px] text-subtle">
                {i === state.lo ? "lo" : i === state.hi ? "hi" : i}
              </span>
              <div
                className={cn(
                  "h-0.5 w-full rounded-full transition-colors",
                  isMid ? "bg-accent" : "bg-transparent",
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="font-mono text-xs text-muted">
          {done
            ? state.found !== -1
              ? `Found ${target} at index ${state.found}`
              : `${target} not found`
            : active
              ? `Searching… ${state.lo}..${state.hi}`
              : "Press play or step to search"}
        </p>
        <span className="font-mono text-xs text-subtle">
          steps · {state.step}
        </span>
      </div>

      <div className="hidden max-h-28 flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-surface/60 p-3 sm:flex">
        {state.log.map((line, i) => (
          <p key={i} className="font-mono text-[11px] leading-5 text-muted">
            <span className="mr-2 text-subtle">{String(i + 1).padStart(2, "0")}</span>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
