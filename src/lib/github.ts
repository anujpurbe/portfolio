import type {
  ContributionWeek,
  GitHubRepo,
  GitHubUser,
} from "@/lib/types";

const GH_API = "https://api.github.com";

type GitHubUserResponse = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  created_at: string;
};

type GitHubRepoResponse = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
};

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: {
            contributionDays?: {
              date: string;
              contributionCount: number;
              contributionLevel: ContributionLevel;
            }[];
          }[];
        };
      };
    };
  };
  errors?: { message: string }[];
};

const levelMap: Record<ContributionLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const graphqlQuery = `
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`;

function isGhResponse(value: unknown): value is GitHubUserResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "login" in value &&
    "public_repos" in value
  );
}

function isRepoResponse(value: unknown): value is GitHubRepoResponse[] {
  return Array.isArray(value);
}

export async function getGitHubUser(
  username: string,
): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GH_API}/users/${username}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "anujpurbe-portfolio",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (!isGhResponse(json)) return null;
    return {
      login: json.login,
      name: json.name,
      avatarUrl: json.avatar_url,
      bio: json.bio,
      htmlUrl: json.html_url,
      publicRepos: json.public_repos,
      followers: json.followers,
      createdAt: json.created_at,
    };
  } catch {
    return null;
  }
}

export async function getGitHubStars(
  username: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `${GH_API}/users/${username}/repos?sort=created&per_page=100&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "anujpurbe-portfolio",
        },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (!isRepoResponse(json)) return null;
    return json.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  } catch {
    return null;
  }
}

export async function getGitHubRepos(
  username: string,
): Promise<GitHubRepo[] | null> {
  try {
    const res = await fetch(
      `${GH_API}/users/${username}/repos?sort=updated&per_page=4&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "anujpurbe-portfolio",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (!isRepoResponse(json)) return null;
    return json.map((repo) => ({
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    }));
  } catch {
    return null;
  }
}

export async function getContributions(
  username: string,
  token?: string,
): Promise<ContributionWeek[] | null> {
  if (!token) return null;
  try {
    const now = new Date();
    const to = now.toISOString();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 364)
      .toISOString();
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { login: username, from, to },
      }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const data = json as GraphQLResponse;
    if (!data.data?.user?.contributionsCollection?.contributionCalendar?.weeks)
      return null;
    return data.data.user.contributionsCollection.contributionCalendar.weeks.map(
      (week) => ({
        days: (week.contributionDays ?? []).map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: levelMap[day.contributionLevel] ?? 0,
        })),
      }),
    );
  } catch {
    return null;
  }
}
