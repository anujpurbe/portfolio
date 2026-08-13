const store = new Map<string, number[]>();

export function clientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function rateLimited(
  ip: string,
  limit = 5,
  windowMs = 60 * 60 * 1000,
) {
  if (ip === "unknown") return true;
  const now = Date.now();
  const hits = (store.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    store.set(ip, hits);
    return true;
  }
  hits.push(now);
  store.set(ip, hits);
  return false;
}
