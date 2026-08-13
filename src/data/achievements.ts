import type { Achievement } from "@/lib/types";

// Central source of truth for achievements.
// `verified: false` items need confirmation and proof before they can be
// presented as public evidence — upload mark sheets / certificates in:
//   public/images/achievements/
export const achievements: Achievement[] = [
  {
    title: "Top 3 in Higher Secondary Education",
    context: "Nightingale International School",
    details: "Graduated with a 4.00 GPA, ranked 3rd in the cohort.",
    year: "2024",
    verified: false, // TODO: VERIFY — awaiting mark sheet / certificate
  },
  {
    title: "Organized a School-Wide Talent Show",
    context: "School Event · Lead Organizer",
    details: "Planned and ran a school-wide talent show with 900+ attendees.",
    verified: false, // TODO: VERIFY — awaiting evidence
  },
];
