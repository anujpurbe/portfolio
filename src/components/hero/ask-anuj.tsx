"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import type {
  AskAction,
  AskResult,
  Message,
} from "@/lib/ask/types";
import { cn } from "@/lib/utils";

const MAX_MESSAGE = 400;

const CHIPS = [
  "What projects has Anuj built?",
  "What is he currently learning?",
  "Is he open to internships?",
  "Show his certificates",
  "What technologies does he use?",
  "How can I contact him?",
];

const OFFLINE_ACTIONS: AskAction[] = [
  { label: "Projects", type: "scroll", target: "projects" },
  { label: "Skills", type: "scroll", target: "skills" },
  { label: "Contact", type: "scroll", target: "contact" },
];

function scrollToSection(target: string) {
  const el = document.getElementById(target);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function ActionChip({ action }: { action: AskAction }) {
  const router = useRouter();
  if (action.type === "scroll") {
    return (
      <button
        type="button"
        onClick={() => scrollToSection(action.target ?? "")}
        className="focus-ring btn-lift inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground"
      >
        {action.label}
      </button>
    );
  }
  const href =
    action.type === "resume"
      ? action.href
      : action.type === "external"
        ? action.href
        : action.href;
  if (action.type === "link") {
    return (
      <button
        type="button"
        onClick={() => href && router.push(href)}
        className="focus-ring btn-lift inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground"
      >
        {action.label}
      </button>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring btn-lift inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground"
    >
      {action.label}
    </a>
  );
}

function ResultCard({ result }: { result: AskResult }) {
  const router = useRouter();
  if (result.type === "project") {
    return (
      <button
        type="button"
        onClick={() => result.href && router.push(result.href)}
        className="focus-ring group w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-accent/40"
      >
        <p className="text-sm font-medium text-foreground">{result.title}</p>
        {result.meta && (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
            {result.meta}
          </p>
        )}
        {result.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
            {result.description}
          </p>
        )}
        <p className="mt-1.5 font-mono text-[11px] text-accent">
          View project →
        </p>
      </button>
    );
  }
  if (result.type === "certificate") {
    return (
      <div className="w-full rounded-lg border border-border bg-card p-3">
        <p className="text-sm font-medium text-foreground">{result.title}</p>
        {result.meta && (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
            {result.meta}
          </p>
        )}
        {result.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
            {result.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href={result.href}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-foreground"
          >
            View certificate
          </a>
          {result.download && (
            <a
              href={result.download}
              download
              className="focus-ring inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-foreground"
            >
              Download
            </a>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full rounded-lg border border-border bg-card p-3">
      <p className="text-sm font-medium text-foreground">{result.title}</p>
      {result.meta && (
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
          {result.meta === "current" ? "current stack" : "exploring"}
        </p>
      )}
      {result.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
          {result.description}
        </p>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <p className="whitespace-pre-wrap font-mono text-sm leading-6 text-muted">
        <span className="text-accent">you › </span>
        {message.text}
      </p>
    );
  }
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface-2/60 p-3">
      <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
        {message.text}
      </p>
      {message.actions && message.actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.actions.map((a, i) => (
            <ActionChip key={`${a.label}-${i}`} action={a} />
          ))}
        </div>
      )}
      {message.results && message.results.length > 0 && (
        <div className="grid gap-2">
          {message.results.map((r) => (
            <ResultCard key={`${r.type}-${r.id}`} result={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div
      className="flex w-fit items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2"
      role="status"
      aria-live="polite"
    >
      <span className="font-mono text-xs text-muted">ask://anuj is thinking</span>
      <span className="flex gap-1" aria-hidden="true">
        <span className="typing-dot size-1.5 rounded-full bg-accent" />
        <span className="typing-dot size-1.5 rounded-full bg-accent" style={{ animationDelay: "0.15s" }} />
        <span className="typing-dot size-1.5 rounded-full bg-accent" style={{ animationDelay: "0.3s" }} />
      </span>
    </div>
  );
}

export function AskAnuj() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "thinking" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastQuestionRef = useRef<string | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  async function ask(text: string) {
    setStatus("thinking");
    setError(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = (await res.json()) as {
        answer?: string;
        actions?: AskAction[];
        results?: AskResult[];
        error?: string;
      };
      if (!res.ok) {
        throw new Error(json.error ?? "offline");
      }
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: json.answer ?? "",
          actions: json.actions,
          results: json.results,
        },
      ]);
      setStatus("idle");
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "ask://anuj is temporarily offline. You can still explore the portfolio directly:",
          actions: OFFLINE_ACTIONS,
        },
      ]);
      setError("Connection failed — your question wasn't answered.");
      setStatus("error");
    }
  }

  async function submit(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || status === "thinking") return;
    if (text.length > MAX_MESSAGE) {
      setError(`Keep it under ${MAX_MESSAGE} characters.`);
      return;
    }
    lastQuestionRef.current = text;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    await ask(text);
  }

  function reset() {
    setMessages([]);
    setInput("");
    setError(null);
    setStatus("idle");
    inputRef.current?.focus();
  }

  function retry() {
    const last = lastQuestionRef.current;
    if (last && status === "error") {
      setMessages((m) => m.slice(0, -1));
      void ask(last);
    } else {
      reset();
    }
  }

  const busy = status === "thinking";

  return (
    <div className="backdrop-shell card w-full max-w-md overflow-hidden border-accent/15 shadow-elevated">
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="flex items-center gap-2 font-mono text-sm font-semibold text-accent">
              <Sparkles className="size-4" aria-hidden="true" />
              ask://anuj
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Ask anything about my work, projects, skills, or experience — or
              search the portfolio.
            </p>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="focus-ring rounded-md p-1.5 text-subtle transition-colors hover:text-foreground"
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ask-anuj-input" className="sr-only">
            Ask about Anuj
          </label>
          <input
            id="ask-anuj-input"
            ref={inputRef}
            type="text"
            value={input}
            maxLength={MAX_MESSAGE}
            autoComplete="off"
            enterKeyHint="send"
            placeholder="Search or ask about Anuj..."
            onChange={(e) => setInput(e.target.value)}
            className="focus-ring h-10 min-w-0 flex-1 rounded-lg border border-border bg-surface-2/60 px-3 font-mono text-sm text-foreground placeholder:text-subtle"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length === 0}
            aria-label="Ask"
            className={cn(
              "focus-ring btn-lift inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm shadow-accent/25 transition-opacity",
              busy || input.trim().length === 0
                ? "cursor-not-allowed opacity-40"
                : "hover:opacity-90",
            )}
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </form>

        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="list"
          aria-label="Suggested questions"
        >
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => submit(chip)}
              disabled={busy}
              className="focus-ring btn-lift shrink-0 rounded-full border border-border bg-surface/70 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-foreground disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        <div
          ref={listRef}
          aria-live="polite"
          aria-atomic="false"
          className="max-h-72 space-y-3 overflow-y-auto"
        >
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
          {busy && <ThinkingIndicator />}
        </div>

        {error && status === "error" && messages.length > 0 && (
          <p className="flex items-center gap-2 text-xs text-muted" role="alert">
            {error}
            <button
              type="button"
              onClick={retry}
              className="focus-ring font-mono text-accent underline-offset-2 hover:underline"
            >
              retry
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
