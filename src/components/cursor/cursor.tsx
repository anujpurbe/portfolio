"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "default" | "link" | "project" | "drag";

const LABELS: Partial<Record<Mode, string>> = {
  project: "VIEW",
  drag: "DRAG",
};

const shapeClass: Record<Mode, string> = {
  default: "size-10 border-accent/50 bg-accent/[0.06]",
  link: "size-[3.75rem] border-accent bg-accent/10",
  project: "size-[4.5rem] border-accent bg-accent/15",
  drag: "size-[4.5rem] border-accent bg-accent/15",
};

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");

  useEffect(() => {
    const supportsPointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!supportsPointer || reduceMotion) return;

    document.documentElement.classList.add("custom-cursor-active");

    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        ring.x = e.clientX;
        ring.y = e.clientY;
      }
    }

    function resolveMode(e: MouseEvent) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cursorTarget = el?.closest<HTMLElement>("[data-cursor]");
      if (cursorTarget?.dataset.cursor) {
        setMode(cursorTarget.dataset.cursor as Mode);
        return;
      }
      if (
        el?.closest(
          "a, button, [role='button'], summary, input, textarea, select, label",
        )
      ) {
        setMode("link");
        return;
      }
      setMode("default");
    }

    function onOver(e: MouseEvent) {
      resolveMode(e);
    }

    function loop() {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  const showLabel = mode === "project" || mode === "drag";

  return (
    <div
      className="cursor-host pointer-events-none fixed inset-0 z-[200]"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="absolute -top-px -left-px size-2.5 rounded-full bg-accent shadow-glow"
        style={{ transform: "translate(-100px, -100px)" }}
      />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <span
          className={cn(
            "block rotate-45 rounded-[0.35rem] border transition-[width,height,border-color,background-color] duration-300",
            shapeClass[mode],
          )}
        />
        {showLabel && (
          <span className="absolute font-mono text-[10px] font-semibold tracking-widest text-accent">
            {LABELS[mode]}
          </span>
        )}
      </div>
    </div>
  );
}
