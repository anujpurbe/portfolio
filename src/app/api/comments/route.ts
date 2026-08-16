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

async function storeComment(body: CommentPayload, ip: string) {
  const { url, key } = supabase();
  try {
    const res = await fetch(`${url}/comments`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: body.name.trim(),
        comment: body.comment.trim(),
        status: "pending",
        ip,
      }),
    });
    return res.ok;
  } catch {
    return false;
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
  if (!stored) {
    return NextResponse.json(
      { error: "Comment couldn't be stored right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, pending: true });
}
