export type TechItem = {
  name: string;
  short: string;
  usedIn?: string[];
  note?: string;
};

export const currentStack: TechItem[] = [
  {
    name: "Python",
    short: "PY",
    usedIn: ["hiingers"],
    note: "FastAPI backend work; scripting and problem solving.",
  },
  {
    name: "Java",
    short: "JV",
    usedIn: ["dsa-algorithms"],
    note: "Core OOP language — my DSA implementations live here.",
  },
  {
    name: "TypeScript",
    short: "TS",
    usedIn: ["portfolio", "hiingers"],
    note: "Typed frontend work in Next.js and React tooling.",
  },
  {
    name: "React",
    short: "RC",
    usedIn: ["portfolio"],
    note: "Component model behind this site and my React-based builds.",
  },
  {
    name: "HTML / CSS",
    short: "HT",
    usedIn: ["atomic-endurance", "foodiehub"],
    note: "Semantic markup and responsive styling across my web projects.",
  },
  {
    name: "JavaScript",
    short: "JS",
    usedIn: ["foodiehub", "atomic-endurance"],
    note: "Interactive web features and cart logic in FoodieHub.",
  },
  {
    name: "Git",
    short: "GT",
    note: "Version control for every repo I ship.",
  },
  {
    name: "DSA",
    short: "DS",
    usedIn: ["dsa-algorithms"],
    note: "Stacks, queues, linked lists, trees, recursion — 100+ problems solved.",
  },
  {
    name: "Supabase",
    short: "SB",
    note: "Backend for this site's contact and comments.",
  },
  {
    name: "Claude API",
    short: "CA",
    note: "AI-assisted development workflows.",
  },
];

export const aspiringStack: TechItem[] = [
  { name: "Flask", short: "FL", note: "Lightweight Python web frameworks." },
  { name: "NLP", short: "NL", note: "Language models and text processing." },
  { name: "ML", short: "ML", note: "Machine learning fundamentals." },
  { name: "SQL", short: "SQ", note: "Deeper query optimization and tuning." },
  { name: "Node.js", short: "ND", note: "JavaScript on the server." },
];
