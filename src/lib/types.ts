export type ProjectStatus = "completed" | "in-progress";

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
  problem?: string;
  approach?: string;
  results?: string;
  lessons?: string;
};

export type SkillCategory =
  | "Languages"
  | "Core CS"
  | "Mathematics"
  | "Database"
  | "Tools";

export type Skill = {
  name: string;
  category: SkillCategory;
  usedIn: string[];
  note?: string;
};

export type Certification = {
  title: string;
  issuer: string;
  date?: string;
  verificationUrl?: string;
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
};

export type JournalEntryMeta = {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
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
