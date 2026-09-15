import { AI_UNAVAILABLE_NOTICE, INTENT, RATE_LIMIT_PER_MINUTE, RATE_LIMIT_WINDOW_MS } from "./config";
import { askAI, streamAI, isAIConfigured } from "./gemini";
import { answerQuestion } from "./local";
import { buildPortfolioKnowledge } from "./portfolio";
import { consumeAiQuota } from "./quota";
import { classifyIntent, executeRoute } from "./router";
import { parseRequest } from "./validation";
import { rateLimited, clientIp } from "@/lib/rate-limit";
import type { AssistantHistoryMessage, AssistantResponse } from "./types";

export type StreamEmit = (
  event: "text" | "actions" | "results" | "done" | "error",
  data: unknown,
) => void;

type PreparedRequest = {
  ok: true;
  message: string;
  history: AssistantHistoryMessage[];
  ip: string;
};

type RejectedRequest = {
  ok: false;
  error: string;
  status: 400 | 429;
};

type DegradeAction = { label: string; type: "scroll"; target: string };

const DEGRADE_ACTIONS: DegradeAction[] = [
  { label: "Projects", type: "scroll", target: "projects" },
  { label: "Skills", type: "scroll", target: "skills" },
  { label: "Education", type: "scroll", target: "education" },
  { label: "Contact", type: "scroll", target: "contact" },
];

// Validates the request body and enforces the per-visitor rate limit.
export async function prepareRequest(
  request: Request,
  body: unknown,
): Promise<PreparedRequest | RejectedRequest> {
  const ip = clientIp(request);
  if (ip === "unknown") {
    return { ok: false, error: "Request could not be identified.", status: 400 };
  }

  const validated = parseRequest(body);
  if (!validated.ok) {
    return { ok: false, error: validated.error, status: 400 };
  }

  if (await rateLimited(ip, RATE_LIMIT_PER_MINUTE, RATE_LIMIT_WINDOW_MS, "assistant")) {
    return {
      ok: false,
      error: "Too many requests. Wait a moment and try again.",
      status: 429,
    };
  }

  return { ok: true, ip, message: validated.message, history: validated.history };
}

export type AnswerOutcome = {
  response: AssistantResponse;
  aiUsed: boolean;
};

// Deterministic-first pipeline. Only portfolio-summarization and coding
// questions are Gemini-eligible, and only up to the daily visitor quota +
// global budget.
export async function answerAssistant(
  message: string,
  ip: string,
  history: AssistantHistoryMessage[],
): Promise<AnswerOutcome> {
  const route = classifyIntent(message);
  const routed = await executeRoute(route, history);

  if (routed) {
    return { response: normalizeLocalResponse(routed), aiUsed: false };
  }

  const aiEligible = route.type === INTENT.CODING || route.type === INTENT.PORTFOLIO;
  if (!aiEligible) {
    const local = answerQuestion(message, history);
    return { response: normalizeLocalResponse(local), aiUsed: false };
  }

  if (isAIConfigured()) {
    const quota = await consumeAiQuota(ip);
    if (quota.allowed) {
      try {
        const ai = await askAI(message, buildPortfolioKnowledge(), history);
        if (ai) {
          return { response: { ...ai, source: "ai" }, aiUsed: true };
        }
      } catch (error) {
        console.error("[assistant] AI failed, degrading:", (error as Error)?.message);
      }
    }
  }

  return { response: degradeResponse(route.type, message, history), aiUsed: false };
}

export async function runAssistantStream(
  message: string,
  ip: string,
  history: AssistantHistoryMessage[],
  emit: StreamEmit,
): Promise<void> {
  const route = classifyIntent(message);
  const routed = await executeRoute(route, history);

  if (routed) {
    const resp = normalizeLocalResponse(routed);
    emit("text", { delta: resp.answer });
    if (resp.actions) emit("actions", { actions: resp.actions });
    if (resp.results) emit("results", { results: resp.results });
    emit("done", { source: resp.source ?? "tool" });
    return;
  }

  const aiEligible = route.type === INTENT.CODING || route.type === INTENT.PORTFOLIO;
  if (!aiEligible) {
    const local = answerQuestion(message, history);
    emit("text", { delta: local.answer });
    if (local.actions) emit("actions", { actions: local.actions });
    if (local.results) emit("results", { results: local.results });
    emit("done", { source: "local" });
    return;
  }

  if (isAIConfigured()) {
    const quota = await consumeAiQuota(ip);
    if (quota.allowed) {
      try {
        await streamAI(message, buildPortfolioKnowledge(), history, emit);
        return;
      } catch (error) {
        console.error("[assistant] streaming AI failed, degrading:", (error as Error)?.message);
      }
    }
  }

  const degraded = degradeResponse(route.type, message, history);
  emit("text", { delta: degraded.answer });
  if (degraded.actions) emit("actions", { actions: degraded.actions });
  if (degraded.results) emit("results", { results: degraded.results });
  emit("done", { source: "local" });
}

function normalizeLocalResponse(resp: AssistantResponse): AssistantResponse {
  return {
    answer: resp.answer,
    actions: resp.actions,
    results: resp.results,
    source: resp.source ?? "local",
  };
}

function degradeResponse(
  intent: string,
  message: string,
  history: AssistantHistoryMessage[],
): AssistantResponse {
  if (intent === INTENT.CODING) {
    return {
      answer:
        "That's a general programming question, and AI mode is temporarily unavailable. I can still help you explore Anuj's portfolio:",
      actions: DEGRADE_ACTIONS.map((a) => ({ ...a })),
      source: "local",
      notice: AI_UNAVAILABLE_NOTICE,
    };
  }
  const local = answerQuestion(message, history);
  return {
    ...local,
    actions: local.actions?.length
      ? local.actions
      : DEGRADE_ACTIONS.map((a) => ({ ...a })),
    source: "local",
    notice: AI_UNAVAILABLE_NOTICE,
  };
}