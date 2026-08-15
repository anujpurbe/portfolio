// Shared rate limiter.
//
// Prefers Upstash Redis so limits hold globally across all serverless
// instances. When UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not
// configured it falls back to an in-memory fixed-window limiter, which on
// serverless platforms (Vercel) is per-instance and therefore only a
// best-effort guard. Keys are namespaced per endpoint so one route's traffic
// doesn't exhaust another route's allowance.
import { Redis } from "@upstash/redis";

type Bucket = { times: number[] };

const store = new Map<string, Bucket>();

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function redis(): Redis | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    return new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
  } catch {
    return null;
  }
}

export function clientIp(request: Request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

async function redisLimited(
  r: Redis,
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const windowKey = Math.floor(Date.now() / windowMs);
  const redisKey = `rl:${key}:${windowKey}`;
  try {
    const count = await r.incr(redisKey);
    if (count === 1) {
      await r.expire(redisKey, Math.ceil(windowMs / 1000));
    }
    return count > limit;
  } catch {
    return false;
  }
}

export async function rateLimited(
  ip: string,
  limit = 5,
  windowMs = 60 * 60 * 1000,
  namespace = "default",
) {
  if (ip === "unknown") return true;
  const key = `${namespace}:${ip}`;
  const r = redis();
  if (r) return redisLimited(r, key, limit, windowMs);
  return memLimited(key, limit, windowMs);
}

function memLimited(key: string, limit: number, windowMs: number): boolean {
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
