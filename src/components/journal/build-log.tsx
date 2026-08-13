import { GitCommitHorizontal } from "lucide-react";
import { buildLog, commitUrl, type BuildLogCategory } from "@/data/build-log";
import { cn } from "@/lib/utils";

const categoryStyles: Record<BuildLogCategory, string> = {
  Init: "bg-surface text-subtle border-border",
  Architecture: "text-sky-300 bg-sky-400/10 border-sky-400/20",
  UI: "text-violet-300 bg-violet-400/10 border-violet-400/20",
  Features: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  Data: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  Polish: "text-cyan-300 bg-cyan-400/10 border-cyan-400/20",
  Assets: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  Ops: "text-teal-300 bg-teal-400/10 border-teal-400/20",
  Deploy: "text-accent bg-accent-soft border-accent/30",
};

function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BuildLog() {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[15px] w-px bg-border"
      />
      <ol className="space-y-5">
        {buildLog.map((entry) => (
          <li key={`${entry.hash ?? "deploy"}-${entry.title}`}>
            <div className="relative flex gap-4">
              <span className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-accent shadow-card">
                <GitCommitHorizontal className="size-3.5" />
              </span>
              <div className="card min-w-0 flex-1 p-5">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <span
                    className={cn(
                      "inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                      categoryStyles[entry.category],
                    )}
                  >
                    {entry.category}
                  </span>
                  <span className="font-mono text-xs text-subtle">
                    {formatDate(entry.date)}
                  </span>
                </div>
                <h4 className="mt-2 font-semibold leading-6">
                  {entry.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {entry.note}
                </p>
                {entry.hash && (
                  <a
                    href={commitUrl(entry.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring muted-link mt-2 inline-block font-mono text-xs"
                  >
                    {entry.hash}
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
