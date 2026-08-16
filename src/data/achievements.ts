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
  {
    title: "Two Years of Scout Service",
    context: "Scout & Guide Movement",
    details:
      "Completed two years of active scouting, contributing to community activities, helping coordinate events, working with teams, and developing responsibility, leadership, and service-oriented skills.",
  },
  {
    title: "System Siege — 24-Hour Hackathon",
    context: "Geeks For Geeks Campus Body · Amrita Vishwa Vidyapeetham",
    details:
      "Participated in System Siege, a 24-hour hackathon organized by the Geeks For Geeks Campus Body at Amrita, held on 16–17 July 2026. Recognized for enthusiastic participation, active involvement, and commitment throughout the event.",
    year: "2026",
    proof: {
      image: "/certificates/thumbs/hackathon.jpg",
      file: "/certificates/hackathon.pdf",
    },
  },
];
