import { SCROLL_TARGETS, AI_MAX_TOKENS, MAX_TOOL_ITERATIONS } from "./config";
import { portfolio } from "./portfolio";
import { SYSTEM_PROMPT } from "./prompts";
import { getAIConfig, isAIConfigured } from "./models";
import { getToolDefinitions, executeTool } from "./tools";
import { normalizePayload } from "./normalize";
import type {
  AssistantAction,
  AssistantActionType,
  AssistantHistoryMessage,
  AssistantResponse,
  AssistantResult,
  AssistantResultType,
  GeminiToolCall,
} from "./types";

export { isAIConfigured };

const RESUME_PATH = portfolio.resume;
const CERT_FILES = new Set(portfolio.certifications.map((c) => c.file));
const ALL_PROJECTS = [...portfolio.projects];
const ALL_CERTIFICATES = [...portfolio.certifications];
const ALL_SKILLS = [
  ...portfolio.skillsCurrent.map((s) => ({ ...s, meta: "current" })),
  ...portfolio.skillsExploring.map((s) => ({ ...s, meta: "exploring" })),
];

const ALLOWED_EXTERNAL: RegExp[] = [
  /^https:\/\/github\.com\/anujpurbe/,
  /^https:\/\/(?:www\.)?linkedin\.com\/in\/anuj-purbe/,
  /^https:\/\/leetcode\.com\/u\/anujpurbe/,
  /^mailto:anujpurbe123@gmail\.com$/,
];
const ALLOWED_LINKS: RegExp[] = [
  /^\/projects\/[a-z0-9-]+$/,
  /^\/journal/,
  /^\/$/,
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isExternalAllowed(href: string): boolean {
  return ALLOWED_EXTERNAL.some((re) => re.test(href));
}

function isLinkAllowed(href: string): boolean {
  return ALLOWED_LINKS.some((re) => re.test(href));
}

function validateAction(raw: unknown): AssistantAction | null {
  if (typeof raw !== "object" || raw === null) return null;
  const a = raw as Record<string, unknown>;
  const label = typeof a.label === "string" ? a.label.trim().slice(0, 60) : "";
  if (!label) return null;
  const type = a.type as AssistantActionType;

  if (type === "scroll") {
    const target = typeof a.target === "string" ? a.target : "";
    if (SCROLL_TARGETS[target]) return { label, type, target };
    return null;
  }
  if (type === "resume") return { label, type, href: RESUME_PATH };
  if (type === "link") {
    const href = typeof a.href === "string" ? a.href : "";
    if (isLinkAllowed(href)) return { label, type, href };
    return null;
  }
  if (type === "external") {
    const href = typeof a.href === "string" ? a.href : "";
    if (isExternalAllowed(href)) return { label, type, href };
    return null;
  }
  return null;
}

function resolveResult(type: AssistantResultType, id: string): AssistantResult | null {
  const key = id.trim().toLowerCase();
  if (type === "project") {
    const p = ALL_PROJECTS.find(
      (item) => item.slug === key || item.title.toLowerCase() === key,
    );
    if (!p) return null;
    return {
      type: "project",
      id: p.slug,
      title: p.title,
      description: p.description,
      meta: p.category,
      href: `/projects/${p.slug}`,
      technologies: p.technologies,
      github: p.github,
      demo: p.demo,
    };
  }
  if (type === "certificate") {
    const c = ALL_CERTIFICATES.find(
      (item) =>
        item.title.toLowerCase() === key || slugify(item.title) === slugify(key),
    );
    if (!c) return null;
    return {
      type: "certificate",
      id: c.title,
      title: c.title,
      description: c.description,
      meta: [c.issuer, c.date].filter(Boolean).join(" · "),
      href: c.file,
      download: CERT_FILES.has(c.file ?? "") ? c.file : undefined,
    };
  }
  if (type === "skill") {
    const s = ALL_SKILLS.find((item) => item.name.toLowerCase() === key);
    if (!s) return null;
    return {
      type: "skill",
      id: s.name,
      title: s.name,
      description: s.note,
      meta: s.meta,
    };
  }
  return null;
}

function validateResults(raw: unknown): AssistantResult[] {
  if (!Array.isArray(raw)) return [];
  const results: AssistantResult[] = [];
  for (const item of raw.slice(0, 12)) {
    if (typeof item !== "object" || item === null) continue;
    const r = item as Record<string, unknown>;
    const type = r.type as AssistantResultType;
    const id = typeof r.id === "string" ? r.id : "";
    if (type !== "project" && type !== "certificate" && type !== "skill") continue;
    if (!id) continue;
    const resolved = resolveResult(type, id);
    if (resolved) results.push(resolved);
  }
  return results;
}

function parseStructured(text: string): AssistantResponse | null {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.answer !== "string" || !obj.answer.trim()) return null;
  const actions: AssistantAction[] = [];
  if (Array.isArray(obj.actions)) {
    for (const a of obj.actions.slice(0, 6)) {
      const valid = validateAction(a);
      if (valid) actions.push(valid);
    }
  }
  return {
    answer: obj.answer.trim().slice(0, 600),
    actions: actions.length > 0 ? actions : undefined,
    results: validateResults(obj.results),
  };
}

