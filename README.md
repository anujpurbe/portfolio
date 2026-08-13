# Anuj Purbe — Portfolio

A fast, fully-responsive portfolio for Anuj Purbe, a computer engineering undergraduate. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and Motion. Features light/dark theme, a data-driven contact form, and live GitHub/LeetCode data with honest fallbacks.

## Stack

- **Next.js 16** (App Router, RSC, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Motion** (animations, reduced-motion aware)
- **MDX** (journal content)

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # ESLint
pnpm typecheck # tsc --noEmit
```

## Configuration

Copy `.env.example` to `.env.local` and fill in what you have. The site degrades gracefully when keys are missing — sections show honest "unavailable" states instead of stale or fake data.

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub section | Yes |
| `GITHUB_TOKEN` | Contribution heatmap (GraphQL, public read PAT) | No |
| `NEXT_PUBLIC_LEETCODE_USERNAME` | LeetCode stats | No |
| `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID` / `EMAILJS_PUBLIC_KEY` | Contact via EmailJS | One channel required for the form |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Contact + comments + admin stored in Supabase (`messages`, `comments` tables) | One channel required for the form |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | Admin panel at `/admin` | No |

## Architecture

- `src/app` — routes (`/`, `/admin`, `/journal`, `/projects/[slug]`) and API handlers
- `src/components` — section components and UI primitives (skills ring, project visualizations, hero canvas, custom cursor)
- `src/data` — all site content (profile, projects, skills, education, coding config)
- `src/lib` — types and data-fetching helpers (GitHub, LeetCode, journal, rate limiting, admin auth)
- `src/content/journal` — MDX journal entries
- `public` — static assets (resume, images, project media)

## Contact form

POST `/api/contact` with `{ from_name, reply_to, subject, message }`. The handler validates server-side, rate-limits per IP (5/hour), and includes a honeypot field. If Supabase keys are set, messages are stored in the `messages` table with `status = 'new'` (the database is the source of truth); if EmailJS keys are set, they're emailed. At least one channel must be configured.

## Comments

POST `/api/comments` with `{ name, comment }` (plus a hidden honeypot). New comments are stored with `status = 'pending'` and only appear on the site after a human approves them — they are never published automatically. Rate-limited per IP.

## Admin panel

At `/admin` (not linked from the UI). Sign in with `ADMIN_PASSWORD`. It lists contact `messages` (mark `new` → `read` → `replied`) and `comments` (approve/unpublish for moderation). Requires the Supabase keys and a session — the session token is an HMAC of the password stored in an httpOnly cookie; the raw password is never exposed to the browser.

## Deploy on Vercel

The repository deploys as a Next.js app. Set the environment variables above in the Vercel project settings. Live at https://anuj-purbe-portfolio.vercel.app.
