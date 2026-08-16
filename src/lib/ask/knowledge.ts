import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { education, academicJourney } from "@/data/education";
import { currentStack, aspiringStack } from "@/data/skills";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { achievements } from "@/data/achievements";
import { stats } from "@/data/stats";

function list(items: string[]): string {
  return items.length > 0 ? `- ${items.join("\n- ")}` : "(not available)";
}

export function buildPortfolioKnowledge(): string {
  const certLines = certifications
    .map(
      (c) =>
        `- ${c.title}${c.issuer ? ` · ${c.issuer}` : ""}${c.date ? ` · ${c.date}` : ""}${
          c.description ? ` — ${c.description}` : ""
        }`,
    )
    .join("\n");

  const projectLines = projects
    .map(
      (p) =>
        `- ${p.title} [slug: ${p.slug}] (${p.category}, ${p.status}) — ${p.description} — technologies: ${p.technologies.join(", ")}`,
    )
    .join("\n");

  const currentLines = currentStack
    .map((s) => `- ${s.name}${s.note ? ` — ${s.note}` : ""}`)
    .join("\n");
  const aspiringLines = aspiringStack
    .map((s) => `- ${s.name}${s.note ? ` — ${s.note}` : ""}`)
    .join("\n");

  const achievementLines = achievements
    .map(
      (a) =>
        `- ${a.title}${a.context ? ` · ${a.context}` : ""}${a.year ? ` · ${a.year}` : ""}${
          a.details ? ` — ${a.details}` : ""
        }`,
    )
    .join("\n");

  const educationLines = education
    .map(
      (e) =>
        `- ${e.institution} (${e.location}, ${e.period}) — ${e.degree}${
          e.details ? ` — ${e.details}` : ""
        }${e.highlight ? ` — ${e.highlight}` : ""}${
          e.coursework ? ` — coursework: ${e.coursework.join(", ")}` : ""
        }`,
    )
    .join("\n");

  return `
# Anuj Purbe — portfolio knowledge (facts only, source of truth)

PROFILE
- Name: ${site.fullName}. Role: ${site.role}.
- Availability: ${site.availability.open ? "Open to Software Engineering Internships." : "Not currently available."}
- Tagline: ${site.tagline}
- About:
${profile.about.map((a) => `  - ${a.heading}: ${a.text}`).join("\n")}

EDUCATION
${educationLines}
- Academic journey: ${academicJourney.degree} at ${academicJourney.institution}, ${academicJourney.campus}. Currently in Semester ${academicJourney.currentSemester} of ${academicJourney.totalSemesters}. ${academicJourney.semestersCompleted} of ${academicJourney.totalSemesters} semesters completed. Credits completed: ${academicJourney.creditsCompleted}.
- Selected coursework: ${academicJourney.selectedCoursework.join(", ")}.

SKILLS
Current stack:
${currentLines}
Exploring / aspiring:
${aspiringLines}

PROJECTS
${projectLines}

CERTIFICATES (all verified, PDFs on the site)
${certLines}

ACHIEVEMENTS
${achievementLines}

CURRENTLY
- Learning:
${list(profile.currently.learning.map((i) => `${i.label} (${i.tech})`))}
- Building:
${list(profile.currently.building.map((i) => `${i.label} (${i.tech})`))}
- Exploring:
${list(profile.currently.exploring.map((i) => `${i.label} (${i.tech})`))}

STATS
- Projects: ${stats.projects}. Certificates: ${stats.certificates}. Problems solved: ${stats.problemsSolved}. CGPA: ${stats.cgpa}.

LINKS
- Email: ${site.email}
- GitHub: ${site.github}
- LinkedIn: ${site.linkedin}
- LeetCode: ${site.coding.platforms.find((p) => p.label === "LeetCode")?.href ?? `${site.coding.leetcodeUrl}/u/anujpurbe/`}
- Resume PDF: ${site.resume}

NAVIGATION (section ids on the homepage)
about, stats, skills, projects, achievements, education, academic, certifications, github, leetcode, journal, comments, contact
`.trim();
}
