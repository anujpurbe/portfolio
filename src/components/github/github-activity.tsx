import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Code2,
  Folder,
  GitFork,
  Star,
  Users,
} from "lucide-react";
import { site } from "@/data/site";
import { coding } from "@/data/coding";
import {
  getContributions,
  getGitHubLanguages,
  getGitHubRepos,
  getGitHubStars,
  getGitHubUser,
} from "@/lib/github";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ContributionHeatmap } from "@/components/github/contribution-heatmap";
import { ContributionTrend } from "@/components/github/contribution-trend";

function formatYear(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function UnavailableCard() {
  return (
    <Reveal>
      <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <Activity className="size-4 text-accent" />
            GitHub activity unavailable
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
          View GitHub
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </Reveal>
  );
}

export async function GithubActivity() {
  const username =
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? site.githubUsername;
  const [user, repos, weeks, stars, languages] = await Promise.all([
    getGitHubUser(username),
    getGitHubRepos(username),
    getContributions(username, process.env.GITHUB_TOKEN),
    getGitHubStars(username),
    getGitHubLanguages(username),
  ]);

  return (
    <Section
      id="github"
      eyebrow="Coding activity"
      title="Developer data"
      description="Live from the GitHub API. If data can't be fetched, this section says so honestly instead of showing stale numbers."
    >
      {!user ? (
        <UnavailableCard />
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
              <dl className="grid shrink-0 grid-cols-4 gap-5 text-center sm:gap-8">
                <div>
                  <dt className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-subtle">
                    <Folder className="size-3" /> Repos
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {user.publicRepos}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-subtle">
                    <Star className="size-3" /> Stars
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {stars ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-subtle">
                    <Users className="size-3" /> Followers
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {user.followers}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-subtle">
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
                <>
                  <ContributionHeatmap weeks={weeks} />
                  <ContributionTrend weeks={weeks} />
                </>
              ) : (
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Contribution heatmap
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Contribution history isn&apos;t available for this
                      deployment right now.
                    </p>
                  </div>
                  <a
                    href={user.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm font-medium"
                  >
                    View GitHub
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
                <GitFork className="size-3.5" /> Featured repositories
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {coding.featuredRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card-hover focus-ring flex items-start gap-3 p-4"
                  >
                    <Star className="mt-0.5 size-4 shrink-0 text-accent" />
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
                        {repo.language ?? "—"}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {languages && languages.length > 0 && (
            <Reveal>
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
                  <BarChart3 className="size-3.5" /> Languages across repos
                </h3>
                <div className="card flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
                  {languages.map(({ language, count }) => (
                    <span
                      key={language}
                      className="inline-flex items-center gap-2 text-sm"
                    >
                      <span className="font-mono text-subtle">{language}</span>
                      <span className="font-mono text-xs text-subtle">
                        ×{count}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

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
                      className="card card-hover focus-ring flex items-start gap-3 p-4"
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
