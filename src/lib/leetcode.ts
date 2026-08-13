import type { LeetCodeStats } from "@/lib/types";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

const query = `
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}`;

type DifficultyStat = { difficulty: string; count: number };

type LeetCodeResponse = {
  data?: {
    matchedUser?: {
      username: string;
      profile?: { ranking?: number | null };
      submitStatsGlobal?: { acSubmissionNum?: DifficultyStat[] };
    };
  };
  errors?: unknown;
};

function countFor(
  stats: DifficultyStat[] | undefined,
  difficulty: string,
): number {
  const entry = stats?.find((s) => s.difficulty === difficulty);
  return entry?.count ?? 0;
}

export async function getLeetCodeStats(
  username: string,
): Promise<LeetCodeStats | null> {
  if (!username) return null;
  try {
    const res = await fetch(LEETCODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "anujpurbe-portfolio",
      },
      body: JSON.stringify({
        query,
        variables: { username },
        operationName: "userPublicProfile",
      }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const data = json as LeetCodeResponse;
    const user = data.data?.matchedUser;
    if (!user) return null;

    const stats = user.submitStatsGlobal?.acSubmissionNum ?? [];
    const totalQuestions = countFor(
      stats.filter((s) => s.difficulty === "All"),
      "All",
    );
    return {
      username: user.username,
      totalSolved: totalQuestions,
      easySolved: countFor(stats, "Easy"),
      mediumSolved: countFor(stats, "Medium"),
      hardSolved: countFor(stats, "Hard"),
      totalQuestions,
      ranking: user.profile?.ranking ?? undefined,
    };
  } catch {
    return null;
  }
}
