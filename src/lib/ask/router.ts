import type { AskHistoryMessage, AskResponse } from "./types";
import { answerQuestion } from "./local";
import { getToolDefinitions, executeTool } from "./tools";

export type RouteType =
  | "calculator"
  | "datetime"
  | "weather"
  | "portfolio"
  | "personal"
  | "greeting"
  | "gemini";

export interface RouteResult {
  type: RouteType;
  payload: unknown;
  response?: AskResponse;
}

const CALCULATOR_PATTERNS = [
  /^\s*\d+\s*[\+\-\*/]\s*\d+\s*$/,
  /^\s*calculate\s+/i,
  /^\s*what is\s+\d+\s*[\+\-\*/]\s*\d+/i,
  /^\s*\d+\s*\^\s*\d+\s*$/,
];

const DATETIME_PATTERNS = [
  /\b(time|date|day|today|now)\b/i,
  /\bwhat (time|day|date) is it\b/i,
  /\bcurrent (time|date)\b/i,
];

const WEATHER_PATTERNS = [
  /\bweather\b/i,
  /\btemperature\b/i,
  /\bclimate\b/i,
];

const GREETING_PATTERNS = [
  /^\s*(hi|hello|hey|yo|sup|good (morning|afternoon|evening)|howdy|hiya)\s*[!.?]*$/i,
  /^\s*(who are you|what are you|introduce yourself|your name|are you anuj)\s*[!.?]*$/i,
  /^\s*(help|what can you do|how can you help|what do you do)\s*[!.?]*$/i,
  /^\s*(how are you|how's it going|what's up)\s*[!.?]*$/i,
  /^\s*(thanks|thank you|thx|appreciate)\s*[!.?]*$/i,
  /^\s*(bye|goodbye|see you|take care)\s*[!.?]*$/i,
];

const PORTFOLIO_KEYWORDS = [
  "project", "projects", "build", "built", "made", "created", "developed", "portfolio", "work",
  "skill", "skills", "technolog", "technologies", "technology", "stack", "language", "languages", "tool", "tools",
  "certificate", "certificates", "certification", "certifications", "cert", "certs", "credential", "credentials",
  "education", "academic", "university", "college", "school", "degree", "semester", "sem", "gpa", "course", "courses", "study",
  "contact", "email", "reach", "get in touch", "message",
  "resume", "cv", "curriculum",
  "github",
  "intern", "internship", "hire", "hiring", "recruit", "open to", "full time", "job",
  "learn", "learning", "currently", "now", "latest", "working on", "building", "up to", "exploring",
  "achievement", "achievements", "award", "awards", "milestone", "rank", "ranked",
  "about", "who is", "who are", "tell me about", "intro", "introduction", "profile", "background", "summary",
  "stats", "statistics", "stat", "numbers", "counts", "metrics",
  "experience", "experiences",
];

const PERSONAL_KEYWORDS = [
  "age", "old", "name", "university", "college", "experience", "background",
  "where.*from", "where.*live", "hometown", "born",
];

function norm(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesPatterns(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function hasKeywords(text: string, keywords: string[]): boolean {
  const normalized = norm(text);
  return keywords.some((kw) => normalized.includes(kw));
}

export function classifyIntent(message: string, history: AskHistoryMessage[]): RouteResult {
  const normalized = norm(message);
  const lower = message.toLowerCase();

  // Calculator - highest priority for exact math
  if (matchesPatterns(message, CALCULATOR_PATTERNS)) {
    // Extract expression from "calculate 2+2" or "what is 2+2"
    let expr = message
      .replace(/^\s*calculate\s+/i, "")
      .replace(/^\s*what is\s+/i, "")
      .replace(/[!?.]+$/, "")
      .trim();
    return { type: "calculator", payload: { expression: expr } };
  }

  // Date/Time
  if (matchesPatterns(message, DATETIME_PATTERNS)) {
    return { type: "datetime", payload: { timezone: "Asia/Kolkata" } };
  }

  // Weather
  if (matchesPatterns(message, WEATHER_PATTERNS)) {
    // Extract location if present
    const locationMatch = message.match(/(?:in|for|at)\s+([a-zA-Z\s]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : "current location";
    return { type: "weather", payload: { location } };
  }

  // Greeting / Identity / Help
  if (matchesPatterns(message, GREETING_PATTERNS)) {
    return { type: "greeting", payload: { message: lower } };
  }

  // Portfolio questions
  if (hasKeywords(message, PORTFOLIO_KEYWORDS)) {
    return { type: "portfolio", payload: { query: message } };
  }

  // Personal info
  if (hasKeywords(message, PERSONAL_KEYWORDS)) {
    return { type: "personal", payload: { query: message } };
  }

  // Default to Gemini for complex reasoning
  return { type: "gemini", payload: { query: message } };
}

export async function executeRoute(
  route: RouteResult,
  history: AskHistoryMessage[]
): Promise<AskResponse | null> {
  switch (route.type) {
    case "calculator": {
      const { expression } = route.payload as { expression: string };
      const result = await executeTool("calculate", { expression });
      if (result.success) {
        // Extract just the result value (e.g., "2+2 = 4" -> "4")
        const match = result.output.match(/=\s*(.+)$/);
        const answer = match ? match[1].trim() : result.output;
        return { answer, source: "tool" };
      }
      return { answer: "I couldn't calculate that. Please try the expression again.", source: "tool" };
    }

    case "datetime": {
      const { timezone } = route.payload as { timezone?: string };
      const result = await executeTool("get_current_datetime", { timezone });
      if (result.success) {
        return { answer: result.output, source: "tool" };
      }
      return { answer: "I couldn't get the current time.", source: "tool" };
    }

    case "weather": {
      const { location } = route.payload as { location: string };
      const result = await executeTool("get_weather", { location });
      if (result.success) {
        return { answer: result.output, source: "tool" };
      }
      return { answer: "I couldn't get the weather for that location.", source: "tool" };
    }

    case "greeting": {
      const { message } = route.payload as { message: string };
      const local = answerQuestion(message, history);
      return { ...local, source: "local" };
    }

    case "portfolio": {
      const { query } = route.payload as { query: string };
      const local = answerQuestion(query, history);
      return { ...local, source: "local" };
    }

    case "personal": {
      const { query } = route.payload as { query: string };
      const local = answerQuestion(query, history);
      // If local engine doesn't know, we'll fall back to Gemini
      if (local.answer.includes("don't have that information")) {
        return null; // Signal to use Gemini
      }
      return { ...local, source: "local" };
    }

    case "gemini":
    default:
      return null; // Signal to use Gemini
  }
}