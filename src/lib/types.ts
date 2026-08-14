export type ProjectStatus = "completed" | "in-progress";

export type ProjectMedia = {
  cover?: string;
  screenshots?: string[];
  video?: string;
};

export type Project = {
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  github?: string;
  demo?: string;
  status: ProjectStatus;
  featured: boolean;
  role?: string;
  timeline?: string;
  statusNote?: string;
  stackWhy?: string[];
  metrics?: string[];
  problem?: string;
  approach?: string;
  architecture?: string;
  challenges?: string;
  solutions?: string;
  results?: string;
  lessons?: string;
  visualization?: "dsa" | "database";
  media?: ProjectMedia;
};

export type Certification = {
  title: string;
  issuer?: string;
  date?: string;
  description?: string;
  thumbnail?: string;
  preview?: string;
  file?: string;
  credentialId?: string;
  verificationUrl?: string;
  linkedinUrl?: string;
};

export type EducationItem = {
  institution: string;
  location: string;
  period: string;
  degree: string;
  details?: string;
  coursework?: string[];
  highlight?: string;
};

export type Achievement = {
  title: string;
  context?: string;
  year?: string;
  details?: string;
  proof?: {
    image?: string;
    file?: string;
    url?: string;
  };
};

export type AcademicSemester = {
  id: string;
  name: string;
  period: string;
  status: "completed" | "upcoming";
  credits?: number;
  note?: string;
  subjects: string[];
};

export type AcademicDomain = {
  name: string;
  items: string[];
};

export type AcademicJourney = {
  degree: string;
  institution: string;
  campus: string;
  creditsCompleted: number;
  semestersCompleted: number;
  totalSemesters: number;
  domains: AcademicDomain[];
  semesters: AcademicSemester[];
  selectedCoursework: string[];
};

export type JournalEntryMeta = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  tags: string[];
  excerpt: string;
  category: string;
  relatedProject?: string;
  readingTime?: string;
};

export type JournalEntry = JournalEntryMeta & {
  content: string;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type GitHubUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  createdAt: string;
};

export type GitHubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  updatedAt: string;
};

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionWeek = {
  days: ContributionDay[];
};

export type LeetCodeStats = {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  ranking?: number;
  streak?: number;
};
