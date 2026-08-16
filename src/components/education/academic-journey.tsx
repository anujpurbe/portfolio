"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Clock, GraduationCap } from "lucide-react";
import { academicJourney } from "@/data/education";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

function SemesterCard({
  semester,
  index,
}: {
  semester: (typeof academicJourney.semesters)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const completed = semester.status === "completed";
  const inProgress = semester.status === "in-progress";
  const hasSubjects = semester.subjects.length > 0;

  return (
    <Reveal delay={index * 0.04}>
      <div className="card flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{semester.name}</h3>
            </div>
            <p className="mt-0.5 font-mono text-xs text-subtle">
              {semester.period}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
              completed
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : inProgress
                  ? "bg-amber-400/10 text-amber-600 dark:text-amber-400"
                  : "bg-surface text-subtle",
            )}
          >
            {completed ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <Clock className="size-3" />
            )}
            {completed ? "Completed" : inProgress ? "In progress" : "Upcoming"}
          </span>
        </div>

        <p className="mt-3 font-mono text-xs text-subtle">
          {semester.sgpa
            ? `SGPA ${semester.sgpa} · ${semester.credits ?? ""} Credits`
            : `${semester.credits ?? ""} Credits · SGPA —`}
        </p>

        {semester.note && (
          <p className="mt-3 text-sm leading-6 text-muted">{semester.note}</p>
        )}

        {hasSubjects && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="focus-ring flex w-full items-center justify-between rounded-lg bg-surface/60 px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              Coursework
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </button>
            {open && (
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {semester.subjects.map((subject, i) => (
                  <li
                    key={`${subject.name}-${i}`}
                    className="flex flex-col gap-0.5 rounded-md border border-border bg-surface/40 px-3 py-2"
                  >
                    <span className="text-sm text-foreground">
                      {subject.name}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-subtle">
                      {subject.code && <span>{subject.code}</span>}
                      {subject.credits != null && (
                        <span>{subject.credits} cr</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Reveal>
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
          <SemesterCard key={semester.id} semester={semester} index={i} />
        ))}
      </div>

      <Reveal delay={0.1}>
        <AcademicSummary />
      </Reveal>
    </Section>
  );
}
