# AI Assistant

Portfolio assistant (`/api/assistant` + `/api/assistant/stream`) with deterministic tools and an optional AI tier.

## Overview

The assistant resolves every query locally first — calculator, date/time, weather (via Open-Meteo), and a rule-based portfolio engine. Only portfolio summarisation and coding questions escalate to Gemini, and only when the per-visitor daily quota and global daily budget have not been exhausted.

## Source map

```
src/lib/assistant/
  config.ts      — limits, cache TTLs, fallback text
  types.ts       — public request/response/result types
  portfolio.ts   — single source of truth, buildPortfolioKnowledge()
  normalize.ts   — action/result sanitisation (shared with Gemini)
  validation.ts  — input shape + MAX_MESSAGE length
  quota.ts       — Upstash-first atomic daily checks + per-visitor counter
  local.ts       — rule-based portfolio engine, export isFallbackResponse
  router.ts      — 6-intent classifyIntent() + deterministic executeRoute()
  models.ts      — server-only config (AI_BASE_URL, AI_MODEL, AI_TIMEOUT_MS overrides)
  prompts.ts     — system prompt + coding system prompt
  gemini.ts      — askAI (JSON) + streamAI (SSE), tool loop, parseStructured
  index.ts       — prepareRequest, answerAssistant, runAssistantStream
  sse.ts         — SSE response helpers

src/lib/assistant/tools/
  types.ts       — ToolDef, ToolResult
  registry.ts    — register/get definitions
  calculator.ts  — safe recursive-descent evaluator
  date-time.ts   — Intl.DateTimeFormat
  weather.ts     — Open-Meteo forecast, Nominatim fallback geocoder
  index.ts       — getToolDefinitions(), executeTool()
```

## Request flow

```
POST /api/assistant          → answerAssistant()  → JSON { answer, actions, results, aiUsed }
POST /api/assistant/stream   → runAssistantStream() → SSE: text → actions → results → done
```

Legacy `/api/ask` + `/api/ask/stream` are thin wrappers with identical contracts; they forward to the same services and exist only for backward compatibility.

### Pipeline

1. **Rate limit** — 5 req/min per IP (Upstash `src/lib/rate-limit.ts`, namespace `assistant`).
2. **Validate** — shape check + `MAX_MESSAGE` (400 chars).
3. **Classify intent** — `classifyIntent(message)` → one of six intents.
4. **Execute route** — deterministic intents return immediately; `PORTFOLIO` and `CODING` return `null` to signal "escalate to AI".
5. **AI tier** (when escalated):
   - `consumeAiQuota(ip)` — atomic Lua check-and-increment: per-visitor `DAILY_USER_AI_LIMIT` (20/day) + global `GLOBAL_DAILY_AI_BUDGET` (300/day).
   - `askAI` / `streamAI` — Gemini 3.6 Flash via OpenAI-compatible endpoint, with tool loop (`MAX_TOOL_ITERATIONS = 2`).
   - Graceful degrade on any failure.

## Intents

| Intent        | Deterministic? | AI-eligible? | Route example                                   |
|---------------|----------------|--------------|------------------------------------------------|
| `calculator`  | yes            | no           | `what is 2+3*4`                                |
| `datetime`    | yes            | no           | `what time is it`                               |
| `weather`     | yes            | no           | `weather in london`                             |
| `portfolio`   | yes (local)    | yes (fallback) | `what projects has anuj built`               |
| `coding`      | no             | yes          | `explain what a binary search is`               |
| `unsupported` | yes (local)    | no           | `what is the meaning of life`                   |

`portfolio` is answered by the rule-based local engine first; only if it returns a fallback does it escalate to AI for summarisation.

## Deterministic tools

All tools are registered in `src/lib/assistant/tools/` and consumed both by the deterministic router and by Gemini's tool loop.

| Tool            | Description                                             |
|-----------------|---------------------------------------------------------|
| `calculate`     | Safe recursive-descent evaluator (supports `^`, `√`)    |
| `get_current_datetime` | Current date/time via `Intl.DateTimeFormat`         |
| `get_weather`   | Open-Meteo forecast; Nominatim fallback geocoder        |

Weather resolves coordinates by name (via Open-Meteo geocoding, falling back to Nominatim), then fetches the forecast. Bare "weather" uses a default location.

## Quota system

All checks live in `src/lib/assistant/quota.ts`.

| Check                | Scope          | Limit         | Storage              |
|----------------------|----------------|---------------|----------------------|
| Rate limit           | per IP         | 5 req/min     | Upstash (namespace)  |
| Daily AI usage       | per visitor    | 20 Gemini calls/day | Upstash atomic Lua |
| Global daily budget  | global         | 300 Gemini calls/day | Upstash atomic Lua |

In-memory fallback is used when Upstash is not configured.

## Environment variables

| Variable          | Required | Description                                              |
|-------------------|----------|----------------------------------------------------------|
| `AI_API_KEY`      | yes      | Gemini / Google AI API key (server-only)                 |
| `AI_BASE_URL`     | no       | Override base URL (default: OpenAI-compatible endpoint)  |
| `AI_MODEL`        | no       | Override model name (default: `gemini-3.6-flash`)        |
| `AI_TIMEOUT_MS`   | no       | Override request timeout (default: `15000`)              |
| `UPSTASH_REDIS_REST_URL`   | no   | Enables persistent Upstash rate-limit + quota            |
| `UPSTASH_REDIS_REST_TOKEN` | no   | (paired with URL)                                        |

## Graceful degradation

When AI is not configured, rate-limited, quota-exhausted, or the upstream API fails:

- Deterministic answers (calculator, datetime, weather, portfolio) are always returned.
- Coding questions display: *"AI mode is temporarily unavailable, but I can still help you explore the portfolio"* with navigation actions.
- Portfolio questions that fall through to AI also degrade with the same notice.
- No error is exposed to the client; the `aiUsed` flag is always `false` in degrade responses.

## Testing

```bash
# Type-check
pnpm exec tsc --noEmit

# Lint
pnpm exec eslint src/lib/assistant src/app/api/assistant

# Smoke tests (requires AI_API_KEY for AI path)
curl -X POST http://localhost:3000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"message":"what is 2+3*4"}'

curl -X POST http://localhost:3000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"message":"weather in london"}'

curl -X POST http://localhost:3000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"message":"explain what a binary search is"}'
```
