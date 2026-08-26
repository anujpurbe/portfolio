import fs from "node:fs/promises";
import path from "node:path";
import type { RAGDocument } from "./types";

let resumeText: string | null = null;

async function loadResume(): Promise<RAGDocument[]> {
  if (resumeText) {
    return [
      {
        id: "resume",
        content: resumeText,
        metadata: { source: "resume", type: "resume", title: "Anuj Purbe Resume" },
      },
    ];
  }

  try {
    const pdfPath = path.join(process.cwd(), "public", "resume", "Anuj-Purbe-Resume.pdf");
    const buffer = await fs.readFile(pdfPath);
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse(new Uint8Array(buffer));
    const result = await parser.getText();
    resumeText = typeof result === "string" ? result : result.text ?? "";
    return [
      {
        id: "resume",
        content: resumeText ?? "",
        metadata: { source: "resume", type: "resume", title: "Anuj Purbe Resume" },
      },
    ];
  } catch {
    return [];
  }
}

async function loadProjects(): Promise<RAGDocument[]> {
  try {
    const { projects } = await import("@/data/projects");
    return projects.map((p) => ({
      id: `project-${p.slug}`,
      content: [
        `# ${p.title}`,
        `Category: ${p.category}`,
        `Status: ${p.status}`,
        `Description: ${p.description}`,
        p.problem ? `Problem: ${p.problem}` : "",
        p.approach ? `Approach: ${p.approach}` : "",
        p.architecture ? `Architecture: ${p.architecture}` : "",
        p.stackWhy ? `Tech stack reasoning: ${p.stackWhy.join("; ")}` : "",
        p.challenges ? `Challenges: ${p.challenges}` : "",
        p.solutions ? `Solutions: ${p.solutions}` : "",
        p.results ? `Results: ${p.results}` : "",
        p.lessons ? `Lessons: ${p.lessons}` : "",
        `Technologies: ${p.technologies.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
      metadata: {
        source: `projects/${p.slug}`,
        type: "project" as const,
        title: p.title,
        slug: p.slug,
      },
    }));
  } catch {
    return [];
  }
}

async function loadJournals(): Promise<RAGDocument[]> {
  try {
    const contentDir = path.join(process.cwd(), "src", "content", "journal");
    const entries = await fs.readdir(contentDir);
    const mdxFiles = entries.filter((e) => e.endsWith(".mdx") && e !== "index.ts");

    const journals: RAGDocument[] = [];
    for (const file of mdxFiles) {
      const raw = await fs.readFile(path.join(contentDir, file), "utf-8");
      const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
      let title = file.replace(".mdx", "");
      let content = raw;

      if (frontmatterMatch) {
        const fm = frontmatterMatch[1];
        const titleMatch = fm.match(/title:\s*["']?([^"'\n]+)["']?/);
        if (titleMatch) title = titleMatch[1];
        content = raw.slice(frontmatterMatch[0].length).trim();
      }

      journals.push({
        id: `journal-${file.replace(".mdx", "")}`,
        content: `# ${title}\n\n${content}`,
        metadata: {
          source: `journal/${file}`,
          type: "journal",
          title,
          slug: file.replace(".mdx", ""),
        },
      });
    }
    return journals;
  } catch {
    return [];
  }
}

export async function loadAllDocuments(): Promise<RAGDocument[]> {
  const [resume, projects, journals] = await Promise.all([
    loadResume(),
    loadProjects(),
    loadJournals(),
  ]);
  return [...resume, ...projects, ...journals];
}
