import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Code2,
  GitBranch,
  Lightbulb,
  Milestone,
  Target,
  Wrench,
} from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCover } from "@/components/projects/project-cover";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { DsaVisualization } from "@/components/projects/visualizations/dsa-visualization";
import { DatabaseVisualization } from "@/components/projects/visualizations/database-visualization";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
  };
}

const detailSections = [
  { key: "problem", label: "The problem", icon: Target },
  { key: "approach", label: "The approach", icon: Code2 },
  { key: "architecture", label: "Architecture", icon: Milestone },
  { key: "challenges", label: "Trickiest parts", icon: AlertTriangle },
  { key: "solutions", label: "How I solved them", icon: Wrench },
  { key: "results", label: "Results", icon: Lightbulb },
  { key: "lessons", label: "What I learned", icon: Lightbulb },
] as const;

const statusLabel: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
};

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container-shell max-w-4xl">
        <Link
          href="/#projects"
          className="focus-ring muted-link mb-10 inline-flex items-center gap-1.5 rounded-md text-sm"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>

        <Reveal>
          <div className="overflow-hidden rounded-xl border border-border">
            <ProjectCover project={project} />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <header className="mt-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{project.category}</Badge>
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                {statusLabel[project.status]}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                >
                  <GitBranch className="size-4" />
                  View source
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                >
                  Live demo
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>
          </header>
        </Reveal>

        {project.visualization && (
          <Reveal delay={0.1}>
            <div className="card mt-12 p-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-subtle">
                Run it — interactive
              </p>
              <div className="min-h-72">
                {project.visualization === "dsa" ? (
                  <DsaVisualization />
                ) : (
                  <DatabaseVisualization />
                )}
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-12 space-y-6">
          {detailSections.map(({ key, label, icon: Icon }, i) => {
            const value = project[key];
            if (!value) return null;
            return (
              <Reveal key={key} delay={i * 0.05}>
                <section className="card p-6">
                  <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
                    <Icon className="size-3.5 text-accent" />
                    {label}
                  </h2>
                  <p className="mt-3 leading-7 text-muted">{value}</p>
                </section>
              </Reveal>
            );
          })}
        </div>
      </div>
    </article>
  );
}