type ChatMessage = {
  role: string;
  content: string;
  tool_calls?: GeminiToolCall[];
  tool_call_id?: string;
};

function buildMessages(
  message: string,
  knowledge: string,
  history: AssistantHistoryMessage[],
): ChatMessage[] {
  return [
    { role: "system", content: `${SYSTEM_PROMPT}\n\n${knowledge}` },
    ...history.slice(-8).map((h) => ({ role: h.role, content: h.text })),
    { role: "user", content: message },
  ];
}

export async function askAI(
  message: string,
  knowledge: string,
  history: AssistantHistoryMessage[] = [],
): Promise<AssistantResponse | null> {
  const config = getAIConfig();
  if (!config.apiKey) return null;

  const messages = buildMessages(message, knowledge, history);
  const tools = getToolDefinitions();

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    let res: Response;
    try {
      res = await fetch(`${config.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          temperature: 0.3,
          max_tokens: AI_MAX_TOKENS,
          messages,
          tools: tools.length > 0 ? tools : undefined,
        }),
        signal: AbortSignal.timeout(config.timeoutMs),
        cache: "no-store",
      });
    } catch (error) {
      console.error(`[assistant] ${config.model} fetch error:`, (error as Error)?.message);
      break;
    }

    if (!res.ok) {
      const body = await res.text();
      console.error(`[assistant] ${config.model} HTTP ${res.status}: ${body.slice(0, 200)}`);
      if (res.status === 503 || res.status === 429) {
        await new Promise((r) => setTimeout(r, 500 * (iteration + 1)));
        continue;
      }
      break;
    }

    const json: unknown = await res.json();
    const obj = json && typeof json === "object" ? json : null;
    const choices = obj && "choices" in obj && Array.isArray(obj.choices) ? obj.choices : [];
    const choice = (choices[0] as Record<string, unknown> | undefined) ?? null;
    const msgObj =
      choice && typeof choice.message === "object" && choice.message !== null
        ? (choice.message as Record<string, unknown>)
        : null;

    const toolCalls =
      msgObj && "tool_calls" in msgObj && Array.isArray(msgObj.tool_calls)
        ? (msgObj.tool_calls as GeminiToolCall[])
        : undefined;
    const content = typeof msgObj?.content === "string" ? msgObj.content : null;

    if (toolCalls && toolCalls.length > 0) {
      messages.push({ role: "assistant", content: content ?? "", tool_calls: toolCalls });
      const results = await Promise.all(
        toolCalls.map(async (tc) => {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(tc.function.arguments);
          } catch {
            console.error("[assistant] failed to parse tool arguments:", tc.function.arguments);
          }
          const result = await executeTool(tc.function.name, args);
          return {
            role: "tool" as const,
            content: result.output,
            tool_call_id: tc.id,
          };
        }),
      );
      messages.push(...results);
      continue;
    }

    if (content) {
      return parseStructured(content);
    }

    return null;
  }

  console.log("[assistant] max tool iterations reached");
  return null;
}

export type StreamEmit = (event: "text" | "actions" | "results" | "done" | "error", data: unknown) => void;

export async function streamAI(
  message: string,
  knowledge: string,
  history: AssistantHistoryMessage[],
  emit: StreamEmit,
): Promise<void> {
  const config = getAIConfig();
  if (!config.apiKey) {
    throw new Error("AI not configured.");
  }

  const messages = buildMessages(message, knowledge, history);
  const tools = getToolDefinitions();

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const res = await fetch(`${config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.3,
        max_tokens: AI_MAX_TOKENS,
        messages,
        tools: tools.length > 0 ? tools : undefined,
        stream: iteration === 0,
      }),
      signal: AbortSignal.timeout(config.timeoutMs),
      cache: "no-store",
    });

    if (!res.ok) {
      const bodyText = (await res.text()).slice(0, 300);
      console.error(`[assistant] streaming HTTP ${res.status}: ${bodyText}`);
      emit("error", { message: "AI service returned an error. Please try again." });
      return;
    }

    let streamStatus: StreamStatus = "empty";
    if (iteration === 0 && res.body) {
      streamStatus = await processStream(res.body, messages, emit);
    }

    if (streamStatus === "done") return;
    if (streamStatus === "tools") continue;
    if (iteration === 0 && streamStatus === "empty") {
      // No-tool-call, plain text answer without a streamed body — normalize below.
      const obj = (await res.json()) as { choices?: unknown[] };
      const msgObj = (Array.isArray(obj?.choices) ? obj.choices[0] : null) as
        | Record<string, unknown>
        | undefined;
      const content = typeof msgObj?.content === "string" ? msgObj.content : null;
      if (content && emitPayload(content, emit)) return;
      break;
    }

    if (iteration > 0) {
      const obj = (await res.json()) as { choices?: unknown[] };
      const msgObj = (Array.isArray(obj?.choices) ? obj.choices[0] : null) as
        | Record<string, unknown>
        | undefined;
      const content = typeof msgObj?.content === "string" ? msgObj.content : null;
      const toolCalls = Array.isArray(msgObj?.tool_calls)
        ? (msgObj.tool_calls as GeminiToolCall[])
        : undefined;

      if (toolCalls && toolCalls.length > 0) {
        messages.push({ role: "assistant", content: content ?? "", tool_calls: toolCalls });
        const results = await Promise.all(
          toolCalls.map(async (tc) => {
            let args: Record<string, unknown> = {};
            try {
              args = JSON.parse(tc.function.arguments);
            } catch {
              /* keep empty args */
            }
            const result = await executeTool(tc.function.name, args);
            return { role: "tool" as const, content: result.output, tool_call_id: tc.id };
          }),
        );
        messages.push(...results);
        continue;
      }

      if (content && emitPayload(content, emit)) return;
      break;
    }

    break;
  }

  emit("done", { source: "ai" });
}

