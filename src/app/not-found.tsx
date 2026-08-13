import Link from "next/link";
import { ArrowLeft, Compass, FileQuestion } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-32 text-center">
      <Reveal>
        <div className="flex flex-col items-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-accent-soft text-accent">
            <FileQuestion className="size-8" />
          </span>
          <p className="mt-8 font-mono text-sm uppercase tracking-widest text-subtle">
            Error 404
          </p>
          <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            This page doesn&apos;t exist
          </h1>
          <p className="mt-4 max-w-md text-muted">
            The link may be broken, or the page may have moved. Either way,
            the right answer is here somewhere.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="size-4" />
              Back home
            </Link>
            <Link
              href="/projects"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground"
            >
              <Compass className="size-4" />
              View projects
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
