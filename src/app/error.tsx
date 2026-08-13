"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-32 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-accent-soft text-accent">
        <AlertTriangle className="size-8" />
      </span>
      <p className="mt-8 font-mono text-sm uppercase tracking-widest text-subtle">
        Something went wrong
      </p>
      <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        This section hit an error
      </h1>
      <p className="mt-4 max-w-md text-muted">
        An unexpected error interrupted the page. Try again — it usually
        clears itself.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-subtle">
          Reference: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="focus-ring mt-8 inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        <RotateCcw className="size-4" />
        Try again
      </button>
    </section>
  );
}
