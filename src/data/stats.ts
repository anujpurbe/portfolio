import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";

// Central source of truth for homepage statistics.
// Project and certification counts are derived from their data files.
// Hardcoded values are flagged TODO: VERIFY until confirmed by the user.
export const stats = {
  projects: projects.length,
  problemsSolved: 100, // TODO: VERIFY — total algorithmic problems solved
  certificates: certifications.length,
  cgpa: 8.6, // TODO: VERIFY — latest term CGPA (user-provided)
} as const;
