export const site = {
  name: "Anuj Purbe",
  fullName: "Anuj Purbe",
  initials: "AP",
  role: "Computer Engineering Undergraduate",
  url: "https://anujpurbe.dev",
  email: "anujpurbe123@gmail.com",
  github: "https://github.com/anujpurbe",
  githubUsername: "anujpurbe",
  linkedin: "https://linkedin.com/in/anujpurbe",
  resume: "/resume.pdf",
  tagline:
    "I build efficient, well-structured software — grounded in data structures, algorithms, and systems thinking.",
  availability: {
    open: true,
    label: "Open to Software Engineering Internships",
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
      href: "https://linkedin.com/in/anujpurbe",
      handle: "in/anujpurbe",
    },
    email: {
      label: "Email",
      href: "mailto:anujpurbe123@gmail.com",
      handle: "anujpurbe123@gmail.com",
    },
  },
} as const;
