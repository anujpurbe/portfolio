# SEO Architecture

## 1. Purpose

This document explains how `anuj-purbe-portfolio.vercel.app` communicates to
Google (and other engines) that the site is the personal portfolio of **Anuj
Purbe**, and connects it to the same person's existing GitHub, LinkedIn, and
Instagram profiles.

The goal is identity clarity: when someone searches **"Anuj Purbe"**, Google
should understand that *this website* represents the *same real person* as the
profiles already ranking for that name.

> **DEPLOYED ≠ INDEXED ≠ RANKING**
>
> - The site being live on Vercel does **not** mean Google has indexed it.
> - Submitting a sitemap helps discovery but does **not** guarantee indexing.
> - Indexing does **not** guarantee ranking.
> - Ranking #1 cannot be guaranteed.
>
> A custom domain can improve branding and long-term authority, but it is
> **not** a technical requirement for Google to understand the website.

## 2. Current Website Identity

- **Name:** Anuj Purbe
- **Role:** Computer Engineering Undergraduate (Amrita Vishwa Vidyapeetham)
- **Current URL:** `https://anuj-purbe-portfolio.vercel.app/`
- **Verified external profiles (sameAs):**
  - GitHub — `https://github.com/anujpurbe`
  - LinkedIn — `https://www.linkedin.com/in/anuj-purbe`
  - Instagram — `https://www.instagram.com/anujpurbe/`

## 3. Architecture

```
                         ┌──────────────────────────┐
                         │   src/data/site.ts       │
                         │   Single Source of Truth │
                         │  (SITE_URL / name / ...) │
                         └───────────┬──────────────┘
                                     │
                             ┌───────┴────────┐
                             │ src/lib/seo.ts │  derived, centralized
                             └───────┬────────┘  SEO config
                                     │
             ┌───────────────┬───────┼───────────────┬───────────────┐
             │               │       │               │               │
             ▼               ▼       ▼               ▼               ▼
        metadata        JSON-LD    canonical       sitemap        robots
     (layout + page)  (seo/*)      (per-page)      (sitemap.ts)  (robots.ts)
             │               │       │               │               │
             └───────────────┴───────┼───────────────┴───────────────┘
                                     ▼
                            Search Engines
                                     │
                                     ▼
                        Google understands "Anuj Purbe"
                                     │
                         ┌───────────┼───────────┐
                         ▼           ▼           ▼
                      Website     GitHub      LinkedIn
                                     │
                                     ▼
                              Profile / Projects
```

## 4. File Structure

| File | Purpose |
| --- | --- |
| `src/data/site.ts` | **Single source of truth** — `url`, name, socials, photo, SEO strings, verification token |
| `src/lib/seo.ts` | Centralized SEO config derived from `site.ts` (absolute URLs, keywords, OG image, person details) |
| `src/app/layout.tsx` | Root metadata (title template, OG, Twitter, icons, verification), Person JSON-LD |
| `src/app/page.tsx` | Homepage canonical + WebSite JSON-LD |
| `src/app/robots.ts` | `robots.txt` (allows crawling, blocks `/admin` + `/api`, references sitemap) |
| `src/app/sitemap.ts` | `sitemap.xml` (home, journal, journal entries, project pages) |
| `src/app/journal/page.tsx` | Journal listing metadata + canonical |
| `src/app/journal/[slug]/page.tsx` | Entry metadata + BlogPosting JSON-LD |
| `src/app/projects/[slug]/page.tsx` | Project metadata + canonical + per-project OG image |
| `src/app/not-found.tsx` | 404 page with `noindex` |
| `src/components/seo/json-ld.tsx` | Reusable JSON-LD `<script>` renderer |
| `src/components/seo/person-json-ld.tsx` | Schema.org `Person` entity |
| `src/components/seo/website-json-ld.tsx` | Schema.org `WebSite` entity |
| `src/data/profile.ts` | Hero tagline used as person description |
| `src/data/education.ts` | Used for `alumniOf` / `affiliation` structured data |
| `src/data/skills.ts` | Used for `knowsAbout` structured data |

