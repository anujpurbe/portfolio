import type { Skill } from "@/lib/types";

export const skills: Skill[] = [
  {
    name: "Python",
    category: "Languages",
    usedIn: ["dsa-algorithms", "sql-database"],
    note: "Advanced developer training; used for scripting and problem solving.",
  },
  {
    name: "Java",
    category: "Languages",
    usedIn: ["dsa-algorithms"],
    note: "Core OOP language for DSA implementations.",
  },
  {
    name: "SQL",
    category: "Languages",
    usedIn: ["sql-database"],
    note: "JOINs, GROUP BY, aggregation, schema design.",
  },
  {
    name: "HTML",
    category: "Languages",
    usedIn: [],
    note: "Web fundamentals.",
  },
  {
    name: "CSS",
    category: "Languages",
    usedIn: [],
    note: "Web fundamentals.",
  },
  {
    name: "Data Structures & Algorithms",
    category: "Core CS",
    usedIn: ["dsa-algorithms"],
    note: "Stacks, queues, linked lists, trees, recursion; 100+ problems solved.",
  },
  {
    name: "Object-Oriented Programming",
    category: "Core CS",
    usedIn: ["dsa-algorithms"],
    note: "Encapsulation, inheritance, polymorphism in Java.",
  },
  {
    name: "Complexity Analysis",
    category: "Core CS",
    usedIn: ["dsa-algorithms"],
    note: "Time and space complexity, optimization.",
  },
  {
    name: "Linear Algebra",
    category: "Mathematics",
    usedIn: [],
    note: "Eigenvalues, QR decomposition, orthogonality.",
  },
  {
    name: "MySQL",
    category: "Database",
    usedIn: ["sql-database"],
    note: "Normalized relational schemas, query tuning.",
  },
  {
    name: "Git",
    category: "Tools",
    usedIn: [],
    note: "Version control workflow.",
  },
  {
    name: "VS Code",
    category: "Tools",
    usedIn: [],
    note: "Primary editor.",
  },
];

export const skillCategories: Skill["category"][] = [
  "Languages",
  "Core CS",
  "Mathematics",
  "Database",
  "Tools",
];
