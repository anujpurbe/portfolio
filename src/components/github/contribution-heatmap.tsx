"use client";

import type { ContributionWeek } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ContributionHeatmap({
  weeks,
}: {
  weeks: ContributionWeek[];
}) {
  const flat = weeks.flatMap((w) => w.days);
  const total = flat.reduce((sum, d) => sum + d.count, 0);
  const activeDays = flat.filter((d) => d.count > 0).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">{total}</span>{" "}
          contributions in the last 365 days
        </p>
        <p className="font-mono text-xs text-subtle">
          {activeDays} active days
        </p>
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
          role="img"
          aria-label={`GitHub contribution graph: ${total} contributions in the last year`}
        >
          {weeks.map((week, wi) =>
            week.days.map((day, di) => (
              <span
                key={`${week.days[0]?.date ?? wi}-${di}`}
                className={cn(
                  "size-[10px] rounded-[2px]",
                  day.level === 0
                    ? "bg-heat-0"
                    : day.level === 1
                      ? "bg-heat-1"
                      : day.level === 2
                        ? "bg-heat-2"
                        : day.level === 3
                          ? "bg-heat-3"
                          : "bg-heat-4",
                )}
                title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
