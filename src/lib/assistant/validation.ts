import {
  MAX_HISTORY_MESSAGE_LENGTH,
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE,
} from "./config";
import type { AssistantHistoryMessage } from "./types";

export function parseHistory(value: unknown): AssistantHistoryMessage[] {
  if (!Array.isArray(value)) return [];
  const history: AssistantHistoryMessage[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null) continue;
    const r = item as Record<string, unknown>;
    if (r.role !== "user" && r.role !== "assistant") continue;
    if (typeof r.text !== "string" || !r.text.trim()) continue;
    history.push({
      role: r.role,
      text: r.text.trim().slice(0, MAX_HISTORY_MESSAGE_LENGTH),
    });
    if (history.length >= MAX_HISTORY_MESSAGES) break;
  }
  return history;
}

export type ValidRequest = {
  ok: true;
  message: string;
  history: AssistantHistoryMessage[];
};

export type InvalidRequest = {
  ok: false;
  error: string;
};

export function parseRequest(body: unknown): ValidRequest | InvalidRequest {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Empty question." };
  }
  const { message, history } = body as { message?: unknown; history?: unknown };
  if (typeof message !== "string" || message.trim().length === 0) {
    return { ok: false, error: "Empty question." };
  }
  const trimmed = message.trim();
  if (trimmed.length > MAX_MESSAGE) {
    return {
      ok: false,
      error: `Question must be ${MAX_MESSAGE} characters or fewer.`,
    };
  }
  return { ok: true, message: trimmed, history: parseHistory(history) };
}