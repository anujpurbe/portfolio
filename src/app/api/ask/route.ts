import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import { buildPortfolioKnowledge } from "@/lib/ask/knowledge";
import { askAI, isAIConfigured } from "@/lib/ask/ai";
import { answerQuestion } from "@/lib/ask/local";

export const dynamic = "force-dynamic";

const MAX_MESSAGE = 400;
const RATE_LIMIT_PER_MINUTE = 12;

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(ip, RATE_LIMIT_PER_MINUTE, 60_000)) {
    return NextResponse.json(
      {
        error: "Too many requests. Wait a moment and try again.",
        offline: true,
      },
      { status: 429 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const message =
    typeof body === "object" && body !== null && "message" in body
      ? (body as { message?: unknown }).message
      : null;
  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { error: "Empty question." },
      { status: 400 },
    );
  }
  const trimmed = message.trim();
  if (trimmed.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Question must be ${MAX_MESSAGE} characters or fewer.` },
      { status: 400 },
    );
  }

  const knowledge = buildPortfolioKnowledge();

  if (isAIConfigured()) {
    try {
      const ai = await askAI(trimmed, knowledge);
      if (ai) {
        return NextResponse.json({ ...ai, source: "ai" });
      }
    } catch {
      // fall through to the deterministic engine on AI failure
    }
  }

  return NextResponse.json({ ...answerQuestion(trimmed), source: "local" });
}
