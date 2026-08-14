import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rate-limit";
import {
  adminCookieName,
  adminSessionToken,
  validAdminPassword,
} from "@/lib/admin";

export const dynamic = "force-dynamic";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  if (rateLimited(clientIp(request), LOGIN_LIMIT, LOGIN_WINDOW_MS, "admin-login")) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const password =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).password
      : null;

  if (typeof password !== "string" || !validAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: adminCookieName(),
    value: adminSessionToken(),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
