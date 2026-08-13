# Anuj Purbe — Portfolio

A fast, fully-responsive engineering portfolio for Anuj Purbe, a computer
engineering undergraduate at Amrita Vishwa Vidyapeetham. Built with Next.js
(App Router), TypeScript, Tailwind CSS v4, and Motion.

Live at **https://anuj-purbe-portfolio.vercel.app**

## Highlights

- **Honest data, never invented** — every claim on the site is either
  user-verified or clearly marked `TODO: VERIFY` in the source.
- **Live GitHub & LeetCode data** — real API responses with graceful
  "unavailable" fallbacks when a service can't be reached (no stale numbers).
- **Evidence-backed certificates** — eight certificates with first-page
  thumbnail previews, an in-page PDF viewer, and Download buttons.
- **Moderated comments** — Supabase-backed, rate-limited, honeypot-protected;
  comments only appear after approval.
- **Contact form** — server-side validation, per-IP rate limiting, honeypot,
  stored in Supabase and/or emailed via EmailJS; falls back to `mailto:` when
  no backend is configured.
- **Precise build log** — the homepage changelog is generated from the real
  git history of this repository (real hashes, real dates).
- **ask://anuj** — an AI portfolio assistant in the hero. Grounded in the real
  data files, it answers questions, returns rich result cards, and navigates
  the site (scroll targets + external links, all whitelisted). Works without
  an AI key via a deterministic local engine.
- Light/dark theme, reduced-motion aware, subtle custom cursor (faint accent
  ring follower; auto-disabled on touch and reduced motion).

## Stack

- **Next.js 16** (App Router, React Server Components, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Motion** (animations, `prefers-reduced-motion` aware)
- **MDX** (journal content via `@next/mdx`)
- **Supabase** (optional — comments, contact storage, admin)
- **EmailJS** (optional — contact email delivery)
- Package manager: **pnpm**

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev         # development server
pnpm build       # production build
pnpm start       # serve the production build
pnpm lint        # ESLint
pnpm typecheck   # tsc --noEmit
```

## Configuration

Copy `.env.example` to `.env.local` and fill in what you have. The site
degrades gracefully when keys are missing — sections show honest
"unavailable" states instead of stale or fake data.

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub section | Yes |
| `GITHUB_TOKEN` | Contribution heatmap + trend (GraphQL, public read PAT) | No |
| `NEXT_PUBLIC_LEETCODE_USERNAME` | LeetCode stats | No |
| `AI_API_KEY` | ask://anuj — enables the AI-powered answers | No |
| `AI_BASE_URL` | OpenAI-compatible endpoint (default `https://api.openai.com/v1`) | No |
| `AI_MODEL` | Model name (default `gpt-4o-mini`) | No |
| `AI_TIMEOUT_MS` | AI request timeout (default `15000`) | No |
| `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID` / `EMAILJS_PUBLIC_KEY` | Contact email delivery | One channel required for the form |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Contact storage + comments + admin | One channel required for the form |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | Admin panel at `/admin` | No |

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run everything in `supabase/schema.sql`. This
   creates the `messages` and `comments` tables (with indexes and status
   checks). Both tables keep RLS enabled — the app only touches them
   server-side with the service role key, which bypasses RLS.
3. Copy the project URL and the **service role** key into
   `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.

> The service role key bypasses RLS and must only ever be used on the server.
> It is never exposed to the browser — API routes read it from the
> environment at request time.

### Getting the GITHUB_TOKEN

The contribution heatmap uses the GraphQL API. Create a classic personal
access token with the `read:user` and `repo` (or `public_repo`) scopes and
set it as `GITHUB_TOKEN`. Without it the heatmap shows an honest
"unavailable" card instead of fake data.

### ask://anuj

The hero assistant posts to `POST /api/ask` with `{ message }`. The route
rate-limits per IP (12/min), validates the input (≤ 400 chars), and answers
from two grounded sources:

1. **AI mode** — if `AI_API_KEY` is set, an OpenAI-compatible chat completions
   call returns a strict JSON structure (`{ answer, actions, results }`). The
   server validates every action against a whitelist and resolves every result
   id against the real portfolio data files, so the assistant cannot invent
   links or facts.
2. **Local mode** — without a key (or when the AI call fails), a deterministic
   keyword/intent engine answers from the same data files, so the assistant
   always works.

The model prompt is injected with a prompt-injection guard, and the answer is
bounded. The knowledge source of truth is `src/data/`. The AI key is
server-side only and never reaches the browser.

## Architecture

```
src/
  app/          Routes (/, /admin, /journal, /projects/[slug]) + API handlers
  components/   Section components and UI primitives
  content/journal/  MDX journal entries
  data/         All site content + build-log changelog
  lib/          Types, data-fetching helpers, auth, rate limiting, ask engine
supabase/
  schema.sql    Backend tables (messages, comments)
public/
  certificates/ Original certificate PDFs + thumbs/ (first-page webp previews)
  images/       Profile photo (webp)
  resume/       Resume PDF
```

### Adding a certificate

1. Put the original PDF in `public/certificates/<slug>.pdf`.
2. Generate a thumbnail from its first page:
   `pdftoppm -f 1 -l 1 -r 120 -png public/certificates/<slug>.pdf /tmp/thumb && python3 -c "...resize & save webp to public/certificates/thumbs/<slug>.webp..."`
3. Add the entry to `src/data/certifications.ts` (title, issuer if known,
   date, description, thumbnail, preview, file).

## Contact form

POST `/api/contact` with `{ from_name, reply_to, subject, message }`. The
handler validates server-side, rate-limits per IP (5/hour), and includes a
honeypot field. If Supabase keys are set, messages are stored in the
`messages` table with `status = 'new'` (the database is the source of truth
for the admin panel); if EmailJS keys are set, they're emailed too. At least
one channel must be configured. When nothing is configured, the client falls
back to `mailto:` so visitors can always reach the owner.

## Comments

POST `/api/comments` with `{ name, comment }` (plus a hidden honeypot). New
comments are stored with `status = 'pending'` and only appear on the site
after approval in the admin panel — never published automatically.
Rate-limited per IP.

## Admin panel

At `/admin` (not linked from the UI). Sign in with `ADMIN_PASSWORD`. It lists
contact `messages` (mark `new` → `read` → `replied`) and `comments`
(approve/unpublish for moderation). Requires the Supabase keys and a session
— the session token is an HMAC of the password stored in an httpOnly cookie;
the raw password is never exposed to the browser.

## Deploy on Vercel

The repository deploys as a Next.js app. Set the environment variables above
in the Vercel project settings, then push to `main` (or run
`npx vercel --prod`). Live at https://anuj-purbe-portfolio.vercel.app.
