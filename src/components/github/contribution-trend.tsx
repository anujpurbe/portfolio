"use client";

import type { ContributionWeek } from "@/lib/types";

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
    "en-US",
    { month: "short" },
  );
}

export function ContributionTrend({
  weeks,
}: {
  weeks: ContributionWeek[];
}) {
  const totals = new Map<string, number>();
  for (const week of weeks) {
    for (const day of week.days) {
      if (day.count === 0) continue;
      const key = day.date.slice(0, 7);
      totals.set(key, (totals.get(key) ?? 0) + day.count);
    }
  }

  const data = [...totals.entries()];
  if (data.length === 0) return null;

  const max = Math.max(...data.map(([, total]) => total));
  const total = data.reduce((sum, [, value]) => sum + value, 0);

  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h4 className="text-xs uppercase tracking-widest text-subtle">
          Monthly trend
        </h4>
        <span className="font-mono text-xs text-subtle">
          {total} total
        </span>
      </div>
      <div
        className="grid grid-flow-col grid-cols-[repeat(var(--cols),minmax(0,1fr))] items-end gap-1.5"
        style={{ "--cols": data.length } as React.CSSProperties}
        role="img"
        aria-label={`Contribution trend: ${data
          .map(([month, count]) => `${monthLabel(month)}: ${count}`)
          .join(", ")}`}
      >
        {data.map(([key, value]) => (
          <div
            key={key}
            className="group/bar flex flex-col items-center gap-1.5"
          >
            <span className="font-mono text-[10px] text-subtle opacity-0 transition-opacity group-hover/bar:opacity-100">
              {value}
            </span>
            <div className="flex h-20 w-full items-end rounded-md bg-surface-2">
              <div
                className="w-full rounded-md bg-accent/70 transition-colors group-hover/bar:bg-accent"
                style={{
                  height: `${Math.max((value / max) * 100, 4)}%`,
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-subtle">
              {monthLabel(key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
