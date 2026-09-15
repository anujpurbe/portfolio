import { NextResponse } from "next/server";
import { prepareRequest, runAssistantStream } from "@/lib/assistant";
import { sse, SSE_HEADERS } from "@/lib/assistant/sse";
import type { StreamEmit } from "@/lib/assistant";

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

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const emit: StreamEmit = (event, data) => {
        controller.enqueue(encoder.encode(sse(event, data)));
      };
      try {
        await runAssistantStream(prepared.message, prepared.ip, prepared.history, emit);
      } catch (error) {
        console.error("[assistant] stream error:", (error as Error)?.message);
        emit("error", { message: "Something went wrong. Please try again." });
      }
      controller.close();
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}