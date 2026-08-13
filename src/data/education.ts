import type { AcademicJourney, EducationItem } from "@/lib/types";

export const education: EducationItem[] = [
  {
    institution: "Amrita Vishwa Vidyapeetham",
    location: "Chennai, India",
    period: "2024 – Present",
    degree: "B.Tech, Computer Engineering",
    details:
      "B.Tech Computer Engineering — currently in Semester III, working toward the full eight-semester degree.",
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

// Academic journey dashboard data.
// Anything not yet verified by the user is flagged TODO: VERIFY.
export const academicJourney: AcademicJourney = {
  degree: "B.Tech Computer Engineering",
  institution: "Amrita Vishwa Vidyapeetham",
  campus: "Chennai, India",
  creditsCompleted: 64, // TODO: VERIFY — total credits completed so far
  semestersCompleted: 3,
  totalSemesters: 8,
  domains: [
    {
      name: "Algorithms & Data Structures",
      items: ["Complexity analysis", "Problem solving", "Optimization techniques"],
    },
    {
      name: "Programming",
      items: ["C", "Java", "Python"],
    },
    {
      name: "Databases & Backend",
      items: ["SQL", "REST APIs", "Server-side development"],
    },
    {
      name: "Systems",
      items: ["Digital electronics", "Computer organization", "Operating systems (upcoming)"],
    },
    {
      name: "AI & ML (upcoming)",
      items: ["Machine learning", "Data science"],
    },
    {
      name: "Security & Cloud (upcoming)",
      items: ["Network security", "Cloud computing"],
    },
  ],
  semesters: [
    {
      id: "sem-1",
      name: "Semester I",
      period: "2024–25",
      status: "completed",
      note: "Core engineering and programming foundations.",
      subjects: [], // TODO: VERIFY — subject list not yet uploaded
    },
    {
      id: "sem-2",
      name: "Semester II",
      period: "2025–26",
      status: "completed",
      note: "Advanced foundations in programming and mathematics.",
      subjects: [], // TODO: VERIFY — subject list not yet uploaded
    },
    {
      id: "sem-3",
      name: "Semester III",
      period: "2026",
      status: "completed",
      credits: 22, // TODO: VERIFY — credits completed in Semester III
      note: "Verified semester — currently in progress this year.",
      subjects: [
        "Data Structures and Algorithms",
        "Procedural Programming using C",
        "Database Management Systems",
        "Optimization Techniques",
        "Digital Electronics",
        "Digital Electronics Laboratory",
        "Amrita Value Programme I",
      ],
    },
    {
      id: "sem-4",
      name: "Semester IV",
      period: "2026–27",
      status: "upcoming",
      note: "Planned focus areas: Systems, Cloud.",
      subjects: [],
    },
    {
      id: "sem-5",
      name: "Semester V",
      period: "2027",
      status: "upcoming",
      note: "Planned focus areas: AI / Machine Learning.",
      subjects: [],
    },
    {
      id: "sem-6",
      name: "Semester VI",
      period: "2027–28",
      status: "upcoming",
      note: "Planned focus areas: Security.",
      subjects: [],
    },
    {
      id: "sem-7",
      name: "Semester VII",
      period: "2028",
      status: "upcoming",
      note: "Planned focus areas: Advanced Software Engineering.",
      subjects: [],
    },
    {
      id: "sem-8",
      name: "Semester VIII",
      period: "2028–29",
      status: "upcoming",
      note: "Capstone project and thesis.",
      subjects: [],
    },
  ],
  selectedCoursework: [
    "Data Structures",
    "Algorithms",
    "Database Management Systems",
    "Procedural Programming using C",
    "Optimization Techniques",
    "Digital Electronics",
    "Object-Oriented Programming",
    "Linear Algebra",
    "Discrete Mathematics",
    "Computer Organization",
  ],
};
