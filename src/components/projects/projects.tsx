import { ArrowUpRight, Code2, GitBranch, MousePointer2 } from "lucide-react";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { ProjectCover } from "@/components/projects/project-cover";
import { DsaVisualization } from "@/components/projects/visualizations/dsa-visualization";
import { DatabaseVisualization } from "@/components/projects/visualizations/database-visualization";
import { cn } from "@/lib/utils";

const fieldLabels: Record<
  "problem" | "approach" | "stackWhy" | "metrics" | "results" | "lessons",
  string
> = {
  problem: "Problem",
  approach: "Approach",
  stackWhy: "Stack & why",
  metrics: "Metrics",
  results: "Results",
  lessons: "Lesson",
};

const statusLabel: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In progress",
};

const vizProjects = projects.filter((project) => project.visualization);

function ProjectDemo({ slug }: { slug: string }) {
  if (slug === "dsa-algorithms") return <DsaVisualization />;
  return <DatabaseVisualization />;
}

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Featured work"
      description="Quality over padding — these are the strongest things I've built so far, with evidence, not claims."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.1}>
            <article className="card group flex h-full flex-col overflow-hidden">
              <a
                href={`/projects/${project.slug}`}
                className="focus-ring relative block overflow-hidden"
              >
                <ProjectCover
                  project={project}
                  className="rounded-none border-x-0 border-t-0"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="rounded-full border border-border bg-background/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted backdrop-shell">
                    {statusLabel[project.status]}
                  </span>
                </div>
                <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1.5 bg-accent/95 py-2 text-sm font-medium text-accent-foreground backdrop-shell transition-transform duration-300 group-hover:translate-y-0">
                  View case study
                  <ArrowUpRight className="size-4" />
                </span>
              </a>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-subtle">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                  <Badge>{project.category}</Badge>
                </div>

                <h3 className="text-xl font-semibold tracking-tight">
                  <a
                    href={`/projects/${project.slug}`}
                    className="focus-ring rounded-md transition-colors hover:text-accent"
                  >
                    {project.title}
                  </a>
                </h3>

                {(project.role || project.timeline) && (
                  <dl className="mt-3 space-y-0.5 font-mono text-xs text-subtle">
                    {project.role && (
                      <div>
                        <dt className="inline">Role · </dt>
                        <dd className="inline">{project.role}</dd>
                      </div>
                    )}
                    {project.timeline && (
                      <div>
                        <dt className="inline">Timeline · </dt>
                        <dd className="inline">{project.timeline}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <p className="mt-3 leading-7 text-muted">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>

                <details className="group mt-5">
                  <summary className="focus-ring cursor-pointer list-none rounded-md text-sm font-medium text-accent">
                    <span className="inline-flex items-center gap-1.5">
                      <Code2 className="size-4" />
                      How I built it
                      <span className="text-subtle transition-transform group-open:rotate-90">
                        ▸
                      </span>
                    </span>
                  </summary>
                  <div className="mt-4 space-y-4 border-l border-border pl-4">
                    {(
                      [
                        "problem",
                        "approach",
                        "stackWhy",
                        "metrics",
                        "results",
                        "lessons",
                      ] as const
                    ).map((field) => {
                      const value = project[field];
                      if (!value) return null;
                      return (
                        <div key={field}>
                          <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                            {fieldLabels[field]}
                          </p>
                          {Array.isArray(value) ? (
                            <ul className="mt-1 list-disc space-y-1 pl-4 text-sm leading-6 text-muted">
                              {value.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 text-sm leading-6 text-muted">
                              {value}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>

                {project.statusNote && (
                  <p className="mt-4 border-l border-accent/40 pl-3 text-sm leading-6 text-muted">
                    {project.statusNote}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm font-medium"
                    >
                      <GitBranch className="size-4" />
                      GitHub
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring muted-link inline-flex items-center gap-1.5 rounded-md text-sm font-medium"
                    >
                      Live demo
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                  <a
                    href={`/projects/${project.slug}`}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-accent"
                  >
                    Case study
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {vizProjects.length > 0 && (
        <>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-2 text-subtle">
              <MousePointer2 className="size-4" />
              <p className="font-mono text-xs uppercase tracking-widest">
                Engineering previews — run the ideas behind these projects
              </p>
            </div>
          </Reveal>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {vizProjects.map((project, i) => (
              <Reveal key={`${project.slug}-demo`} delay={i * 0.08}>
                <div className="card flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">{project.title}</h3>
                    <Badge className="text-[10px]">interactive</Badge>
                  </div>
                  <div className={cn("min-h-72 flex-1")}>
                    <ProjectDemo slug={project.slug} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}
