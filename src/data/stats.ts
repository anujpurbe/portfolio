import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";

// Central source of truth for homepage statistics.
// Certificates is evidence-backed (real PDFs in public/certificates/).
// CGPA is user-confirmed (8.60). Everything else is pending verification —
// nothing is invented.
export const stats = {
  // TODO: VERIFY — derived from the projects file; confirm the final count
  projects: projects.length,
  problemsSolved: 100, // TODO: VERIFY — total algorithmic problems solved
  // Verified — derived from public/certificates/ (8 certificates)
  certificates: certifications.length,
  cgpa: 8.6, // Verified — user-confirmed 8.60
} as const;
