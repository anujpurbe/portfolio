"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
};

type Comment = {
  id: string;
  name: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type Data =
  | { configured: false }
  | { configured: true; messages: Message[]; comments: Comment[] };

const messageStatus: Record<Message["status"], string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
};

const messageStatusClass: Record<Message["status"], string> = {
  new: "border-accent/50 bg-accent-soft text-accent",
  read: "border-border text-muted",
  replied: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
};

function StatusButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent/60 bg-accent-soft text-accent"
          : "border-border text-muted hover:border-accent/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"contact_messages" | "comments">("contact_messages");
  const [busy, setBusy] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Message | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        setData(null);
        return;
      }
      const json = await res.json().catch(() => null);
      setAuthed(true);
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!pendingDelete) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPendingDelete(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingDelete]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError("Wrong password.");
        return;
      }
      setPassword("");
      await load();
    } catch {
      setLoginError("Couldn't sign in right now.");
    }
  }

  async function updateStatus(
    table: "contact_messages" | "comments",
    id: string,
    status: string,
  ) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/data", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, status }),
      });
      if (res.ok) await load();
    } finally {
      setBusy(null);
    }
  }

  async function deleteRow(table: "contact_messages" | "comments", id: string) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/data", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id }),
      });
      if (!res.ok) return false;
      await load();
      return true;
    } catch {
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleteError("");
    const ok = await deleteRow("contact_messages", pendingDelete.id);
    if (ok) {
      setPendingDelete(null);
    } else {
      setDeleteError("Couldn't delete the message. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="pt-32 pb-20 sm:pt-40">
        <div className="container-shell flex items-center gap-3 text-muted">
          <Loader2 className="size-5 animate-spin text-accent" />
          Checking session…
        </div>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="pt-32 pb-20 sm:pt-40">
        <div className="container-shell mx-auto max-w-sm">
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
              <Lock className="size-4 text-accent" />
              Admin sign in
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {loginError && (
                <p role="alert" className="text-xs text-red-500">
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                className="focus-ring w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  if (!data.configured) {
    return (
      <main className="pt-32 pb-20 sm:pt-40">
        <div className="container-shell max-w-xl">
          <div className="card p-6">
            <p className="text-sm leading-6 text-muted">
              The admin panel needs a Supabase database. Add{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                SUPABASE_URL
              </code>{" "}
              and{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                SUPABASE_SECRET_KEY
              </code>{" "}
              with <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">contact_messages</code> and{" "}
              <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">comments</code>{" "}
              tables to use it.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const messages = data.messages;
  const comments = data.comments;
  const pendingComments = comments.filter((c) => c.status === "pending");

  return (
    <main className="pt-32 pb-20 sm:pt-40">
      <div className="container-shell max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={load}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </button>
            <div className="flex gap-1 rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => setTab("contact_messages")}
                className={cn(
                  "focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                  tab === "contact_messages"
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-foreground",
                )}
              >
                <Inbox className="size-3.5" />
                Messages
                {messages.length > 0 && (
                  <span className="rounded-full bg-accent/15 px-1.5 font-mono text-xs text-accent">
                    {messages.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setTab("comments")}
                className={cn(
                  "focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                  tab === "comments"
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-foreground",
                )}
              >
                <MessageSquare className="size-3.5" />
                Comments
                {pendingComments.length > 0 && (
                  <span className="rounded-full bg-amber-500/15 px-1.5 font-mono text-xs text-amber-500">
                    {pendingComments.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {tab === "contact_messages" ? (
          messages.length === 0 ? (
            <div className="card p-6">
              <p className="text-sm text-muted">No messages yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <article key={message.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{message.subject}</h2>
                      <p className="mt-0.5 text-xs text-subtle">
                        {message.name} · {message.email} ·{" "}
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                        messageStatusClass[message.status],
                      )}
                    >
                      {messageStatus[message.status]}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {message.message}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(["new", "read", "replied"] as const).map((status) => (
                      <StatusButton
                        key={status}
                        label={messageStatus[status]}
                        active={message.status === status}
                        onClick={() =>
                          updateStatus("contact_messages", message.id, status)
                        }
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError("");
                        setPendingDelete(message);
                      }}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-red-500/50 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                    {busy === message.id && (
                      <Loader2 className="size-4 animate-spin text-subtle" />
                    )}
                  </div>
                </article>
              ))}
            </div>
          )
        ) : comments.length === 0 ? (
          <div className="card p-6">
            <p className="text-sm text-muted">No comments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article key={comment.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">{comment.name}</h2>
                    <p className="mt-0.5 text-xs text-subtle">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                      comment.status === "approved"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                        : comment.status === "rejected"
                          ? "border-red-500/40 bg-red-500/10 text-red-500"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-500",
                    )}
                  >
                    {comment.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {comment.comment}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {comment.status === "approved" ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus("comments", comment.id, "pending")
                      }
                      className="focus-ring rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
                    >
                      Unpublish
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus("comments", comment.id, "approved")
                      }
                      className="focus-ring inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Approve
                    </button>
                  )}
                  {comment.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus("comments", comment.id, "rejected")
                      }
                      className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10"
                    >
                      <XCircle className="size-3.5" />
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteRow("comments", comment.id)}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-red-500/50 hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                  {busy === comment.id && (
                    <Loader2 className="size-4 animate-spin text-subtle" />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {pendingDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-message-title"
            onClick={() => setPendingDelete(null)}
          >
            <div
              className="card w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="size-4 text-red-500" />
                </div>
                <div>
                  <h2 id="delete-message-title" className="font-semibold">
                    Delete this message?
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Delete this message permanently? This action cannot be
                    undone.
                  </p>
                </div>
              </div>
              <p className="mt-4 truncate rounded-md bg-surface px-3 py-2 font-mono text-xs text-subtle">
                {pendingDelete.subject}
              </p>
              {deleteError && (
                <p role="alert" className="mt-3 text-xs text-red-500">
                  {deleteError}
                </p>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  disabled={busy === pendingDelete.id}
                  className="focus-ring rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={busy === pendingDelete.id}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {busy === pendingDelete.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