## 5. Centralized SEO Configuration

All SEO values derive from **one** file: `src/data/site.ts`.

The root object is `site`, and the `site.seo` sub-object holds title,
description, keywords, the OG image path, and the Google verification token.

`src/lib/seo.ts` consumes `site` and exports a derived `seo` object plus
helpers (`absoluteUrl`, `personImageUrl`). Changing a value in `site.ts`
propagates to:

- `metadataBase` (layout)
- canonical URLs (per-page `alternates.canonical`)
- Open Graph / Twitter URLs
- sitemap
- robots.txt
- JSON-LD (`Person.url`, `Person.image`, `Person.sameAs`)

### Changing the site URL (future custom domain)

To move to `https://anujpurbe.in/` later, change **only**:

```
// src/data/site.ts
url: "https://anuj-purbe-portfolio.vercel.app",
```

to:

```
// src/data/site.ts
url: "https://anujpurbe.in",
```

Every canonical, OG URL, sitemap entry, robots reference, and JSON-LD URL then
uses the new domain automatically. See §13 for the full Vercel + Search
Console migration checklist.

## 6. Metadata Strategy

Implemented in `src/app/layout.tsx` (root, applies to all routes) and per-page
for journal/project detail pages.

- **title (default):** `Anuj Purbe | CSE Portfolio`
- **title (template):** `%s — Anuj Purbe` — child pages provide their own
  `title` and the template appends the name exactly once.
- **description:** site-level description naming Anuj Purbe, his role, and his
  focus areas.
- **metadataBase:** `https://anuj-purbe-portfolio.vercel.app/` — used to
  resolve all relative URLs and prevent localhost leaking into production
  metadata.
- **canonical:** one per page (home `"/"`, `/journal`, `/journal/[slug]`,
  `/projects/[slug]`) — see §12.
- **keywords:** phishing-era field; harmless, kept for a little extra signal.
- **robots:** `index, follow` on public pages; `noindex` on the 404 page.
- **Open Graph:** title, description, locale `en_US`, absolute image URL, and
  site name.
- **Twitter/X:** `summary_large_image` card with the shared OG image.
- **icons:** `icon.svg` (favicon) + `logo.png` (apple-touch).

## 7. Person Identity Strategy

```
Anuj Purbe  (src/data/site.ts — fullName)
     ↓
website  (canonical https://anuj-purbe-portfolio.vercel.app/)
     ↓
profile image  (/images/profile/anuj-purbe.webp — absolute URL in JSON-LD)
     ↓
sameAs profiles  (GitHub, LinkedIn, Instagram)
     ↓
Google connects "Anuj Purbe" across all of these
```

The `Person` JSON-LD is rendered on every page via the root layout
(`src/components/seo/person-json-ld.tsx`). Its `sameAs` array exactly matches
the social links already displayed on the site (hero + footer), so structured
data and visible page content agree.

## 8. Structured Data

All JSON-LD is rendered server-side with `src/components/seo/json-ld.tsx`.

### Person (`person-json-ld.tsx`)
- Rendered on **every page** (root layout).
- Fields: `name`, `url`, `image` (absolute profile photo), `description`,
  `jobTitle` (from `site.role`), `email`, `sameAs` (the 3 real profiles),
  `alumniOf` (completed institutions from `education.ts` — currently
  Nightingale International School), `affiliation` (Amrita Vishwa
  Vidyapeetham, the in-progress institution), `knowsAbout` (from
  `skills.ts`).
- **Everything is backed by real site data. Nothing is invented.**

### WebSite (`website-json-ld.tsx`)
- Rendered on the **homepage** only.
- Fields: `name`, `url`, `description`.

### BlogPosting (`journal/[slug]/page.tsx`)
- Rendered on each **journal entry** page.
- Fields: `headline`, `description`, `url`, `image` (OG image), dates,
  `author` (Person), `publisher` (Person), `mainEntityOfPage`, keywords.

### Why ProfilePage was not added
The homepage is a single-page portfolio; `Person` + `WebSite` already convey
identity and authorship without redundant markup. Google's primary need is
that this site is *by/for the same Anuj Purbe* as profiles elsewhere — the
`Person` entity covers this.

