import { NextResponse } from "next/server";
import { answerAssistant, prepareRequest } from "@/lib/assistant";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const prepared = await prepareRequest(request, body);
  if (!prepared.ok) {
    return NextResponse.json(
      { error: prepared.error, offline: true },
      { status: prepared.status },
    );
  }

  const { response, aiUsed } = await answerAssistant(
    prepared.message,
    prepared.ip,
    prepared.history,
  );

  return NextResponse.json({ ...response, aiUsed });
}