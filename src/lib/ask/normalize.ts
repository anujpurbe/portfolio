import type { AskAction, AskResponse, AskResult } from "./types";

export type NormalizedPayload = {
  answer: string;
  actions?: AskAction[];
  results?: AskResult[];
  source?: "ai" | "local" | "tool";
  notice?: string;
};

function stripCodeFence(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanActions(value: unknown): AskAction[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const actions: AskAction[] = [];
  for (const item of value.slice(0, 6)) {
    if (!isRecord(item)) continue;
    if (typeof item.label !== "string" || !item.label.trim()) continue;
    const type = ["scroll", "link", "external", "resume"].includes(String(item.type))
      ? (item.type as AskAction["type"])
      : "external";
    const href = typeof item.href === "string" ? item.href : undefined;
    const target = typeof item.target === "string" ? item.target : undefined;
    if (type !== "external" && type !== "link" && type !== "resume" && !target) continue;
    actions.push({ label: item.label.trim().slice(0, 40), type, href, target });
  }
  return actions.length > 0 ? actions : undefined;
}

function cleanResults(value: unknown): AskResult[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const results: AskResult[] = [];
  for (const item of value.slice(0, 12)) {
    if (!isRecord(item)) continue;
    const type = item.type;
    if (type !== "project" && type !== "certificate" && type !== "skill") continue;
    const id = typeof item.id === "string" ? item.id : "";
    if (!id) continue;
    results.push({
      type,
      id,
      title: typeof item.title === "string" ? item.title : id,
      description: typeof item.description === "string" ? item.description : undefined,
      meta: typeof item.meta === "string" ? item.meta : undefined,
      href: typeof item.href === "string" ? item.href : undefined,
      download: typeof item.download === "string" ? item.download : undefined,
      technologies: Array.isArray(item.technologies)
        ? item.technologies.filter((t): t is string => typeof t === "string")
        : undefined,
      github: typeof item.github === "string" ? item.github : undefined,
      demo: typeof item.demo === "string" ? item.demo : undefined,
    });
  }
  return results.length > 0 ? results : undefined;
}

function payloadFromObject(obj: Record<string, unknown>): NormalizedPayload | null {
  if (typeof obj.answer !== "string" || !obj.answer.trim()) return null;
  return {
    answer: obj.answer.trim().slice(0, 2000),
    actions: cleanActions(obj.actions),
    results: cleanResults(obj.results),
  };
}

// Bounded recursion so an `answer` that is itself JSON gets unwrapped exactly once more.
function unwrapNestedAnswer(answer: string, depth: number): string {
  if (depth <= 0) return answer;
  const trimmed = answer.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return answer;
  const nested = normalizePayload(trimmed);
  if (nested && nested.answer && nested.answer !== answer) {
    return unwrapNestedAnswer(nested.answer, depth - 1);
  }
  return answer;
}

export function normalizePayload(raw: unknown, _depth = 2): NormalizedPayload | null {
  if (raw == null) return null;

  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return null;

    const looksLikeJson = text.startsWith("{");

    if (looksLikeJson) {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      try {
        if (end > start) {
          const parsed = JSON.parse(stripCodeFence(text.slice(start, end + 1)));
          if (isRecord(parsed)) {
            const payload = payloadFromObject(parsed);
            if (payload && payload.answer) {
              return { ...payload, answer: unwrapNestedAnswer(payload.answer, _depth - 1) };
            }
          }
        }
      } catch {
        // Object didn't fully parse as JSON — attempt salvage below.
      }
      // JSON parse failed or was truncated — salvage the answer string if present.
      const match = /(?:"answer"\s*:\s*")((?:\\.|[^"\\])*)("|$)/.exec(text.slice(start));
      if (match && match[1]) {
        const salvaged = unwrapNestedAnswer(unescapeJson(match[1]), _depth - 1);
        if (salvaged) return { answer: salvaged.slice(0, 2000) };
      }
      // Fall back to plain text interpretation.
      return { answer: text.slice(0, 2000) };
    }

    return { answer: text.slice(0, 2000) };
  }

  if (isRecord(raw)) {
    const payload = payloadFromObject(raw);
    if (payload && payload.answer) {
      return { ...payload, answer: unwrapNestedAnswer(payload.answer, _depth - 1) };
    }
    return payload;
  }

  return null;
}

function unescapeJson(value: string): string {
  let result = "";
  try {
    result = JSON.parse(`"${value}"`);
  } catch {
    result = value.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
  }
  return result;
}

export function normalizeAnswer(raw: unknown): string {
  return normalizePayload(raw)?.answer ?? "";
}

export function normalizeResponse(response: AskResponse): AskResponse {
  return {
    answer: normalizeAnswer(response.answer),
    actions: cleanActions(response.actions) ?? response.actions,
    results: cleanResults(response.results) ?? response.results,
    source: response.source,
    notice: response.notice,
  };
}
