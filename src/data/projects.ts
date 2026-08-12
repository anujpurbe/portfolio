import type { Project } from "@/lib/types";

export const projects: Project[] = [
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
    results:
      "100+ algorithmic problems solved, with implementations spanning stacks, queues, linked lists, trees, and recursion.",
    lessons:
      "Optimization is only meaningful after correctness — profile first, optimize second.",
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
    results:
      "A working relational schema and query set, with structured data modeling that measurably simplified query logic.",
    lessons:
      "Schema design decisions are the difference between a query that reads cleanly and one that fights you.",
  },
];
