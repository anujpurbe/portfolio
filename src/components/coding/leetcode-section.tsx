import { ArrowUpRight, BarChart3, Flame, Trophy } from "lucide-react";
import { coding } from "@/data/coding";
import { getLeetCodeStats } from "@/lib/leetcode";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? "";
const leetcodeHref = username
  ? coding.leetcode.url(username)
  : "https://leetcode.com";

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface px-3 py-3">
      <span className="text-lg font-semibold tabular-nums">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
        {label}
      </span>
    </div>
  );
}

export async function LeetCodeSection() {
  const stats = username ? await getLeetCodeStats(username) : null;

  return (
    <Section
      id="leetcode"
      eyebrow="Coding performance"
      title="Competitive programming"
      description="Live where available. If a platform can't be reached, the site says so instead of inventing numbers."
    >
      <div className="card flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="flex items-center gap-2 font-semibold">
            <BarChart3 className="size-4 text-accent" />
            LeetCode
          </h3>
          <a
            href={leetcodeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm font-medium"
          >
            View LeetCode
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        {!stats ? (
          <div className="flex flex-col gap-2 py-2">
            <p className="text-sm leading-6 text-muted">
              LeetCode statistics unavailable right now.
            </p>
            <p className="text-xs text-subtle">
              Solved problems and ratings sync from the public profile when
              it&apos;s reachable.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="text-4xl font-bold tabular-nums tracking-tight">
                {stats.totalSolved}
              </p>
              <div>
                <p className="text-sm font-medium">Problems solved</p>
                <p className="text-xs text-subtle">
                  out of {stats.totalQuestions} available
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              <StatRow label="Easy" value={stats.easySolved} />
              <StatRow label="Medium" value={stats.mediumSolved} />
              <StatRow label="Hard" value={stats.hardSolved} />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4">
              {typeof stats.ranking === "number" && (
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Trophy className="size-3.5 text-accent" />
                  Ranking {stats.ranking.toLocaleString()}
                </p>
              )}
              {typeof stats.streak === "number" && (
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Flame className="size-3.5 text-orange-400" />
                  {stats.streak}-day streak
                </p>
              )}
              <p className="font-mono text-xs text-subtle">
                @{stats.username}
              </p>
            </div>
          </>
        )}
      </div>

      <Reveal delay={0.08}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-subtle">
            Profiles
          </span>
          <a
            href="https://github.com/anujpurbe"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring muted-link inline-flex items-center gap-1 rounded-md text-sm"
          >
            GitHub
            <ArrowUpRight className="size-3" />
          </a>
          <a
            href={leetcodeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring muted-link inline-flex items-center gap-1 rounded-md text-sm"
          >
            LeetCode
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
