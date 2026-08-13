import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    title: "Hiingers — Emergency Resource Negotiation",
    slug: "hiingers",
    description:
      "A multi-agent negotiation platform that reallocates scarce hospital resources — ORs, ICU beds, staff, equipment — in minutes during mass-casualty events, using transparent, explainable AI agents.",
    category: "Full Stack · Multi-Agent AI",
    technologies: ["Python", "FastAPI", "TypeScript", "React", "WebSocket", "Docker"],
    github: "https://github.com/anujpurbe/Hiingers",
    demo: "https://hiingers.vercel.app",
    status: "in-progress",
    featured: true,
    problem:
      "During emergencies, hospitals can't reallocate scarce resources (ORs, ICU beds, staff) fast enough, and decisions are hard to justify afterward.",
    approach:
      "Every resource is an autonomous agent that bids on incoming patient cases using a transparent multi-criteria scoring function; a fairness-aware coordinator resolves rounds with greedy-augmenting matching and anti-starvation aging.",
    architecture:
      "Python/FastAPI backend (uvicorn) with a real-time WebSocket feed, React frontend, Docker Compose orchestration, and a dependency graph that detects when a reallocation would destabilize other resources.",
    challenges:
      "Balancing fairness and speed across negotiation rounds, and making every allocation fully explainable end to end.",
    solutions:
      "A transparent scoring breakdown for every decision, dependency-graph safeguards, and a live bid-by-bid WebSocket feed so nothing is a black box.",
    results:
      "Live demo deployed on Vercel with a working multi-agent negotiation loop and per-decision explainability.",
    lessons:
      "Explainability isn't a feature — it's the contract users trust.",
    media: {
      cover: "/projects/hiingers/cover.webp",
    },
  },
  {
    title: "Atomic Endurance — Battery Research",
    slug: "atomic-endurance",
    description:
      "A next-generation energy storage concept designed to deliver higher energy density, longer lifespan, and safer power systems using advanced materials and nanotechnology.",
    category: "Energy Research · Web",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/anujpurbe/Atomic-Battery-Endurance-Analysis",
    demo: "https://anujpurbe.github.io/Atomic-Battery-Endurance-Analysis/",
    status: "completed",
    featured: true,
    problem:
      "Conventional batteries cap out on energy density and lifespan — the research goal is a safer, longer-lived storage concept.",
    approach:
      "Explored advanced-materials and nanotech directions, and presented the concept as an interactive research site with clear engineering arguments.",
    architecture:
      "A self-contained static web experience built with plain HTML, CSS, and JavaScript, deployed via GitHub Pages.",
    challenges:
      "Turning a research concept into a web presentation that stays rigorous without drowning in jargon.",
    solutions:
      "Interactive, visual explanations that let the engineering speak on its own terms.",
    results:
      "A published, navigable research concept site — live on GitHub Pages.",
    lessons:
      "Presenting an idea clearly is an engineering skill too.",
    media: {
      cover: "/projects/atomic-endurance/cover.webp",
    },
  },
  {
    title: "FoodieHub — Food Ordering Website",
    slug: "foodiehub",
    description:
      "A modern food-ordering web app inspired by Swiggy and Zomato: browse menus, manage a cart, and check out — with Firebase auth, dark mode, and PWA support.",
    category: "Full Stack · Web App",
    technologies: ["HTML", "CSS", "JavaScript", "Firebase", "PWA"],
    github: "https://github.com/anujpurbe/FoodieHub-Food-Ordering-Website",
    demo: "https://anujpurbe.github.io/FoodieHub-Food-Ordering-Website/",
    status: "completed",
    featured: true,
    problem:
      "Build a full ordering flow — menu → cart → checkout — the way real food platforms do.",
    approach:
      "Implemented a Swiggy-style cart with increment/decrement controls, a floating cart bar, and a dedicated cart page, backed by Firebase authentication and hosting.",
    architecture:
      "HTML/CSS/JS front end with a localStorage-backed cart system and Firebase Auth; deployable as an installable PWA via Firebase Hosting.",
    challenges:
      "Keeping cart state consistent across navigation and across sessions.",
    solutions:
      "LocalStorage-driven cart persistence with a floating cart bar for constant feedback.",
    results:
      "A live, installable ordering site on GitHub Pages with full menu → cart → checkout flow.",
    lessons:
      "The cart is the heart of an ordering app — every design decision orbits it.",
    media: {
      cover: "/projects/foodiehub/cover.webp",
    },
  },
  {
    title: "This Portfolio",
    slug: "portfolio",
    description:
      "The site you're on — a premium, animated engineering portfolio built in public: Next.js, TypeScript, Tailwind CSS v4, Motion, with live GitHub/LeetCode data and interactive technical demos.",
    category: "Full Stack · Engineering Portfolio",
    technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Motion"],
    github: "https://github.com/anujpurbe/portfolio",
    status: "completed",
    featured: true,
    problem:
      "A portfolio that demonstrates engineering judgment — proof over claims — and stays fast and accessible.",
    approach:
      "Data-driven sections, live GitHub/LeetCode stats with honest fallbacks, interactive visualizations, and a full build log written up in the journal.",
    architecture:
      "App Router + RSC sections, server-side data fetching with caching, Supabase-backed contact/comments with graceful degradation, and Motion for animation — all reduced-motion aware.",
    challenges:
      "Fighting Vercel's static-build misdetection that shipped only /public — every route returned 404.",
    solutions:
      "Pinned the project's framework to Next.js via the Vercel API and re-verified every route end to end.",
    results:
      "A production portfolio live at anuj-purbe-portfolio.vercel.app, all routes returning 200.",
    lessons:
      "Deployment config is part of the code — verify what actually shipped, not just what built.",
    media: {
      cover: "/projects/portfolio/cover.webp",
    },
  },
  {
    title: "DSA & Algorithm Implementations",
    slug: "dsa-algorithms",
    description:
      "Implemented stacks, queues, linked lists, trees, and recursion-based algorithms in Java; solved 100+ algorithmic problems with a focus on optimization and complexity analysis.",
    category: "Computer Science · Data Structures & Algorithms",
    technologies: ["Java", "OOP"],
    github: "https://github.com/anujpurbe",
    status: "completed",
    featured: true,
    problem:
      "Deep, transferable fluency in data structures — the foundation of every efficient system.",
    approach:
      "Implemented core data structures from scratch in Java and practiced pattern-based problem solving, always documenting time and space complexity.",
    architecture:
      "A growing library of standalone Java implementations: stacks, queues, linked lists, trees, and recursion patterns. Each implementation is small, tested, and annotated with complexity.",
    results:
      "100+ algorithmic problems solved, with implementations spanning stacks, queues, linked lists, trees, and recursion.",
    lessons:
      "Optimization is only meaningful after correctness — profile first, optimize second.",
    visualization: "dsa",
    media: {
      cover: "/projects/dsa/cover.webp",
      screenshots: ["/projects/dsa/screenshot-1.webp"],
    },
  },
  {
    title: "Relational Database Mini Project",
    slug: "sql-database",
    description:
      "Designed a normalized relational schema and wrote SQL queries using JOIN, GROUP BY, and aggregation; improved query efficiency through structured data modeling.",
    category: "Backend · Databases",
    technologies: ["MySQL", "SQL"],
    github: "https://github.com/anujpurbe",
    status: "completed",
    featured: true,
    problem:
      "Prove that I can turn an ambiguous real-world problem into a clean, normalized data model.",
    approach:
      "Designed a normalized relational schema, then wrote and refined SQL queries that exercise JOIN, GROUP BY, and aggregation semantics.",
    architecture:
      "A normalized schema (users, orders, products, payments) with clear foreign keys, plus a query set demonstrating JOIN, GROUP BY, and aggregation semantics.",
    results:
      "A working relational schema and query set, with structured data modeling that measurably simplified query logic.",
    lessons:
      "Schema design decisions are the difference between a query that reads cleanly and one that fights you.",
    visualization: "database",
    media: {
      cover: "/projects/database/cover.webp",
      screenshots: ["/projects/database/screenshot-1.webp"],
    },
  },
];
