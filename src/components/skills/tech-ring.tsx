"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Move3d } from "lucide-react";
import type { TechItem } from "@/data/skills";
import { cn } from "@/lib/utils";

type DragState = {
  active: boolean;
  lastX: number;
  moved: boolean;
};

const AUTO_SPEED = 0.22;
const OUTER_R = 138;
const INNER_R = 88;
const SNAP_MS = 480;

function normalize(deg: number) {
  return ((deg % 360) + 360) % 360;
}

export function TechRing({
  current,
  aspiring,
  selected,
  onSelect,
}: {
  current: TechItem[];
  aspiring: TechItem[];
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const dragRef = useRef<DragState>({ active: false, lastX: 0, moved: false });
  const didDragRef = useRef(false);
  const touchedRef = useRef(false);
  const visibleRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const snapRef = useRef<{
    from: number;
    target: number;
    start: number;
  } | null>(null);
  const rafRef = useRef(0);

  const currentRef = useRef(current);
  currentRef.current = current;

  function applyRotation(next: number) {
    rotationRef.current = next;
    setRotation(next);
  }

  function snapTarget() {
    const n = currentRef.current.length;
    let best = { target: 0, dist: Infinity };
    for (let i = 0; i < n; i++) {
      const aDeg = (360 / n) * i - 90;
      const target = normalize(-90 - aDeg);
      const dist = Math.abs(normalize(rotationRef.current - target + 180) - 180);
      if (dist < best.dist) best = { target, dist };
    }
    return best.target;
  }

  function snap() {
    const target = snapTarget();
    if (reduceMotionRef.current) {
      applyRotation(target);
      return;
    }
    snapRef.current = {
      from: rotationRef.current,
      target,
      start: performance.now(),
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  function tick(now: number) {
    const drag = dragRef.current;
    let active = false;
    let next = rotationRef.current;

    if (!drag.active && snapRef.current) {
      const s = snapRef.current;
      const t = Math.min((now - s.start) / SNAP_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      next = s.from + (s.target - s.from) * eased;
      applyRotation(next);
      if (t < 1) active = true;
      else snapRef.current = null;
    } else if (!drag.active && Math.abs(velocityRef.current) > 0.12) {
      next = rotationRef.current + velocityRef.current;
      velocityRef.current *= 0.94;
      applyRotation(next);
      if (Math.abs(velocityRef.current) > 0.12) {
        active = true;
      } else {
        snap();
      }
    } else if (
      !drag.active &&
      !touchedRef.current &&
      !reduceMotionRef.current
    ) {
      next = rotationRef.current + AUTO_SPEED;
      applyRotation(next);
      active = true;
    }

    if (active && visibleRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ring = ringRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      cancelAnimationFrame(rafRef.current);
      if (visibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    });
    if (ring) observer.observe(ring);

    function endDrag() {
      const drag = dragRef.current;
      if (!drag.active) return;
      drag.active = false;
      if (drag.moved) snap();
    }
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected || reduceMotionRef.current) return;
    const index = currentRef.current.findIndex((s) => s.name === selected);
    if (index < 0) return;
    const aDeg = (360 / currentRef.current.length) * index - 90;
    const target = normalize(-90 - aDeg);
    snapRef.current = {
      from: rotationRef.current,
      target,
      start: performance.now(),
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function onPointerDown(e: ReactPointerEvent) {
    touchedRef.current = true;
    dragRef.current = { active: true, lastX: e.clientX, moved: false };
    snapRef.current = null;
    velocityRef.current = 0;
    cancelAnimationFrame(rafRef.current);
  }

  function onPointerMove(e: ReactPointerEvent) {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = e.clientX - drag.lastX;
    drag.lastX = e.clientX;
    if (Math.abs(dx) > 3) {
      drag.moved = true;
      didDragRef.current = true;
    }
    velocityRef.current = dx * 0.1;
    applyRotation(rotationRef.current + dx * 0.45);
  }

  function onPointerUp() {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (drag.moved) snap();
  }

  function select(name: string) {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    onSelect(selected === name ? null : name);
  }

  const selectedItem =
    current.find((s) => s.name === selected) ?? null;

  function renderItems(
    items: TechItem[],
    radius: number,
    layer: "current" | "aspiring",
  ) {
    const n = items.length;
    return items.map((item, i) => {
      const angle = (i / n) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const isSelected = selected === item.name;
      return (
        <button
          key={item.name}
          type="button"
          aria-pressed={isSelected}
          onClick={() => select(item.name)}
          className={cn(
            "focus-ring absolute left-1/2 top-1/2 flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 backdrop-blur-sm transition-[border-color,background-color,color,box-shadow,scale] duration-200",
            layer === "current"
              ? "border bg-card text-muted hover:scale-110 hover:text-foreground"
              : "border-dashed border-border bg-card/60 text-subtle hover:scale-110 hover:text-muted",
            isSelected
              ? "scale-110 border-accent bg-accent-soft text-foreground shadow-glow"
              : "hover:border-accent/50",
          )}
          style={{
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-rotation}deg)`,
          }}
        >
          <span
            className={cn(
              "grid size-9 place-items-center rounded-lg font-mono text-[11px] font-bold tracking-wide",
              layer === "current"
                ? "bg-accent-soft text-accent"
                : "bg-surface-2 text-subtle",
              isSelected && "bg-accent text-accent-foreground",
            )}
          >
            {item.short}
          </span>
          <span
            className={cn(
              "max-w-16 truncate text-[9px] font-medium",
              layer === "current" ? "text-current" : "text-subtle",
            )}
          >
            {item.name}
          </span>
        </button>
      );
    });
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={ringRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative grid h-[340px] w-[340px] touch-none select-none place-items-center sm:h-[380px] sm:w-[380px]"
        aria-label="Technology stack — drag to rotate, tap a technology to inspect it"
      >
        <div
          className="absolute inset-0 rounded-full border border-dashed border-border/70"
          aria-hidden="true"
        />
        <div
          className="absolute inset-[72px] rounded-full border border-border/40"
          aria-hidden="true"
        />
        <span
          className="absolute inset-16 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <span
          className="bg-grid absolute inset-8 rounded-full opacity-60"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {renderItems(aspiring, INNER_R, "aspiring")}
          {renderItems(current, OUTER_R, "current")}
        </div>

        <div className="relative z-10 grid size-20 place-items-center rounded-full border border-border bg-background/85 text-center shadow-elevated backdrop-blur-sm">
          {selectedItem ? (
            <div>
              <p className="font-mono text-sm font-bold tracking-wide text-accent">
                {selectedItem.short}
              </p>
              <p className="max-w-16 truncate text-[9px] font-medium">
                {selectedItem.name}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-mono text-xs font-bold tracking-widest text-accent">
                CORE
              </p>
              <p className="text-[9px] text-subtle">engineering</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <p className="flex items-center gap-2 font-mono text-xs text-subtle">
          <Move3d className="size-3.5" />
          Drag to spin · Tap to inspect
        </p>
        <div className="flex items-center gap-4 font-mono text-[10px] text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-accent" aria-hidden="true" />
            Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2 rounded-sm border border-dashed border-subtle"
              aria-hidden="true"
            />
            Aspiring
          </span>
        </div>
      </div>
    </div>
  );
}
