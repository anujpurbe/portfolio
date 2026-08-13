"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Loader2,
  Lock,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Comment = {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
};

type Status = "idle" | "sending" | "success" | "error";

const MAX_COMMENT = 500;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">{comment.name}</p>
        {comment.createdAt && (
          <span className="font-mono text-[10px] text-subtle">
            {formatDate(comment.createdAt)}
          </span>
        )}
      </div>
      <p className="text-sm leading-6 text-muted">{comment.comment}</p>
    </motion.div>
  );
}

export function Comments() {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/comments")
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) {
          setConfigured(json?.configured ?? true);
          return;
        }
        setConfigured(json?.configured ?? true);
        setComments(json.comments ?? []);
      })
      .catch(() => {
        if (!cancelled) setConfigured(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function validate() {
    const next: Record<string, string | undefined> = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (comment.trim().length < 3)
      next.comment = "Comment should be at least 3 characters.";
    else if (comment.trim().length > MAX_COMMENT)
      next.comment = `Keep it under ${MAX_COMMENT} characters.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honey) return;
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, website: honey }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setConfigured(json?.configured ?? true);
        throw new Error("failed");
      }
      setStatus("success");
      setName("");
      setComment("");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
      errors[field] ? "border-red-500/60" : "border-border",
    );

  return (
    <Section
      id="comments"
      eyebrow="Comments"
      title="Leave your comments"
      description="A note on the build, a question, or just say hi — it lands in my inbox after moderation."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <form onSubmit={handleSubmit} noValidate className="card p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="comment-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="comment-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass("name")}
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="comment-message"
                  className="mb-1.5 flex items-center justify-between text-sm font-medium"
                >
                  Comment
                  <span className="font-mono text-xs text-subtle">
                    {comment.length}/{MAX_COMMENT}
                  </span>
                </label>
                <textarea
                  id="comment-message"
                  name="comment"
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value.slice(0, MAX_COMMENT))
                  }
                  placeholder="Thoughts on the site, or a question…"
                  aria-invalid={Boolean(errors.comment)}
                  className={cn(inputClass("comment"), "resize-y")}
                />
                {errors.comment && (
                  <p role="alert" className="mt-1.5 text-xs text-red-500">
                    {errors.comment}
                  </p>
                )}
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="comment-website">Website</label>
                <input
                  id="comment-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="focus-ring btn-lift inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Posting…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Post comment
                    </>
                  )}
                </button>
                {status === "success" && (
                  <p
                    role="status"
                    className="inline-flex items-center gap-1.5 text-sm text-emerald-500"
                  >
                    <CheckCircle2 className="size-4" />
                    Posted — it appears after approval.
                  </p>
                )}
                {status === "error" && (
                  <p
                    role="alert"
                    className="inline-flex items-center gap-1.5 text-sm text-red-500"
                  >
                    <XCircle className="size-4" />
                    {configured
                      ? "Something went wrong. Try again."
                      : "Comments aren't enabled yet."}
                  </p>
                )}
              </div>

              {configured && (
                <p className="flex items-center gap-1.5 text-xs text-subtle">
                  <Lock className="size-3" />
                  Moderation protects the page from spam — public comments
                  appear only after approval.
                </p>
              )}
            </div>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
              <MessageSquare className="size-3.5" />
              {comments === null
                ? "Loading comments…"
                : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
            </h3>

            {comments === null ? (
              <div className="card flex items-center gap-3 p-6">
                <Loader2 className="size-4 animate-spin text-accent" />
                <span className="text-sm text-muted">
                  {configured ? "Fetching comments…" : "Loading…"}
                </span>
              </div>
            ) : !configured ? (
              <div className="card p-6">
                <p className="text-sm leading-6 text-muted">
                  Comments are coming soon — they&apos;ll be live once the
                  comment backend is configured. Until then, reach me through
                  the contact form above.
                </p>
              </div>
            ) : comments.length === 0 ? (
              <div className="card p-6">
                <p className="text-sm leading-6 text-muted">
                  No comments yet — be the first to leave a note.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