type StreamStatus = "done" | "tools" | "empty";

async function processStream(
  body: ReadableStream<Uint8Array>,
  messages: ChatMessage[],
  emit: StreamEmit,
): Promise<StreamStatus> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let textContent = "";
  const toolCallsMap = new Map<number, GeminiToolCall>();
  let hasToolCalls = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }

      const obj = parsed && typeof parsed === "object" ? parsed : null;
      if (!obj || !("choices" in obj)) continue;
      const choices = Array.isArray((obj as Record<string, unknown>).choices)
        ? ((obj as Record<string, unknown>).choices as Record<string, unknown>[])
        : [];
      const delta = (choices[0]?.delta as Record<string, unknown> | undefined) ?? undefined;
      if (!delta) continue;

      if (typeof delta.content === "string" && delta.content) {
        textContent += delta.content;
      }

      if (delta.tool_calls && Array.isArray(delta.tool_calls)) {
        hasToolCalls = true;
        for (const tc of delta.tool_calls) {
          const tcObj = tc as Record<string, unknown>;
          const index = typeof tcObj.index === "number" ? tcObj.index : 0;
          const fnObj = tcObj.function as Record<string, unknown> | undefined;

          if (!toolCallsMap.has(index)) {
            toolCallsMap.set(index, {
              id: (typeof tcObj.id === "string" ? tcObj.id : "") || `call_${index}`,
              type: "function",
              function: {
                name: (fnObj?.name as string) ?? "",
                arguments: (fnObj?.arguments as string) ?? "",
              },
            });
          } else {
            const existing = toolCallsMap.get(index)!;
            if (typeof fnObj?.arguments === "string") {
              existing.function.arguments += fnObj.arguments;
            }
            if (typeof tcObj.id === "string" && tcObj.id) {
              existing.id = tcObj.id;
            }
          }
        }
      }
    }
  }

  if (hasToolCalls && toolCallsMap.size > 0) {
    messages.push({
      role: "assistant",
      content: textContent,
      tool_calls: Array.from(toolCallsMap.values()),
    });

    const toolResults = await Promise.all(
      Array.from(toolCallsMap.values()).map(async (tc) => {
        let args: Record<string, unknown> = {};
        try {
          args = JSON.parse(tc.function.arguments);
        } catch {
          console.error("[assistant] bad tool args:", tc.function.arguments);
        }
        const result = await executeTool(tc.function.name, args);
        return { role: "tool" as const, content: result.output, tool_call_id: tc.id };
      }),
    );
    messages.push(...toolResults);

    return "tools";
  }

  if (textContent) {
    if (emitPayload(textContent, emit)) return "done";
    return "empty";
  }

  return "empty";
}

function emitPayload(text: string, emit: StreamEmit): boolean {
  const payload = normalizePayload(text);
  if (payload?.answer) {
    emit("text", { delta: payload.answer });
    if (payload.actions) emit("actions", { actions: payload.actions });
    if (payload.results) emit("results", { results: payload.results });
    emit("done", { source: "ai" });
    return true;
  }
  return false;
}