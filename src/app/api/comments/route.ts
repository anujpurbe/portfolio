import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_NAME = 60;
const MAX_COMMENT = 500;

type CommentPayload = {
  name: string;
  comment: string;
  website?: string;
};

function isPayload(value: unknown): value is CommentPayload {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.comment === "string";
}

function isValid(body: CommentPayload) {
  const name = body.name.trim();
  const comment = body.comment.trim();
  return (
    name.length >= 2 &&
    name.length <= MAX_NAME &&
    comment.length >= 3 &&
    comment.length <= MAX_COMMENT
  );
}

function configured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );
}

function supabase() {
  return {
    url: `${(process.env.SUPABASE_URL ?? "").replace(/\/$/, "")}/rest/v1`,
    key: process.env.SUPABASE_SECRET_KEY ?? "",
  };
}

function fetchFailure(err: unknown, url?: string, includeHost = true): string {
  const parts: string[] = [];
  let cur: unknown = err;
  let depth = 0;
  while (cur && depth < 5) {
    if (cur instanceof Error && cur.message) parts.push(cur.message);
    cur =
      typeof cur === "object" && cur !== null && "cause" in cur
        ? (cur as { cause?: unknown }).cause
        : null;
    depth += 1;
  }
  if (includeHost) {
    let host = "?";
    try {
      host = new URL(url ?? "").host;
    } catch {
      host = (url ?? "").slice(0, 40);
    }
    parts.push(`host:${host}`);
  }
  return parts.join(" | ");
}

async function storeComment(
  body: CommentPayload,
  ip: string,
): Promise<{ ok: boolean; dbStatus?: number; reason?: string }> {
  const { url, key } = supabase();
  const restUrl = `${url}/comments`;
  const insert = async (payload: Record<string, string>) => {
    return fetch(restUrl, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
  };

  const base: Record<string, string> = {
    name: body.name.trim(),
    comment: body.comment.trim(),
    status: "pending",
  };

  try {
    let res = await insert({ ...base, ip });
    if (!res.ok && res.status === 400) {
      // A 400 with a PostgREST PGRST204 "column does not exist" means the
      // table predates the `ip` column. Retry without it so comments still
      // store; the reconciliation migration restores the column later.
      res = await insert(base);
      if (res.ok) {
        console.warn(
          "[comments] inserted without ip column (running reconcile migration)",
        );
      }
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        "[comments] insert failed",
        JSON.stringify({ status: res.status, body: text.slice(0, 300) }),
      );
      return { ok: false, dbStatus: res.status };
    }
    return { ok: true };
  } catch (err) {
    console.error("[comments] network error", JSON.stringify(fetchFailure(err, restUrl)));
    // Diagnostic: surface the failure class (no host) so storage issues are fixable.
    return { ok: false, reason: fetchFailure(err, undefined, false).slice(0, 240) };
  }
}

export async function GET() {
  if (!configured()) {
    return NextResponse.json({ configured: false, comments: [] });
  }
  const { url, key } = supabase();
  try {
    const res = await fetch(
      `${url}/comments?status=eq.approved&order=created_at.desc&limit=50`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
        next: { revalidate: 30 },
      },
    );
    if (!res.ok) return NextResponse.json({ comments: [] });
    const rows = (await res.json()) as Array<{
      id: string;
      name: string;
      comment: string;
      created_at: string;
    }>;
    const comments = rows.map((row) => ({
      id: row.id,
      name: row.name,
      comment: row.comment,
      createdAt: row.created_at,
    }));
    return NextResponse.json({ configured: true, comments });
  } catch {
    return NextResponse.json({ configured: true, comments: [] });
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (await rateLimited(ip, 4, 60 * 60 * 1000, "comments")) {
    return NextResponse.json(
      { error: "Too many comments. Try again later." },
      { status: 429 },
    );
  }

  if (!configured()) {
    return NextResponse.json(
      { error: "Comments aren't enabled yet.", configured: false },
      { status: 503 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  if (!isPayload(body)) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  if (!isValid(body)) {
    return NextResponse.json({ error: "Validation failed." }, { status: 422 });
  }

  const stored = await storeComment(body, ip);
  if (!stored.ok) {
    const hint = stored.reason
      ? ` (db: ${stored.reason})`
      : stored.dbStatus
        ? ` (db: ${stored.dbStatus})`
        : "";
    return NextResponse.json(
      { error: `Comment couldn't be stored right now.${hint}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, pending: true });
}