## 9. Image SEO

### Files
- **Profile photo:** `public/images/profile/anuj-purbe.webp` (800×1000,
  ~96 KB) — descriptive filename, rendered with `next/image`,
  `alt="Portrait of Anuj Purbe"`, `priority` in the hero so it is crawled.
- **OG image:** `public/og-image.png` (1731×909) — centralized path in
  `site.seo.openGraphImage`; used for OG + Twitter large cards. Declared
  width/height in metadata match the real file.
- **Project covers:** `public/projects/<slug>/cover.webp` — rendered with
  `next/image`, `alt="${project.title} cover"`.
- **Screenshots:** `alt="${project.title} screenshot"` with `loading="lazy"`.
- **Certificates:** thumbnails use `alt="${cert.title} certificate..."`.
- **Decorative art / SVG icons:** decorative divs use `aria-hidden="true"`.

### Rules
- Meaningful images: descriptive, specific alt text (never keyword-stuffed).
- Decorative images: `aria-hidden` / empty alt.
- Do **not** rename files that would break the app; current names are already
  descriptive (`anuj-purbe.webp`, slug-based project folders).

## 10. Sitemap

`src/app/sitemap.ts` serves `https://anuj-purbe-portfolio.vercel.app/sitemap.xml`.

Includes:
- Homepage (priority 1.0)
- `/journal` (priority 0.8)
- Each journal entry (priority 0.6)
- Each project detail page (priority 0.7)

All URLs are absolute, derived from `seo.siteUrl`, valid XML, and
never localhost. Private routes (`/admin`, `/api/*`) are **not** included.

## 11. Robots

`src/app/robots.ts` serves `https://anuj-purbe-portfolio.vercel.app/robots.txt`:

```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://anuj-purbe-portfolio.vercel.app/sitemap.xml
```

- Crawlers are **allowed** on all public content.
- `/admin` and `/api` are hidden from crawlers (these are internal/admin
  routes; this is not used as a noindex mechanism for public pages).
- The sitemap is referenced.

## 12. Canonical Strategy

| Page | Canonical |
| --- | --- |
| Home | `https://anuj-purbe-portfolio.vercel.app/` |
| Journal listing | `https://anuj-purbe-portfolio.vercel.app/journal` |
| Journal entry | `https://anuj-purbe-portfolio.vercel.app/journal/<slug>` |
| Project detail | `https://anuj-purbe-portfolio.vercel.app/projects/<slug>` |

- Each page sets `alternates.canonical` relative to `metadataBase`.
- The root layout no longer sets canonical (it would incorrectly cascade to
  every child route).
- Never canonical: localhost, the GitHub repository URL, LinkedIn URL, or a
  future custom domain.

## 13. Adding New Pages

Checklist for a new public page (e.g., a new journal entry or project):

- [ ] Add the new data to the source file (`projects.ts`, journal MDX).
- [ ] It gets a canonical via `generateMetadata` (`alternates.canonical`).
- [ ] Give it a unique `title` (template appends "— Anuj Purbe").
- [ ] Add a `description`.
- [ ] Set OG + Twitter metadata (reuse `seo.openGraphImage`, or supply an
      image/cover page).
- [ ] Confirm it appears in `sitemap.ts` (journal/project loops are automatic).
- [ ] If the page is the main subject of a search (a long article), add
      `BlogPosting` JSON-LD.
- [ ] Verify the page renders `index, follow` robots (no accidental `noindex`).

## 14. Changing Domain (Future Migration)

When ready to move to a custom domain (e.g. `anujpurbe.in`):

1. **Code (this repo):**
   - In `src/data/site.ts`, change `url` to `https://anujpurbe.in`.
   - Commit and push (GH Action deploys automatically).
2. **Vercel:**
   - Add the custom domain in Vercel → Project → Settings → Domains.
   - Configure DNS (A/ALIAS root + CNAME `www`) per Vercel's instructions.
