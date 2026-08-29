import { site } from "@/data/site";
import { academicJourney } from "@/data/education";
import { currentStack, aspiringStack } from "@/data/skills";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { stats } from "@/data/stats";

export type SocialLink = {
  label: string;
  href: string;
  handle?: string;
};

export type AssistantProfile = {
  name: string;
  fullName: string;
  role: string;
  email: string;
  resume: string;
  availability: { open: boolean; label: string };
  socials: SocialLink[];
  education: {
    degree: string;
    institution: string;
    campus: string;
    currentSemester: number;
    totalSemesters: number;
  };
  skillsCurrent: string[];
  skillsExploring: string[];
  stats: { projects: number; certificates: number; problemsSolved: number; cgpa: number };
  projectTitles: string[];
  certificateTitles: string[];
};

const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: site.github, handle: site.githubUsername },
  { label: "LinkedIn", href: site.linkedin, handle: "in/anuj-purbe" },
  { label: "Instagram", href: site.socials.instagram.href, handle: site.socials.instagram.handle },
  { label: "Email", href: site.email, handle: site.email },
];

// Single source of truth for ASK://ANUJ — assembled from the real site data files.
export const profileData: AssistantProfile = {
  name: site.name,
  fullName: site.fullName,
  role: site.role,
  email: site.email,
  resume: site.resume,
  availability: site.availability,
  socials: SOCIAL_LINKS,
  education: {
    degree: academicJourney.degree,
    institution: academicJourney.institution,
    campus: academicJourney.campus,
    currentSemester: academicJourney.currentSemester,
    totalSemesters: academicJourney.totalSemesters,
  },
  skillsCurrent: currentStack.map((s) => s.name),
  skillsExploring: aspiringStack.map((s) => s.name),
  stats: {
    projects: stats.projects,
    certificates: stats.certificates,
    problemsSolved: stats.problemsSolved,
    cgpa: stats.cgpa,
  },
  projectTitles: projects.map((p) => p.title),
  certificateTitles: certifications.map((c) => c.title),
};
