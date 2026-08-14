// In-memory fixed-window rate limiter.
//
// NOTE: on serverless platforms (Vercel) the store is per-instance, so this is
// a best-effort guard against casual abuse, not a hard limit. For a strict,
// globally shared limiter, back this with a Redis store (e.g. Upstash).
// Keys are namespaced per endpoint so one route's traffic doesn't exhaust
// another route's allowance.
type Bucket = { times: number[] };

const store = new Map<string, Bucket>();

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
  namespace = "default",
) {
  if (ip === "unknown") return true;
  const key = `${namespace}:${ip}`;
  const now = Date.now();
  const bucket = store.get(key) ?? { times: [] };
  bucket.times = bucket.times.filter((t) => now - t < windowMs);
  if (bucket.times.length >= limit) {
    store.set(key, bucket);
    return true;
  }
  bucket.times.push(now);
  store.set(key, bucket);
  return false;
}
