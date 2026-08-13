"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Move3d } from "lucide-react";
import type { TechItem } from "@/data/skills";
import { cn } from "@/lib/utils";

export function TechRing({
  items,
  selected,
  onSelect,
}: {
  items: TechItem[];
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const dragState = useRef({ active: false, lastX: 0, moved: false });
  const didDrag = useRef(false);

  const radius = 128;
  const itemCount = items.length;

  function onPointerDown(e: PointerEvent) {
    dragState.current.active = true;
    dragState.current.lastX = e.clientX;
    dragState.current.moved = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.lastX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    if (dragState.current.moved) didDrag.current = true;
    dragState.current.lastX = e.clientX;
    setRotation((r) => r + dx * 0.45);
  }

  function onPointerUp(e: PointerEvent) {
    dragState.current.active = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  }

  function select(name: string) {
    if (didDrag.current) return;
    onSelect(selected === name ? null : name);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative grid h-72 w-72 touch-none select-none place-items-center sm:h-80 sm:w-80"
        aria-label="Technology stack — drag to rotate, tap a technology to inspect it"
      >
        <div
          className="absolute inset-0 rounded-full border border-dashed border-border/70"
          aria-hidden="true"
        />
        <div
          className="absolute inset-10 rounded-full border border-border/40"
          aria-hidden="true"
        />
        <span className="absolute inset-24 rounded-full bg-accent/10 blur-2xl" aria-hidden="true" />

        <div
          className="absolute inset-0 transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {items.map((item, i) => {
            const angle = (i / itemCount) * Math.PI * 2;
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
                  "focus-ring absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border px-2.5 py-2 backdrop-blur-sm transition-all duration-200",
                  isSelected
                    ? "scale-110 border-accent bg-accent-soft text-foreground shadow-glow"
                    : "border-border bg-card text-muted hover:scale-105 hover:border-accent/50 hover:text-foreground",
                )}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-rotation}deg)`,
                }}
              >
                <span className="font-mono text-[11px] font-bold tracking-wide text-accent">
                  {item.short}
                </span>
                <span className="max-w-16 truncate text-[10px] font-medium">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative z-10 grid size-24 place-items-center rounded-full border border-border bg-background/80 text-center shadow-card backdrop-blur-sm">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-accent">
              CORE
            </p>
            <p className="text-[10px] text-subtle">engineering</p>
          </div>
        </div>
      </div>

      <p className="flex items-center gap-2 font-mono text-xs text-subtle">
        <Move3d className="size-3.5" />
        Drag to spin · Hover to highlight · Tap to select
      </p>
    </div>
  );
}
