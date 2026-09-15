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
  /^\s*[\d\s+\-*/^().]+$/,
  /^\s*calculate\s+/i,
  /^\s*what(?:'s| is)\s+[\d\s+\-*/^().]+/i,
  /^\s*(?:solve|eval(?:uate)?)\s+[\d\s+\-*/^().]+/i,
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
// Portfolio-style questions are routed earlier, so these patterns are deliberately
// CS-vocabulary-heavy to avoid burning quota on non-coding small talk.
const CODING_PATTERNS = [
  /\bcode\b/i,
  /\bcoding\b/i,
  /\bprogram(ming|matically|mer|mers)?\b/i,
  /\bfunction\b/i,
  /\balgorithm(s)?\b/i,
  /\brecursion\b/i,
  /\brecursive\b/i,
  /\bsyntax\b/i,
  /\bbug(s)?\b/i,
  /\bdebug(g(ing|ged)?)?\b/i,
  /\bcompile(r|ing|d)?\b/i,
  /\bcomplexity\b/i,
  /\bbig[- ]?o\b/i,
  /\b(time|space|asymptotic)\s+complexity\b/i,
  /\bdata\s+structure(s)?\b/i,
  /\bsolve\b/i,
  /\b(binary|linear|depth[- ]?first|breadth[- ]?first)\s+search\b/i,
  /\b(array|linked\s+list|hash\s*map|stack|queue|graph|binary\s+tree|bst|avl|trie|heap)\b/i,
  /\b(quick|merge|insertion|selection|bubble|heap)\s*sort\b/i,
  /\bsorting\b/i,
  /\bdfs\b/i,
  /\bbfs\b/i,
  /\b(timeout|async|await|promise|thread|callback|deadlock|race condition)\b/i,
  /\b(variable|loop|conditional|operator)\b/i,
  /\bhow\s+(do|to|would|should)\s+(i\s*\/?)?(code|write|build|implement|solve)\b/i,
  /\bexplain\s+what\b/i,
  /\bwrite\s+(a\s+|the\s+|some\s+)?(function|code|program|loop|class|api)\b/i,
  /^what\s+is\s+(a\s+)?(function|variable|loop|recursion|algorithm|binary search|framework|api|library|compiler|syntax)\b/i,
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

// Pulls the location out of a weather query. Word boundaries keep "in"/"for"/"at"
// from matching inside other words (e.g. "at" inside "what"), and the end anchor
// prefers the last location phrase. Time filler words are discarded so
// "weather in London today" resolves to London, and "weather for today" falls
// back to the default location.
function extractLocation(message: string): string {
  const match = message.match(/\b(?:in|for|at|of)\s+([a-zA-Z][a-zA-Z\s]*)$/i);
  let location = match ? match[1].trim() : "";
  location = location.replace(/\b(today|tomorrow|tonight|right now|now|please|pls)\b/gi, "").trim();
  return location || "current location";
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
      .replace(/^\s*what(?:'s| is)\s+/i, "")
      .replace(/[!?.]+$/, "")
      .trim();
    return { type: INTENT.CALCULATOR, payload: { expression: expr } };
  }

  // Weather — before date/time so queries like "weather for today" don't get
  // misrouted by the date keywords.
  if (matchesPatterns(message, WEATHER_PATTERNS)) {
    return { type: INTENT.WEATHER, payload: { location: extractLocation(message) } };
  }

  // Date/Time.
  if (matchesPatterns(message, DATETIME_PATTERNS)) {
    return { type: INTENT.DATETIME, payload: { timezone: "Asia/Kolkata" } };
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