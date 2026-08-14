import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { education, academicJourney } from "@/data/education";
import { currentStack, aspiringStack } from "@/data/skills";
import { achievements } from "@/data/achievements";
import { stats } from "@/data/stats";
import type { Project } from "@/lib/types";
import type {
  AskAction,
  AskHistoryMessage,
  AskResponse,
  AskResult,
} from "./types";

export const SCROLL_TARGETS: Record<string, string> = {
  about: "about",
  stats: "stats",
  skills: "skills",
  projects: "projects",
  achievements: "achievements",
  education: "education",
  academic: "academic",
  certifications: "certifications",
  github: "github",
  leetcode: "leetcode",
  journal: "journal",
  comments: "comments",
  contact: "contact",
};

const STOPWORDS = new Set(
  (
    "a an the using with show see list his her your yours tell me can you would like to for about built build make made create created develop developed use used work works worked on is are was were has have what which who where how when why does do did of from at as it its our their my i we our by into over and or any all some not no please give me more than most very hello hi experience experiences project projects".split(
      " ",
    )
  ),
);

function norm(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(q: string, ...words: string[]): boolean {
  return words.some((w) => q.includes(w));
}

function hasWord(q: string, ...phrases: string[]): boolean {
  return phrases.some((p) => {
    const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`).test(q);
  });
}

const scroll = (target: string, label: string): AskAction => ({
  label,
  type: "scroll",
  target,
});

function projectResult(p: Project): AskResult {
  return {
    type: "project",
    id: p.slug,
    title: p.title,
    description: p.description,
    meta: p.category,
    href: `/projects/${p.slug}`,
  };
}

function certificateResult(c: (typeof certifications)[number]): AskResult {
  return {
    type: "certificate",
    id: c.title,
    title: c.title,
    description: c.description,
    meta: [c.issuer, c.date].filter(Boolean).join(" · "),
    href: c.file,
    download: c.file,
  };
}

function skillResult(
  s: { name: string; note?: string },
  stackLabel: string,
): AskResult {
  return {
    type: "skill",
    id: s.name,
    title: s.name,
    description: s.note,
    meta: stackLabel,
  };
}

function allProjects(): AskResponse {
  return {
    answer: `${projects.length} projects are documented on the portfolio — full-stack apps, research sites, and algorithm work.`,
    actions: [scroll("projects", "View projects")],
    results: projects.map(projectResult),
  };
}

function allCertificates(): AskResponse {
  return {
    answer: `${certifications.length} certificates are verified on the site, each with its original PDF.`,
    actions: [scroll("certifications", "View certificates")],
    results: certifications.map(certificateResult),
  };
}

function allSkills(): AskResponse {
  return {
    answer: `Anuj's current stack: ${currentStack.map((s) => s.name).join(", ")}. Exploring: ${aspiringStack.map((s) => s.name).join(", ")}.`,
    actions: [scroll("skills", "View skills")],
    results: [
      ...currentStack.map((s) => skillResult(s, "current")),
      ...aspiringStack.map((s) => skillResult(s, "exploring")),
    ],
  };
}

function contactResponse(): AskResponse {
  return {
    answer:
      "You can reach Anuj at " +
      site.email +
      " — or send a message through the contact form. He's open to software engineering internships.",
    actions: [
      { label: "Email", type: "external", href: site.email },
      { label: "Contact form", type: "scroll", target: "contact" },
    ],
  };
}

function resumeResponse(): AskResponse {
  return {
    answer:
      "Here's Anuj's resume — it opens as a PDF in a new tab.",
    actions: [{ label: "View resume", type: "resume", href: site.resume }],
  };
}

function githubResponse(): AskResponse {
  return {
    answer:
      "Anuj's GitHub is github.com/anujpurbe — open source work and project repos. The GitHub section on this page shows live repo data.",
    actions: [
      { label: "Open GitHub", type: "external", href: site.github },
      scroll("github", "GitHub activity"),
    ],
  };
}

function educationResponse(): AskResponse {
  const school = education[1];
  return {
    answer: `Anuj is studying ${academicJourney.degree} at ${academicJourney.institution}, currently in Semester ${academicJourney.semestersCompleted} of ${academicJourney.totalSemesters}.${school ? ` Earlier he completed higher secondary at ${school.institution}${school.highlight ? ` with ${school.highlight.toLowerCase()}` : ""}.` : ""}`,
    actions: [
      scroll("education", "View education"),
      scroll("academic", "Academic journey"),
    ],
  };
}

function learningResponse(): AskResponse {
  const building = profile.currently.building
    .map((i) => (i.label === "This portfolio" ? "this portfolio" : i.label))
    .join(" and ");
  return {
    answer: `Right now Anuj is learning: ${profile.currently.learning
      .map((i) => i.label)
      .join(", ")}. He's building ${building} and exploring ${profile.currently.exploring
      .map((i) => i.label)
      .join(", ")}.`,
    actions: [scroll("about", "More about Anuj")],
  };
}

function internshipResponse(): AskResponse {
  return {
    answer:
      "Yes — Anuj is open to software engineering internships right now. Email him or use the contact form to start a conversation.",
    actions: [
      { label: "Email", type: "external", href: site.email },
      { label: "Contact", type: "scroll", target: "contact" },
      { label: "Resume", type: "resume", href: site.resume },
    ],
  };
}

function aboutResponse(): AskResponse {
  return {
    answer: profile.about.map((a) => `${a.heading}: ${a.text}`).join(" "),
    actions: [scroll("about", "About section"), scroll("contact", "Contact")],
  };
}

function statsResponse(): AskResponse {
  return {
    answer: `${stats.projects} projects, ${stats.certificates} verified certificates, ${stats.problemsSolved} algorithmic problems solved, and a ${stats.cgpa} CGPA.`,
    actions: [scroll("stats", "Stats"), scroll("projects", "Projects")],
  };
}

function achievementsResponse(): AskResponse {
  return {
    answer: achievements
      .map(
        (a) =>
          `${a.title} (${a.context}) — ${a.details}${a.year ? ` · ${a.year}` : ""}`,
      )
      .join(" "),
    actions: [scroll("achievements", "View achievements")],
  };
}

function fallbackResponse(): AskResponse {
  return {
    answer:
      "I don't have that information in Anuj's portfolio yet. Try asking about his projects, skills, education, or certificates — or explore directly:",
    actions: [
      scroll("projects", "Projects"),
      scroll("skills", "Skills"),
      scroll("contact", "Contact"),
      { label: "GitHub", type: "external", href: site.github },
    ],
  };
}

function greetingResponse(): AskResponse {
  return {
    answer:
      "Hey! 👋 I'm Anuj's portfolio assistant. I can help you explore his projects, skills, education, certificates, GitHub activity, and more. What would you like to know?",
    actions: [
      scroll("projects", "Projects"),
      scroll("skills", "Skills"),
      scroll("contact", "Contact"),
    ],
  };
}

function identityResponse(): AskResponse {
  return {
    answer:
      "I'm ask://anuj — the AI assistant for Anuj Purbe's engineering portfolio. I can answer questions about his work, projects, skills, education, and certificates, and help you navigate the site.",
    actions: [
      scroll("projects", "Projects"),
      scroll("about", "About Anuj"),
      scroll("contact", "Contact"),
    ],
  };
}

function capabilitiesResponse(): AskResponse {
  return {
    answer:
      "I can help you explore Anuj's projects, skills, education, certificates, GitHub activity, and current learning. You can also ask me to take you directly to a section — try \"show projects\", \"show skills\", or \"show certificates\".",
    actions: [
      scroll("projects", "Projects"),
      scroll("skills", "Skills"),
      scroll("certifications", "Certificates"),
      scroll("contact", "Contact"),
    ],
  };
}

function statusResponse(): AskResponse {
  return {
    answer: `Doing great! I've got ${stats.projects} projects, ${stats.certificates} verified certificates, and ${stats.problemsSolved}+ solved problems to tell you about. What would you like to dig into?`,
    actions: [
      scroll("projects", "Projects"),
      scroll("skills", "Skills"),
      scroll("achievements", "Achievements"),
    ],
  };
}

function thanksResponse(): AskResponse {
  return {
    answer:
      "You're welcome! Happy to help — anything else you'd like to know about Anuj's work?",
    actions: [
      scroll("projects", "Projects"),
      scroll("contact", "Contact"),
    ],
  };
}

function goodbyeResponse(): AskResponse {
  return {
    answer:
      "Goodbye! Thanks for visiting Anuj's portfolio — feel free to come back anytime.",
    actions: [scroll("projects", "Projects")],
  };
}

function interestingResponse(): AskResponse {
  const facts = [
    `Anuj has solved ${stats.problemsSolved} algorithmic problems and maintains a ${stats.cgpa} CGPA.`,
    `Anuj built a multi-agent AI system (Hiingers) that negotiates hospital resource allocation in real time.`,
    `Anuj holds ${stats.certificates} verified certificates — each one has its original PDF on this site.`,
    "Anuj designed a 3NF-normalized relational schema with five tables for his database mini project — normalization made his GROUP BY queries read like English.",
  ];
  const fact = facts[Math.floor(Math.random() * facts.length)];
  return {
    answer: `Here's something interesting: ${fact} Want another fact?`,
    actions: [scroll("stats", "Stats"), scroll("projects", "Projects")],
  };
}

function exploreResponse(): AskResponse {
  return {
    answer:
      "Great place to start: the hero explains what Anuj does, then look at his featured projects, the skills he's building with, and his academic journey. I can also answer specific questions — just ask!",
    actions: [
      scroll("projects", "Projects"),
      scroll("skills", "Skills"),
      scroll("education", "Education"),
      scroll("contact", "Contact"),
    ],
  };
}

function keywordProjects(q: string): Project[] | null {
  const tokens = q.split(" ").filter((t) => t.length >= 3 && !STOPWORDS.has(t));
  const matches = projects.filter((p) => {
    const searchable = `${p.title} ${p.category} ${p.description} ${p.technologies.join(" ")}`.toLowerCase();
    return tokens.some((t) => searchable.includes(t));
  });
  return matches.length > 0 ? matches : null;
}

function findProjectInText(text: string): Project | null {
  const lower = text.toLowerCase();
  const named = projects.find(
    (p) => lower.includes(p.slug.replace(/-/g, " ")) || lower.includes(p.title.toLowerCase()),
  );
  if (named) return named;
  const match = keywordProjects(norm(text));
  return match && match.length === 1 ? match[0] : null;
}

function anaphoraResponse(q: string, prevUser: string): AskResponse | null {
  const referencesIt = /(^|\s)(it|that|this|that one|this one|the project|that project)(\s|$)/.test(q) ||
    /for it|in it|used|built with|stack|technolog/.test(q);
  if (!referencesIt) return null;
  const prev = findProjectInText(prevUser);
  if (!prev) return null;

  const isTechQuestion = /technolog|stack|built with|used|tool|language/.test(q);
  if (isTechQuestion) {
    return {
      answer: `${prev.title} uses ${prev.technologies.join(", ")}.`,
      actions: [{ label: "View project", type: "link", href: `/projects/${prev.slug}` }],
      results: [projectResult(prev)],
    };
  }

  const isAboutQuestion = /about|explain|tell|what is|describe|overview/.test(q);
  if (isAboutQuestion) {
    return {
      answer: prev.description,
      actions: [{ label: "View project", type: "link", href: `/projects/${prev.slug}` }],
      results: [projectResult(prev)],
    };
  }

  return null;
}

export function answerQuestion(
  raw: string,
  history: AskHistoryMessage[] = [],
): AskResponse {
  const q = norm(raw);
  const prevUser = [...history]
    .reverse()
    .find((m) => m.role === "user")?.text ?? "";

  if (!q) {
    return {
      answer:
        "Ask me anything about Anuj's work — projects, skills, education, certificates, or how to contact him.",
      actions: [
        scroll("projects", "Projects"),
        scroll("skills", "Skills"),
        scroll("contact", "Contact"),
      ],
    };
  }

  if (hasWord(q, "hi", "hello", "hey", "yo", "sup", "good morning", "good afternoon", "good evening", "howdy", "hiya")) {
    return greetingResponse();
  }

  if (hasWord(q, "who are you", "what are you", "introduce yourself", "your name", "are you anuj")) {
    return identityResponse();
  }

  if (hasWord(q, "help me explore", "what should i look at", "where should i start", "explore", "guide me", "recommend", "suggest", "where do i go", "what do you recommend")) {
    return exploreResponse();
  }

  if (hasWord(q, "what can you do", "what do you do", "how can you help", "help", "how do i use", "what should i ask")) {
    return capabilitiesResponse();
  }

  if (hasWord(q, "how are you", "how's it going", "how are things", "what's up", "how do you feel", "are you ok", "you good")) {
    return statusResponse();
  }

  if (hasWord(q, "thanks", "thank you", "thankyou", "thx", "appreciate", "grateful")) {
    return thanksResponse();
  }

  if (hasWord(q, "bye", "goodbye", "good bye", "see you", "take care", "gtg", "farewell")) {
    return goodbyeResponse();
  }

  if (hasWord(q, "something interesting", "interesting", "fun fact", "something cool", "impress me", "tell me a fact", "favorite fact")) {
    return interestingResponse();
  }  if (hasWord(q, "help me explore", "what should i look at", "where should i start", "explore", "guide me", "recommend", "suggest", "where do i go", "what do you recommend")) {
    return exploreResponse();
  }

  const anaphora = anaphoraResponse(q, prevUser);
  if (anaphora) return anaphora;

  const mentioned = findProjectInText(q);
  if (mentioned && !has(q, "projects", "project", "list", "all", "show")) {
    const isTech = /technolog|stack|built with|used|tool|language/.test(q);
    if (isTech) {
      return {
        answer: `${mentioned.title} uses ${mentioned.technologies.join(", ")}.`,
        actions: [{ label: "View project", type: "link", href: `/projects/${mentioned.slug}` }],
        results: [projectResult(mentioned)],
      };
    }
    return {
      answer: mentioned.description,
      actions: [{ label: "View project", type: "link", href: `/projects/${mentioned.slug}` }],
      results: [projectResult(mentioned)],
    };
  }

  if (has(q, "certificate", "certificates", "certification", "certifications", "cert", "certs", "credential", "credentials")) {
    return allCertificates();
  }

  if (has(q, "resume", "cv", "curriculum")) {
    return resumeResponse();
  }

  if (has(q, "github") && !has(q, "project", "projects")) {
    return githubResponse();
  }

  if (has(q, "contact", "email", "reach", "get in touch", "message")) {
    return contactResponse();
  }

  if (
    has(q, "intern", "internship", "hire", "hiring", "recruit", "open to", "full time", "job")
  ) {
    return internshipResponse();
  }

  if (has(q, "learn", "learning", "currently", "now", "latest", "working on", "building", "up to", "exploring")) {
    return learningResponse();
  }

  if (
    has(q, "education", "academic", "university", "college", "school", "degree", "semester", "sem", "gpa", "course", "courses", "study")
  ) {
    return educationResponse();
  }

  if (
    has(q, "skill", "skills", "technolog", "technologies", "technology", "stack", "language", "languages", "tool", "tools")
  ) {
    return allSkills();
  }

  if (has(q, "achievement", "achievements", "award", "awards", "milestone", "rank", "ranked")) {
    return achievementsResponse();
  }

  if (has(q, "about", "who is", "who are", "tell me about", "intro", "introduction", "profile", "background", "summary")) {
    return aboutResponse();
  }

  if (has(q, "stats", "statistics", "stat", "numbers", "counts", "metrics")) {
    return statsResponse();
  }

  if (has(q, "experience", "experiences")) {
    return statsResponse();
  }

  if (has(q, "project", "projects", "build", "built", "made", "created", "developed", "portfolio", "work", "works", "open source")) {
    const keywordMatch = keywordProjects(q);
    if (keywordMatch && keywordMatch.length < projects.length) {
      return {
        answer: `Projects matching that: ${keywordMatch
          .map((p) => p.title)
          .join(", ")}.`,
        actions: [scroll("projects", "View projects")],
        results: keywordMatch.map(projectResult),
      };
    }
    return allProjects();
  }

  return fallbackResponse();
}
