import type {
  Achievement,
  Certification,
  EducationItem,
} from "@/lib/types";

export const profile = {
  heroEyebrow: "Computer Engineering Undergraduate",
  heroName: "Anuj Purbe",
  heroTagline:
    "I build efficient, well-structured software — grounded in data structures, algorithms, and systems thinking.",
  heroSystem: ["PROBLEM", "ALGORITHM", "CODE", "DATA", "RESULT"],
  photo: {
    alt: "Portrait of Anuj Purbe",
  },
  about: [
    "I'm a computer engineering undergraduate at Amrita Vishwa Vidyapeetham with a strong foundation in data structures, algorithms, object-oriented programming, and relational databases. I care about writing code that is correct first, then fast — and I build that rigor through competitive programming and deliberate practice.",
    "Most of my work so far lives in two places: Java-based DSA and algorithm implementations, and SQL-backed database design. I've solved 100+ algorithmic problems with attention to complexity analysis, and designed normalized relational schemas where clean data modeling mattered.",
    "Right now I'm going deeper on backend development and system design, while staying consistent with competitive programming. I'm looking for a software engineering internship where I can build production software and learn how real systems are engineered.",
  ],
  currently: {
    learning: ["Advanced DSA", "Backend Development", "System Design"],
    building:
      "This portfolio — my first shipped Next.js project. Full build log in the journal.",
    exploring: ["Competitive Programming", "AI", "Backend Architecture"],
  },
};

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

export const certifications: Certification[] = [
  {
    title: "Advanced Python Developer Training",
    issuer: "Codingal",
    date: "2023",
  },
  {
    title: "SQL Developer Certification",
    issuer: "Codingal",
  },
  {
    title: "Data Science Fundamentals",
    issuer: "Codingal",
  },
  {
    title: "Web Development Course",
    issuer: "Codingal",
  },
];
