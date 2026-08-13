import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "portfolio_admin";

function tokenFor(password: string) {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "portfolio-admin";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export function validAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(tokenFor(password));
  const b = Buffer.from(tokenFor(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function adminSessionToken() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return "";
  return tokenFor(expected);
}

export function isAdminSession(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const cookies = (request.headers.get("cookie") ?? "")
    .split(";")
    .map((c) => c.trim().split("="))
    .filter(([key]) => key === COOKIE_NAME)
    .map(([, value]) => decodeURIComponent(value ?? ""));
  if (cookies.length === 0) return false;
  const wanted = Buffer.from(adminSessionToken());
  return cookies.some((value) => {
    const given = Buffer.from(value);
    return given.length === wanted.length && timingSafeEqual(given, wanted);
  });
}
