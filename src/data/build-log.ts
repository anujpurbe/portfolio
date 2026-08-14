// Precise engineering changelog, sourced from the real git history of this
// repository and its deployment timeline. Nothing here is invented — hashes
// and dates come from `git log`, deployment facts from Vercel.
export type BuildLogCategory =
  | "Architecture"
  | "UI"
  | "Features"
  | "Data"
  | "Polish"
  | "Ops"
  | "Deploy";

export type BuildLogEntry = {
  date: string;
  category: BuildLogCategory;
  title: string;
  note: string;
  hash?: string;
};

const REPO = "https://github.com/anujpurbe/portfolio";

export const buildLog: BuildLogEntry[] = [
  {
    date: "2026-08-13",
    category: "Deploy",
    title: "Production deployment",
    note: "First production deploy to Vercel — live at anuj-purbe-portfolio.vercel.app with all routes verified 200.",
  },
  {
    date: "2026-08-13",
    category: "Data",
    title: "Pin verified values",
    note: "Confirmed numbers (CGPA 8.60, 3 of 8 semesters, Semester III subjects) replace placeholders; unverified counts stay flagged.",
    hash: "d5ca236",
  },
  {
    date: "2026-08-13",
    category: "Polish",
    title: "Premium audit round",
    note: "Academic journey, contact fallback, centralized data, refined hero and system diagram, section spacing.",
    hash: "e76e3c4",
  },
  {
    date: "2026-08-13",
    category: "Features",
    title: "Stats, skills ring, journal, comments, admin",
    note: "Interactive skills ring, animated stats, learning journey, moderated comments, and an admin panel.",
    hash: "75f49f7",
  },
  {
    date: "2026-08-13",
    category: "Data",
    title: "Live data + production fixes",
    note: "Interactive demos, live GitHub/LeetCode data with honest fallbacks, and production hardening.",
    hash: "e8c51b0",
  },
  {
    date: "2026-08-12",
    category: "Architecture",
    title: "Build the portfolio site",
    note: "Structure the app: content model, sections, theming, and responsive layout on Next.js + Tailwind v4.",
    hash: "6fb854b",
  },
];

export function commitUrl(hash: string) {
  return `${REPO}/commit/${hash}`;
}
