import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Code2,
  Folder,
  Users,
} from "lucide-react";
import { site } from "@/data/site";
import {
  getContributions,
  getGitHubRepos,
  getGitHubUser,
} from "@/lib/github";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ContributionHeatmap } from "@/components/github/contribution-heatmap";

function formatYear(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export async function GithubActivity() {
  const [user, repos, weeks] = await Promise.all([
    getGitHubUser(site.githubUsername),
    getGitHubRepos(site.githubUsername),
    getContributions(site.githubUsername, process.env.GITHUB_TOKEN),
  ]);

  return (
    <Section
      id="github"
      eyebrow="Coding activity"
      title="Developer data"
      description="Live from the GitHub API. If data can't be fetched, this section says so honestly instead of showing stale numbers."
    >
      {!user ? (
        <Reveal>
          <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-semibold">
                <Activity className="size-4 text-accent" />
                Data unavailable
              </h3>
              <p className="mt-1 text-sm text-muted">
                The GitHub API couldn&apos;t be reached right now.
              </p>
            </div>
            <a
              href={site.socials.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm font-medium"
            >
              View profile
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-6">
          <Reveal>
            <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <Image
                src={user.avatarUrl}
                alt={`${user.login} avatar`}
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-full border border-border"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-semibold">
                    {user.name ?? user.login}
                  </h3>
                  <a
                    href={user.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring muted-link font-mono text-sm"
                  >
                    @{user.login}
                    <ArrowUpRight className="ml-0.5 inline size-3.5" />
                  </a>
                </div>
                {user.bio && (
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {user.bio}
                  </p>
                )}
              </div>
              <dl className="grid shrink-0 grid-cols-3 gap-6 text-center sm:gap-8">
                <div>
                  <dt className="flex items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-wider text-subtle">
                    <Folder className="size-3" /> Repos
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {user.publicRepos}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-wider text-subtle">
                    <Users className="size-3" /> Followers
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {user.followers}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-wider text-subtle">
                    <CalendarDays className="size-3" /> Since
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {formatYear(user.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal>
            <div className="card p-6">
              {weeks && weeks.length > 0 ? (
                <ContributionHeatmap weeks={weeks} />
              ) : (
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">Contribution heatmap</h3>
                    <p className="mt-1 text-sm text-muted">
                      The heatmap needs a GitHub token to fetch —{" "}
                      <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                        GITHUB_TOKEN
                      </code>{" "}
                      isn&apos;t set on this deployment.
                    </p>
                  </div>
                  <a
                    href={user.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm font-medium"
                  >
                    View profile
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              )}
            </div>
          </Reveal>

          {repos && repos.length > 0 && (
            <Reveal>
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
                  <Code2 className="size-3.5" /> Recently updated
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {repos.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card focus-ring flex items-start gap-3 p-4 transition-colors hover:border-accent/50"
                    >
                      <Folder className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-sm font-medium">
                          {repo.name}
                        </span>
                        {repo.description && (
                          <span className="mt-1 line-clamp-2 block text-sm leading-5 text-muted">
                            {repo.description}
                          </span>
                        )}
                        <span className="mt-2 block font-mono text-xs text-subtle">
                          {repo.language ?? "—"} · updated{" "}
                          {formatYear(repo.updatedAt)}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      )}
    </Section>
  );
}
