"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

function accentWithAlpha(alpha: number) {
  try {
    const accent = getComputedStyle(document.documentElement).getPropertyValue(
      "--accent",
    );
    const value = accent.trim();
    if (!value) return `rgba(99, 102, 241, ${alpha})`;
    return `${value.replace(/\)$/, "")} / ${alpha})`;
  } catch {
    return `rgba(99, 102, 241, ${alpha})`;
  }
}

export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c = canvas;
    const g = ctx;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let running = true;
    const targetCount = isMobile ? 26 : 62;
    const linkDistance = isMobile ? 110 : 140;

    function resize() {
      const rect = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      nodes = Array.from({ length: targetCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
    }

    function draw() {
      g.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        a.x += a.vx;
        a.y += a.vy;

        if (a.x < -20) a.x = width + 20;
        if (a.x > width + 20) a.x = -20;
        if (a.y < -20) a.y = height + 20;
        if (a.y > height + 20) a.y = -20;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            g.strokeStyle = accentWithAlpha(
              (1 - dist / linkDistance) * 0.12,
            );
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }

        g.fillStyle = accentWithAlpha(0.35);
        g.beginPath();
        g.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        g.fill();

        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 150 && !reduceMotion) {
          g.strokeStyle = accentWithAlpha((1 - md / 150) * 0.5);
          g.lineWidth = 1;
          g.beginPath();
          g.moveTo(a.x, a.y);
          g.lineTo(mouse.x, mouse.y);
          g.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      raf = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "200px" },
    );
    observer.observe(c);

    const onPointer = (e: PointerEvent) => {
      const rect = c.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onScroll = () => {
      c.style.transform = `translateY(${window.scrollY * 0.08}px)`;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduceMotion) {
      draw(); // single static frame, no loop
      running = false;
    } else {
      start();
    }

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
      aria-hidden="true"
    />
  );
}
