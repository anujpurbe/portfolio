"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  X,
} from "lucide-react";
import { academicJourney } from "@/data/education";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";
import type { AcademicSemester, AcademicSubject } from "@/lib/types";

type StatusStyle = {
  label: string;
  icon: typeof CheckCircle2;
  className: string;
};

function statusStyle(status: AcademicSemester["status"]): StatusStyle {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle2,
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    case "in-progress":
      return {
        label: "In progress",
        icon: Clock,
        className: "bg-amber-400/10 text-amber-600 dark:text-amber-400",
      };
    default:
      return {
        label: "Upcoming",
        icon: Clock,
        className: "bg-surface text-subtle",
      };
  }
}

function creditsLine(semester: AcademicSemester) {
  return semester.sgpa
    ? `SGPA ${semester.sgpa} · ${semester.credits ?? ""} Credits`
    : `${semester.credits ?? ""} Credits · SGPA —`;
}

function creditText(subject: AcademicSubject) {
  return typeof subject.credits === "number"
    ? `${subject.credits} Credit${subject.credits === 1 ? "" : "s"}`
    : (subject.credits ?? "—");
}

function SemesterCard({
  semester,
  index,
  onView,
}: {
  semester: AcademicSemester;
  index: number;
  onView: () => void;
}) {
  const { label, icon: Icon, className } = statusStyle(semester.status);

  return (
    <Reveal delay={index * 0.04}>
      <article className="card flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-semibold">{semester.name}</h3>
            <p className="mt-0.5 font-mono text-xs text-subtle">
              {semester.period}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
              className,
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {label}
          </span>
        </div>

        <p className="mt-3 font-mono text-xs text-subtle">
          {creditsLine(semester)}
        </p>

        {semester.note && (
          <p className="mt-3 text-sm leading-6 text-muted">
            {semester.note}
          </p>
        )}

        <div className="mt-5 flex flex-1 items-end">
          <button
            type="button"
            onClick={onView}
            aria-haspopup="dialog"
            className="focus-ring btn-lift flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            View Coursework
          </button>
        </div>
      </article>
    </Reveal>
  );
}

function SubjectCard({ subject }: { subject: AcademicSubject }) {
  return (
    <li className="flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-surface/40 px-4 py-3 transition-colors hover:border-accent/40 hover:bg-surface/70">
      <span className="text-sm leading-snug font-medium text-foreground">
        {subject.name}
      </span>
      {subject.code && (
        <span className="font-mono text-[11px] text-subtle">
          {subject.code}
        </span>
      )}
      <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
        {creditText(subject)}
      </span>
    </li>
  );
}

function CourseworkModal({
  semester,
  onClose,
}: {
  semester: AcademicSemester;
  onClose: () => void;
}) {
  const { label, icon: Icon } = statusStyle(semester.status);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `coursework-title-${semester.id}`;
  const descId = `coursework-desc-${semester.id}`;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="glow-accent relative z-10 flex max-h-[85vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-border bg-card"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight sm:text-xl"
            >
              {semester.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-subtle">
              {semester.period} · {label.toUpperCase()}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close coursework"
            className="focus-ring btn-lift grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface/60 text-muted transition-colors hover:border-accent/50 hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          <p className="flex items-center gap-1.5 font-mono text-xs text-subtle">
            <Icon className="size-3.5" aria-hidden="true" />
            {creditsLine(semester)}
          </p>
          {semester.note && (
            <p
              id={descId}
              className="mt-3 max-w-2xl text-sm leading-6 text-muted"
            >
              {semester.note}
            </p>
          )}

          <h3 className="mt-6 mb-3 font-mono text-xs uppercase tracking-widest text-subtle">
            Coursework
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {semester.subjects.map((subject, i) => (
              <SubjectCard
                key={`${semester.id}-${subject.code ?? subject.name}-${i}`}
                subject={subject}
              />
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
            <p className="font-mono text-xs text-subtle">
              {semester.subjects.length} subject
              {semester.subjects.length === 1 ? "" : "s"}
            </p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {semester.credits ?? ""} Total Credits
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AcademicSummary() {
  const completed = academicJourney.semesters.filter(
    (s) => s.status === "completed",
  );
  return (
    <div className="card mt-10 p-6 sm:p-8">
      <h3 className="flex items-center gap-2 font-semibold">
        <GraduationCap className="size-4 text-accent" aria-hidden="true" />
        Academic summary
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {completed.map((semester) => (
          <div key={semester.id}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
              {semester.name} SGPA
            </p>
            <p className="mt-1 text-lg font-semibold">
              {semester.sgpa ?? "—"}
              <span className="ml-1 font-mono text-xs font-normal text-subtle">
                {semester.sgpa ? "" : "pending"}
              </span>
            </p>
          </div>
        ))}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
            Total program credits
          </p>
          <p className="mt-1 text-lg font-semibold">
            {academicJourney.programCredits}
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
            Program duration
          </p>
          <p className="mt-1 text-lg font-semibold">
            {academicJourney.totalSemesters} semesters
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-subtle">
        Semester III is in progress; its SGPA is pending the official result.
        Cumulative CGPA is only shown once the official value is available.
      </p>
    </div>
  );
}

export function AcademicJourney() {
  const [selected, setSelected] = useState<AcademicSemester | null>(null);
  const [mounted, setMounted] = useState(false);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (selected) {
      if (!openRef.current) {
        prevFocusRef.current = document.activeElement as HTMLElement | null;
        openRef.current = true;
      }
      document.body.style.overflow = "hidden";
    } else {
      openRef.current = false;
      document.body.style.overflow = "";
      prevFocusRef.current?.focus();
      prevFocusRef.current = null;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const pct = Math.round(
    (academicJourney.semestersCompleted / academicJourney.totalSemesters) * 100,
  );

  return (
    <Section
      id="academic"
      eyebrow="Academics"
      title="Academic journey"
      description="Where I've been and where I'm headed — from first-year foundations to the full B.Tech program."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Reveal>
          <div className="card h-full p-6">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              <CountUp value={academicJourney.creditsCompleted} className="tabular-nums" />
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-subtle">
              Credits completed
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card flex h-full flex-col justify-between p-6">
            <div>
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                <CountUp value={academicJourney.semestersCompleted} className="tabular-nums" />
                <span className="text-muted">/{academicJourney.totalSemesters}</span>
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-subtle">
                Semesters done
              </p>
            </div>
            <div className="mt-4">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-subtle">
                {pct}% of the program
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="card h-full p-6">
            <p className="text-2xl font-semibold tracking-tight">
              {academicJourney.institution}
            </p>
            <p className="mt-1 text-sm text-muted">
              {academicJourney.degree} · {academicJourney.campus}
            </p>
            <p className="mt-4 text-sm leading-6 text-subtle">
              Deepening foundations in data structures, algorithms, databases,
              and the systems that run production software.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {academicJourney.domains.map((domain) => (
            <span
              key={domain.name}
              title={domain.items.join(" · ")}
              className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted"
            >
              {domain.name}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {academicJourney.semesters.map((semester, i) => (
          <SemesterCard
            key={semester.id}
            semester={semester}
            index={i}
            onView={() => setSelected(semester)}
          />
        ))}
      </div>

      <Reveal delay={0.1}>
        <AcademicSummary />
      </Reveal>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <CourseworkModal
                key={selected.id}
                semester={selected}
                onClose={() => setSelected(null)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </Section>
  );
}
