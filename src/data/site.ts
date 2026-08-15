export const site = {
  name: "Anuj Purbe",
  fullName: "Anuj Purbe",
  initials: "AP",
  logo: "/logo.png",
  role: "Computer Engineering Undergraduate",
  url: "https://anuj-purbe-portfolio.vercel.app",
  email: "anujpurbe123@gmail.com",
  github: "https://github.com/anujpurbe",
  githubUsername: "anujpurbe",
  linkedin: "https://www.linkedin.com/in/anuj-purbe",
  resume: "/resume/Anuj-Purbe-Resume.pdf",
  resumeDownload: "/resume/Anuj-Purbe-Resume.pdf?download=1",
  tagline:
    "I build efficient, well-structured software — grounded in data structures, algorithms, and systems thinking.",
  availability: {
    open: true,
    label: "Open to Software Engineering Internships",
  },
  photo: {
    primary: "/images/profile/anuj-purbe.webp",
    og: "/images/profile/anuj-purbe-og.webp",
  },
  coding: {
    leetcodeUsername: "",
    leetcodeUrl: "https://leetcode.com",
    platforms: [
      {
        label: "GitHub",
        handle: "anujpurbe",
        href: "https://github.com/anujpurbe",
      },
      {
        label: "LeetCode",
        handle: "anujpurbe",
        href: "https://leetcode.com/u/anujpurbe/",
      },
    ],
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Projects", href: "/#projects" },
    { label: "Skills", href: "/#skills" },
    { label: "Achievements", href: "/#achievements" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/#contact" },
  ],
  socials: {
    github: {
      label: "GitHub",
      href: "https://github.com/anujpurbe",
      handle: "anujpurbe",
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/anuj-purbe",
      handle: "in/anuj-purbe",
    },
    instagram: {
      label: "Instagram",
      href: "https://www.instagram.com/anujpurbe/",
      handle: "anujpurbe",
    },
    email: {
      label: "Email",
      href: "mailto:anujpurbe123@gmail.com",
      handle: "anujpurbe123@gmail.com",
    },
  },
} as const;
