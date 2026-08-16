import { NextResponse } from "next/server";
import { isAdminSession, isSameOrigin } from "@/lib/admin";

export const dynamic = "force-dynamic";

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

const VALID_STATUS = new Set([
  "new",
  "read",
  "replied",
  "pending",
  "approved",
  "rejected",
]);
const VALID_TABLES = new Set(["contact_messages", "comments"]);

export async function GET(request: Request) {
  if (!isAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!configured()) {
    return NextResponse.json({ configured: false });
  }

  const { url, key } = supabase();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };

  try {
    const [messagesRes, commentsRes] = await Promise.all([
      fetch(`${url}/contact_messages?order=created_at.desc&limit=100`, { headers }),
      fetch(
        `${url}/comments?order=created_at.desc&limit=200`,
        { headers },
      ),
    ]);

    const messages = messagesRes.ok ? await messagesRes.json() : [];
    const comments = commentsRes.ok ? await commentsRes.json() : [];

    return NextResponse.json({ configured: true, messages, comments });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the database." },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!isAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!configured()) {
    return NextResponse.json({ configured: false });
  }

  const body: unknown = await request.json().catch(() => null);
  const payload =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : null;
  const table = payload?.table;
  const id = payload?.id;
  const status = payload?.status;

  if (
    typeof table !== "string" ||
    !VALID_TABLES.has(table) ||
    typeof id !== "string" ||
    typeof status !== "string" ||
    !VALID_STATUS.has(status)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { url, key } = supabase();
  try {
    const res = await fetch(`${url}/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Update failed." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Update failed." },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!isAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!configured()) {
    return NextResponse.json({ configured: false });
  }

  const body: unknown = await request.json().catch(() => null);
  const payload =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : null;
  const table = payload?.table;
  const id = payload?.id;

  if (
    typeof table !== "string" ||
    !VALID_TABLES.has(table) ||
    typeof id !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { url, key } = supabase();
  try {
    const res = await fetch(`${url}/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Delete failed." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Delete failed." },
      { status: 502 },
    );
  }
}
