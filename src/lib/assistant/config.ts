export const INTENT = {
  PORTFOLIO: "portfolio",
  CALCULATOR: "calculator",
  DATETIME: "datetime",
  WEATHER: "weather",
  CODING: "coding",
  UNSUPPORTED: "unsupported",
} as const;

export type Intent = (typeof INTENT)[keyof typeof INTENT];

export const MAX_MESSAGE = 400;
export const MAX_HISTORY_MESSAGES = 6;
export const MAX_HISTORY_MESSAGE_LENGTH = 400;

export const RATE_LIMIT_PER_MINUTE = 5;
export const RATE_LIMIT_WINDOW_MS = 60_000;

export const DAILY_USER_AI_LIMIT = 20;
export const DAILY_USER_WINDOW_MS = 24 * 60 * 60 * 1000;

export const GLOBAL_DAILY_AI_BUDGET = 300;

export const MAX_TOOL_ITERATIONS = 2;
export const AI_MAX_TOKENS = 300;
export const AI_TIMEOUT_MS = 30_000;

export const SCROLL_TARGETS: Record<string, string> = {
  about: "about",
  stats: "stats",
  skills: "skills",
  projects: "projects",
  achievements: "achievements",
  education: "education",
  academic: "academic",
  certifications: "certifications",
  github: "github",
  leetcode: "leetcode",
  journal: "journal",
  comments: "comments",
  contact: "contact",
};

export const AI_UNAVAILABLE_NOTICE =
  "AI mode is temporarily unavailable, but I can still help you explore the portfolio.";