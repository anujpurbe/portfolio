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
      "During mass-casualty events, hospitals have to reallocate scarce resources — ORs, ICU beds, staff, equipment — under time pressure, usually through phone calls and manual coordination. Decisions are slow and hard to audit after the fact.",
    approach:
      "Every resource is modeled as an autonomous agent that bids on incoming patient cases using a transparent multi-criteria scoring function. A fairness-aware coordinator resolves each bidding round using greedy-augmenting matching with anti-starvation aging, so no case gets perpetually outbid.",
    architecture:
      "Python/FastAPI backend (uvicorn) with a real-time WebSocket feed, React frontend, Docker Compose orchestration, and a dependency graph that detects when a reallocation would destabilize other resources.",
    stackWhy: [
      "FastAPI — async-friendly for handling concurrent bidding rounds over WebSocket",
      "WebSocket — real-time bid updates instead of polling, since negotiation rounds need to resolve in seconds",
      "React + TypeScript — frontend for visualizing live negotiation state",
      "Docker — consistent local/deploy environment for the multi-service setup",
    ],
    challenges:
      "Balancing fairness and speed across negotiation rounds, and making every allocation fully explainable end to end.",
    solutions:
      "A transparent scoring breakdown for every decision, dependency-graph safeguards, and a live bid-by-bid WebSocket feed so nothing is a black box.",
    results:
      "Live demo deployed on Vercel with a working multi-agent negotiation loop and per-decision explainability (every allocation decision shows the scoring breakdown that produced it).",
    lessons:
      "Explainability isn't a feature — it's the contract users trust. A hospital coordinator won't act on a black-box allocation during an emergency; showing why an agent won a bid is what makes the system usable, not just functional.",
    media: {
      cover: "/projects/hiingers/cover.webp",
      screenshots: ["/projects/hiingers/screenshot-1.png"],
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
      "Battery degradation and safety are usually explained in dense academic papers that aren't accessible to someone trying to understand why next-gen battery materials matter, not just that they exist.",
    approach:
      "Researched advanced-materials and nanotechnology directions for higher energy density and safer power systems, then built an interactive site to present the concept with clear engineering arguments rather than a static writeup — using data visualizations to walk through degradation curves and capacity fade over charge cycles.",
    architecture:
      "A self-contained static web experience built with plain HTML, CSS, and JavaScript, deployed via GitHub Pages.",
    stackWhy: [
      "HTML/CSS/JavaScript — kept deliberately framework-free to keep the research site lightweight and fast to load on GitHub Pages",
    ],
    challenges:
      "Turning a research concept into a web presentation that stays rigorous without drowning in jargon.",
    solutions:
      "Interactive, visual explanations that let the engineering speak on its own terms.",
    results:
      "A published, navigable research concept site — live on GitHub Pages.",
    lessons:
      "Presenting an idea clearly is an engineering skill too — a correct technical argument that's hard to follow doesn't move anyone, including reviewers.",
    media: {
      cover: "/projects/atomic-endurance/cover.webp",
      screenshots: ["/projects/atomic-endurance/screenshot-1.png"],
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
      "Wanted to understand the full technical shape of a real ordering flow — auth, cart state, checkout — rather than a static product listing page, using Swiggy/Zomato as the interaction model.",
    approach:
      "Built a Swiggy-style cart with increment/decrement controls, a floating cart bar that persists across pages, and a dedicated cart page — backed by Firebase for authentication and hosting, with dark mode and PWA support for installability.",
    architecture:
      "HTML/CSS/JS front end with a localStorage-backed cart system and Firebase Auth; deployable as an installable PWA via Firebase Hosting.",
    stackWhy: [
      "Firebase Auth — fastest path to real user accounts without standing up a custom backend",
      "PWA — installable, offline-capable experience without a native app build",
    ],
    challenges:
      "Keeping cart state consistent across navigation and across sessions.",
    solutions:
      "LocalStorage-driven cart persistence with a floating cart bar for constant feedback.",
    results:
      "A live, installable ordering site on GitHub Pages with full menu → cart → checkout flow.",
    lessons:
      "The cart is the heart of an ordering app — every design decision, from navigation to page transitions, ends up orbiting cart state, because it's the one piece of data that has to stay consistent everywhere.",
    media: {
      cover: "/projects/foodiehub/cover.webp",
      screenshots: ["/projects/foodiehub/screenshot-1.png"],
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
    role: "Solo — design, build, content, and deployment",
    timeline: "Aug 2026 – present (actively maintained)",
    statusNote: "Actively maintained — new sections and journal entries ship regularly.",
    problem:
      "Wanted a portfolio that demonstrated engineering thinking, not just a list of finished projects — a site where the interactive elements themselves prove the underlying skills (DSA, database design) instead of just describing them.",
    approach:
      "Data-driven sections built from a centralized content model, live GitHub/LeetCode stats with honest fallbacks when the APIs are unavailable, interactive visualizations (binary search stepper, normalized schema explorer, spinning skills ring), and a full engineering log documenting real commits and dates.",
    architecture:
      "App Router + RSC sections, server-side data fetching with caching, Supabase-backed contact/comments with graceful degradation, and Motion for animation — all reduced-motion aware.",
    stackWhy: [
      "Next.js + TypeScript — file-based routing for project/journal pages plus type safety across the content model",
      "Tailwind CSS v4 — fast iteration on visual design without a separate CSS architecture",
      "Motion — the animation library driving the count-up stats and ring interactions",
      "Supabase — backing the comments system and admin moderation panel",
    ],
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
      screenshots: ["/projects/portfolio/screenshot-1.png"],
    },
  },
  {
    title: "DSA & Algorithm Implementations",
    slug: "dsa-algorithms",
    description:
      "Implemented stacks, queues, linked lists, trees, and recursion-based algorithms in Java; solved 100+ algorithmic problems with a focus on optimization and complexity analysis.",
    category: "Computer Science · Data Structures & Algorithms",
    technologies: ["Java", "OOP"],
    github: "https://github.com/anujpurbe/C/tree/main/DSA-1",
    status: "completed",
    featured: true,
    role: "Solo",
    problem:
      "Wanted a structured, from-scratch understanding of core data structures rather than relying on built-in library implementations — and a disciplined habit of analyzing complexity before optimizing.",
    approach:
      "Implemented stacks, queues, linked lists, trees, and recursion-based algorithms from scratch in Java. For each, documented time and space complexity before and after optimization, and solved 100+ problems applying pattern-based problem solving (two pointers, sliding window, DFS/BFS, etc.).",
    architecture:
      "A growing library of standalone Java implementations: stacks, queues, linked lists, trees, and recursion patterns. Each implementation is small, tested, and annotated with complexity.",
    stackWhy: [
      "Java — strict typing and manual collection handling forces a more explicit understanding of what a data structure is actually doing, versus a higher-level language that abstracts it away",
    ],
    metrics: [
      "100+ algorithmic problems solved",
      "Core structures implemented from scratch: stacks, queues, linked lists, trees, recursion",
    ],
    results:
      "100+ algorithmic problems solved, with implementations spanning stacks, queues, linked lists, trees, and recursion.",
    lessons:
      "Optimization is only meaningful after correctness — profile first, optimize second. A fast solution that's wrong is worse than a slow one that's right, because it costs more time to debug later.",
    visualization: "dsa",
    media: {
      cover: "/projects/dsa/cover.webp",
    },
  },
  {
    title: "Relational Database Mini Project",
    slug: "sql-database",
    description:
      "Designed a normalized relational schema and wrote SQL queries using JOIN, GROUP BY, and aggregation; improved query efficiency through structured data modeling.",
    category: "Backend · Databases",
    technologies: ["MySQL", "SQL"],
    status: "completed",
    featured: true,
    role: "Solo",
    problem:
      "Needed hands-on practice designing a schema that holds up under real query patterns — joins, aggregation, grouping — rather than just learning SQL syntax in isolation.",
    approach:
      "Designed a normalized (3NF) relational schema across users, orders, order_items, products, and payments, then wrote and refined SQL queries exercising JOIN, GROUP BY, and aggregation semantics against it.",
    architecture:
      "A normalized schema (users, orders, order_items, products, payments) with clear foreign keys, plus a query set demonstrating JOIN, GROUP BY, and aggregation semantics.",
    stackWhy: [
      "MySQL — widely-used relational engine, good fit for practicing standard SQL without vendor-specific syntax detours",
    ],
    metrics: [
      "5-table 3NF schema (users, orders, order_items, products, payments)",
      "Query set exercising JOIN, GROUP BY, and aggregation",
    ],
    results:
      "A working relational schema and query set, with structured data modeling that measurably simplified query logic (see the normalization journal post for the specific before/after).",
    lessons:
      "Schema design decisions are the difference between a query that reads cleanly and one that fights you — most SQL pain is a modeling problem wearing a syntax costume.",
    visualization: "database",
    media: {
      cover: "/projects/database/cover.webp",
    },
  },
];
