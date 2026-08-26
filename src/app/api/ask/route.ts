import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { buildPortfolioKnowledge } from "@/lib/ask/knowledge";
import { askAI, isAIConfigured } from "@/lib/ask/ai";
import { answerQuestion } from "@/lib/ask/local";
import { buildRAGContext } from "@/lib/ask/rag";
import type { AskHistoryMessage } from "@/lib/ask/types";

export const dynamic = "force-dynamic";

const MAX_MESSAGE = 400;
const RATE_LIMIT_PER_MINUTE = 12;

function parseHistory(value: unknown): AskHistoryMessage[] {
  if (!Array.isArray(value)) return [];
  const history: AskHistoryMessage[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) continue;
    const r = item as Record<string, unknown>;
    if (r.role !== "user" && r.role !== "assistant") continue;
    if (typeof r.text !== "string" || !r.text.trim()) continue;
    history.push({ role: r.role, text: r.text.trim().slice(0, MAX_MESSAGE) });
    if (history.length >= 8) break;
  }
  return history;
}

const AI_UNAVAILABLE_NOTICE =
  "AI mode is temporarily unavailable, but I can still help you explore the portfolio.";

const DEGRADED_FALLBACK_ACTIONS = [
  { label: "Projects", type: "scroll", target: "projects" },
  { label: "Skills", type: "scroll", target: "skills" },
  { label: "Education", type: "scroll", target: "education" },
  { label: "Contact", type: "scroll", target: "contact" },
] as const;

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (await rateLimited(ip, RATE_LIMIT_PER_MINUTE, 60_000, "ask")) {
    return NextResponse.json(
      {
        error: "Too many requests. Wait a moment and try again.",
        offline: true,
      },
      { status: 429 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Empty question." }, { status: 400 });
  }
  const { message, history: rawHistory } = body as {
    message?: unknown;
    history?: unknown;
  };
  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Empty question." }, { status: 400 });
  }
  const trimmed = message.trim();
  if (trimmed.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Question must be ${MAX_MESSAGE} characters or fewer.` },
      { status: 400 },
    );
  }
  const history = parseHistory(rawHistory);

  let knowledge = buildPortfolioKnowledge();
  const aiConfigured = isAIConfigured();

  if (aiConfigured) {
    try {
      const ragContext = await buildRAGContext(trimmed);
      if (ragContext) {
        knowledge += "\n\n" + ragContext;
      }
    } catch {
      // RAG is optional — continue without it
    }
  }

  if (aiConfigured) {
    try {
      const ai = await askAI(trimmed, knowledge, history);
      if (ai) {
        return NextResponse.json({ ...ai, source: "ai" });
      }
    } catch (error) {
      console.error("[ask] fallback to local:", (error as Error)?.message);
    }
  }

  const local = answerQuestion(trimmed, history);
  if (aiConfigured) {
    const actions = local.actions?.length
      ? local.actions
      : DEGRADED_FALLBACK_ACTIONS.map((a) => ({ ...a }));
    return NextResponse.json({
      ...local,
      actions,
      source: "local",
      notice: AI_UNAVAILABLE_NOTICE,
    });
  }

  return NextResponse.json({ ...local, source: "local" });
}
