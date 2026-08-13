import type { EducationItem, JourneyNode } from "@/lib/types";

export const education: EducationItem[] = [
  {
    institution: "Amrita Vishwa Vidyapeetham",
    location: "Chennai, India",
    period: "2024 – Present",
    degree: "B.Tech, Computer Engineering",
    details:
      "Relevant coursework: Data Structures, Algorithms, Linear Algebra, Object-Oriented Programming, Database Systems.",
    coursework: [
      "Data Structures",
      "Algorithms",
      "Linear Algebra",
      "Object-Oriented Programming",
      "Database Systems",
    ],
  },
  {
    institution: "Nightingale International School",
    location: "Nepal",
    period: "2022 – 2024",
    degree: "Higher Secondary (+2), Computer Science",
    details: "4.00 GPA — Top 3 Rank.",
    highlight: "4.00 GPA · Top 3 Rank",
    coursework: ["Computer Science", "Mathematics", "Physics"],
  },
];

export const learningJourney: JourneyNode[] = [
  {
    label: "B.Tech Computer Engineering",
    period: "2024 – Present",
    title: "Amrita Vishwa Vidyapeetham, Chennai",
    text: "Core engineering foundations: math, programming, and how software systems are built.",
    current: false,
  },
  {
    label: "Semester 1",
    items: ["Data Structures", "Object-Oriented Programming", "Linear Algebra"],
    text: "First principles — how data is organised and how programs are structured.",
    current: false,
  },
  {
    label: "Semester 2",
    items: ["Algorithms", "Database Systems"],
    text: "Efficiency thinking and structured data at scale.",
    current: false,
  },
  {
    label: "Semester 3",
    items: ["Advanced DSA", "Backend Development", "System Design"],
    text: "Currently building toward production-grade backend skills.",
    current: true,
  },
];
