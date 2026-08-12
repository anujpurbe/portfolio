import { ArrowUpRight, Code2, GitBranch } from "lucide-react";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const fieldLabels: Record<
  "approach" | "results" | "lessons",
  string
> = {
  approach: "Approach",
  results: "Results",
  lessons: "Lesson",
};

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      description="Quality over padding — these are the strongest things I've built so far, with evidence, not claims."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.1}>
            <article className="card group flex h-full flex-col p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-subtle">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <Badge>{project.category}</Badge>
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 leading-7 text-muted">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>

              {(project.problem || project.approach) && (
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
                      ["approach", "results", "lessons"] as const
                    ).map((field) => {
                      const value = project[field];
                      if (!value) return null;
                      return (
                        <div key={field}>
                          <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                            {fieldLabels[field]}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted">
                            {value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </details>
              )}

              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
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
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