3. **(Optional) Redirect the old URL:**
   - Vercel redirects the old `anuj-purbe-portfolio.vercel.app` if you add it
     back with a redirect, or deploy a 301 in `vercel.json`.
4. **Verify new canonical/robots/sitemap/OG:**
   - `curl https://anujpurbe.in/robots.txt`
   - `curl https://anujpurbe.in/sitemap.xml`
   - Check the homepage `<link rel="canonical">` and `og:url` now say
     `anujpurbe.in`.
5. **Search Console:**
   - Add a **new** property for `https://anujpurbe.in/` (URL prefix).
   - Verify via the HTML tag token (see §15) — the placeholder lives in
     `site.seo.googleSiteVerification`.
   - Submit the new `sitemap.xml`.
   - If the old URL is redirecting 301, Google transfers signals to the new
     property. Re-inspect key URLs (home, `/journal`, major projects).

## 15. Google Search Console — Operational Steps

1. Go to <https://search.google.com/search-console> and sign in with a Google
   account.
2. Click **Add property**.
3. Choose **URL prefix** (recommended over the whole-domain option here,
   since we control an exact Vercel URL).
4. Enter: `https://anuj-purbe-portfolio.vercel.app/`
   (or the custom domain after migration).
5. Choose **HTML tag** verification.
6. Copy the token Google provides, for example
   `google-site-verification: html/abcDEF123...`. Paste **only the value**
   (the part after `google-site-verification: html/`) into:
   ```
   // src/data/site.ts
   seo: {
     ...
     googleSiteVerification: "PASTE_TOKEN_HERE",
   }
   ```
7. Push to `main` (the GH Action deploys).
8. In Search Console click **Verify**.
9. In **Sitemaps**, submit:
   `https://anuj-purbe-portfolio.vercel.app/sitemap.xml`
10. Use **URL Inspection** to paste
    `https://anuj-purbe-portfolio.vercel.app/` and click **Request indexing**.
11. Wait days–weeks; check coverage report and fix any errors ("Discovered —
    currently not indexed", etc.).

## 16. SEO Maintenance

### After any deployment
- [ ] `curl https://anuj-purbe-portfolio.vercel.app/` — title, canonical,
      description, robots meta, JSON-LD present.
- [ ] `curl https://anuj-purbe-portfolio.vercel.app/robots.txt`
- [ ] `curl https://anuj-purbe-portfolio.vercel.app/sitemap.xml`
- [ ] Open Graph debugger (Facebook) / card validator (X) if OG changed.

### When adding a page
- See §13 checklist.

### Monthly
- [ ] Search Console → Coverage: new indexing errors.
- [ ] URL Inspection on the homepage + latest journal entry.
- [ ] Check for broken internal/external links.
- [ ] Review Core Web Vitals (Search Console → Core Web Vitals).
- [ ] Confirm `sameAs` profiles still point here / still belong to you.

### When changing domain
- See §14.

## 17. SEO Safety Rules

**DO:**
- Use only truthful information already on the site.
- Keep structured data synchronized with visible content.
- Keep profile identity consistent (same `sameAs` URLs everywhere).
- Use accurate, descriptive images and alt text.
- Maintain one canonical URL per page.

**DON'T:**
- Keyword-stuff ("Anuj Purbe" only where it reads naturally).
- Hide text or use cloaking.
- Fabricate reviews, awards, follower counts, or organizations.
- Add made-up profiles/accounts to `sameAs`.
- Invent structured data fields.
- Buy backlinks or use link farms.
- Create doorway pages or hundreds of thin pages.
- Promise ranking guarantees.

## 18. Performance & Core Web Vitals Notes

- Fonts load via `next/font/google` (self-hosted, no external render-blocking
  requests).
- The hero profile photo uses `next/image` (responsive, priority).
- GitHub/LeetCode widgets are lazy/async server components with graceful
  fallbacks.
- A page-level `dynamic = "force-dynamic"` on the root layout (in
  `layout.tsx`) means every route is server-rendered on demand. This was
  intentional (fresh GitHub/LeetCode data) but means routes are not statically
  cached; acceptable for a small portfolio, revisit if budget scores matter.