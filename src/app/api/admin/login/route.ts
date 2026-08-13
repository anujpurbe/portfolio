import { NextResponse } from "next/server";
import {
  adminCookieName,
  adminSessionToken,
  validAdminPassword,
} from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
