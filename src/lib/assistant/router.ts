import { INTENT, type Intent } from "./config";
import { answerQuestion, isFallbackResponse } from "./local";
import { executeTool } from "./tools";
import type { AssistantHistoryMessage, AssistantResponse } from "./types";

export interface RouteResult {
  type: Intent;
  payload: unknown;
  response?: AssistantResponse;
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

// Deterministic conversational intent — answered only by the local engine,
// never escalated to AI, so small talk never spends quota.
const CONVERSATIONAL_PATTERNS = [
  /^\s*(hi|hello|hey|yo|sup|good (morning|afternoon|evening)|howdy|hiya)\s*[!.?]*$/i,
  /^\s*(who are you|what are you|introduce yourself|your name|are you anuj)\s*[!.?]*$/i,
  /^\s*(help|what can you do|how can you help|what do you do|help me explore|where should i start|explore|guide me|recommend|suggest)\s*[!.?]*$/i,
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
  "instagram", "linkedin", "social", "socials", "handles", "follow",
  "resume", "cv", "curriculum",
  "github",
  "intern", "internship", "hire", "hiring", "recruit", "open to", "full time", "job",
  "learn", "learning", "currently", "now", "latest", "working on", "building", "up to", "exploring",
  "achievement", "achievements", "award", "awards", "milestone", "rank", "ranked",
  "about", "who is", "who are", "tell me about", "intro", "introduction", "profile", "background", "summary",
  "stats", "statistics", "stat", "numbers", "counts", "metrics",
  "experience", "experiences",
];

// General programming / coding questions — answered by the AI (quota-gated).
const CODING_PATTERNS = [
  /\bcode\b/i,
  /\bcoding\b/i,
  /\bprogram(ming|matically)?\b/i,
  /\bfunction\b/i,
  /\balgorithm(s)?\b/i,
  /\brecursion\b/i,
  /\bsyntax\b/i,
  /\bbug(s)?\b/i,
  /\bdebug(g(ing|ged)?)?\b/i,
  /\bcompile(r|ing|d)?\b/i,
  /\bcomplexity\b/i,
  /\bbig o\b/i,
  /\bdata structure(s)?\b/i,
  /\bsolve\b/i,
  /\bhow (do|to|would|should)\b/i,
  /\bexplain (how|why|the code)\b/i,
  /\bwrite (a |the |some )?(function|code|program|loop)/i,
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

export function isConversational(message: string): boolean {
  return matchesPatterns(message, CONVERSATIONAL_PATTERNS);
}

export function classifyIntent(message: string): RouteResult {
  const lower = message.toLowerCase();

  // Calculator — highest priority for exact math.
  if (matchesPatterns(message, CALCULATOR_PATTERNS)) {
    const expr = message
      .replace(/^\s*calculate\s+/i, "")
      .replace(/^\s*what is\s+/i, "")
      .replace(/[!?.]+$/, "")
      .trim();
    return { type: INTENT.CALCULATOR, payload: { expression: expr } };
  }

  // Date/Time.
  if (matchesPatterns(message, DATETIME_PATTERNS)) {
    return { type: INTENT.DATETIME, payload: { timezone: "Asia/Kolkata" } };
  }

  // Weather.
  if (matchesPatterns(message, WEATHER_PATTERNS)) {
    const locationMatch = message.match(/(?:in|for|at)\s+([a-zA-Z\s]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : "current location";
    return { type: INTENT.WEATHER, payload: { location } };
  }

  // Small talk / conversational — local only.
  if (isConversational(message)) {
    return { type: INTENT.PORTFOLIO, payload: { query: lower } };
  }

  // Portfolio questions.
  if (hasKeywords(message, PORTFOLIO_KEYWORDS)) {
    return { type: INTENT.PORTFOLIO, payload: { query: message } };
  }

  // General programming questions — AI eligible.
  if (matchesPatterns(message, CODING_PATTERNS)) {
    return { type: INTENT.CODING, payload: { query: message } };
  }

  // Out of scope — answered locally, never spends quota.
  return { type: INTENT.UNSUPPORTED, payload: { query: message } };
}

// Returns a deterministic response, or null to signal "escalate to AI".
export async function executeRoute(
  route: RouteResult,
  history: AssistantHistoryMessage[],
): Promise<AssistantResponse | null> {
  switch (route.type) {
    case INTENT.CALCULATOR: {
      const { expression } = route.payload as { expression: string };
      const result = await executeTool("calculate", { expression });
      if (result.success) {
        const match = result.output.match(/=\s*(.+)$/);
        const answer = match ? match[1].trim() : result.output;
        return { answer, source: "tool" };
      }
      return { answer: "I couldn't calculate that. Please try the expression again.", source: "tool" };
    }

    case INTENT.DATETIME: {
      const { timezone } = route.payload as { timezone?: string };
      const result = await executeTool("get_current_datetime", { timezone });
      if (result.success) {
        return { answer: result.output, source: "tool" };
      }
      return { answer: "I couldn't get the current time.", source: "tool" };
    }

    case INTENT.WEATHER: {
      const { location } = route.payload as { location: string };
      const result = await executeTool("get_weather", {
        location_name: location === "current location" ? undefined : location,
      });
      if (result.success) {
        return { answer: result.output, source: "tool" };
      }
      return { answer: "I couldn't get the weather for that location.", source: "tool" };
    }

    case INTENT.PORTFOLIO: {
      const { query } = route.payload as { query: string };
      const local = answerQuestion(query, history);
      if (isFallbackResponse(local) && !isConversational(query)) {
        // Real portfolio question the local engine can't answer — AI summarization
        // may be able to synthesize a verified answer from the knowledge.
        return null;
      }
      return { ...local, source: "local" };
    }

    case INTENT.CODING:
      return null;

    case INTENT.UNSUPPORTED:
    default: {
      const { query } = route.payload as { query: string };
      const local = answerQuestion(query, history);
      return { ...local, source: "local" };
    }
  }
}