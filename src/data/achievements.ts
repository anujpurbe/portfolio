import type { Achievement } from "@/lib/types";

// Central source of truth for achievements.
// Proof is shown when it exists. Items below are user-confirmed facts.
// TODO: VERIFY — awaiting mark sheets / certificates before adding as evidence
export const achievements: Achievement[] = [
  {
    title: "Top 3 in Higher Secondary Education",
    context: "Nightingale International School",
    details: "Graduated with a 4.00 GPA, ranked 3rd in the cohort.",
    year: "2024",
  },
  {
    title: "Organized a School-Wide Talent Show",
    context: "School Event · Lead Organizer",
    details: "Planned and ran a school-wide talent show with 900+ attendees.",
  },
];
