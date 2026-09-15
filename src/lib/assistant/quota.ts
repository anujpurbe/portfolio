import { Redis } from "@upstash/redis";
import {
  DAILY_USER_AI_LIMIT,
  DAILY_USER_WINDOW_MS,
  GLOBAL_DAILY_AI_BUDGET,
} from "./config";

// Per-visitor daily Gemini quota + global daily Gemini budget.
//
// Atomic check-and-increment so concurrent serverless instances can never let
// a visitor overshoot their daily allowance or the site overshoot the global
// budget. Uses Upstash Redis when configured (recommended on serverless), else
// falls back to a per-instance in-memory bucket (best-effort only).
//
// IMPORTANT: only Gemini-eligible requests touch these counters. Deterministic
// routes (portfolio lookup, calculator, datetime, weather) consume zero quota.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const dayKey = () => new Date().toISOString().slice(0, 10);

function redis(): Redis | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    return new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
  } catch {
    return null;
  }
}

type DailyUsage = {
  allowed: boolean;
  visitorUsed: number;
  globalUsed: number;
};

// INCR + EXPIRE on first hit, checks both limits before consuming.
const ATOMIC_SCRIPT = `
local v = tonumber(redis.call('GET', KEYS[1]) or '0')
local g = tonumber(redis.call('GET', KEYS[2]) or '0')
if v >= tonumber(ARGV[2]) or g >= tonumber(ARGV[3]) then
  return {-1, v, g}
end
local nv = redis.call('INCR', KEYS[1])
if nv == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
local ng = redis.call('INCR', KEYS[2])
if ng == 1 then redis.call('EXPIRE', KEYS[2], ARGV[1]) end
return {nv, ng}
`;

async function redisDailyUsage(r: Redis, visitorKey: string, globalKey: string): Promise<DailyUsage> {
  const ttlSeconds = Math.ceil(DAILY_USER_WINDOW_MS / 1000);
  const res = (await r.eval(
    ATOMIC_SCRIPT,
    [visitorKey, globalKey],
    [String(ttlSeconds), String(DAILY_USER_AI_LIMIT), String(GLOBAL_DAILY_AI_BUDGET)] as unknown[],
  )) as number[];
  const [v, g] = Array.isArray(res) ? res : [0, 0];
  return {
    allowed: (v ?? 0) >= 0,
    visitorUsed: Math.max(v ?? 0, 0),
    // Guard against the -1 sentinel hiding the real global count.
    globalUsed: (v ?? 0) >= 0 ? (g ?? 0) : -1,
  };
}

// Best-effort in-memory fallback (per serverless instance). Mirrors the state
// of the Lua script so behavior is consistent when Redis is absent.
const memStore = new Map<string, { count: number; expires: number }>();

function memAdd(key: string, windowMs: number): number {
  const now = Date.now();
  const bucket = memStore.get(key);
  if (!bucket || bucket.expires <= now) {
    memStore.set(key, { count: 1, expires: now + windowMs });
    return 1;
  }
  bucket.count += 1;
  return bucket.count;
}

function memDailyUsage(visitorKey: string, globalKey: string): DailyUsage {
  const visitorUsed = memAdd(visitorKey, DAILY_USER_WINDOW_MS);
  const globalUsed = memAdd(globalKey, DAILY_USER_WINDOW_MS);
  const blocked = visitorUsed > DAILY_USER_AI_LIMIT || globalUsed > GLOBAL_DAILY_AI_BUDGET;
  // Undo the over-limit increment so the counter reflects calls we actually allow.
  if (blocked) {
    const v = memStore.get(visitorKey);
    if (v && v.count > 0) v.count -= 1;
    const g = memStore.get(globalKey);
    if (g && g.count > 0) g.count -= 1;
  }
  return {
    allowed: !blocked,
    visitorUsed: visitorUsed - (visitorUsed > DAILY_USER_AI_LIMIT ? 1 : 0),
    globalUsed: globalUsed - (globalUsed > GLOBAL_DAILY_AI_BUDGET ? 1 : 0),
  };
}

export async function consumeAiQuota(ip: string): Promise<DailyUsage> {
  const date = dayKey();
  const visitorKey = `assistant:ai-daily:visitor:${ip}:${date}`;
  const globalKey = `assistant:ai-daily:global:${date}`;
  const r = redis();
  if (r) return redisDailyUsage(r, visitorKey, globalKey);
  return memDailyUsage(visitorKey, globalKey);
}