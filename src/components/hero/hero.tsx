import { ArrowRight, Download, Mail } from "lucide-react";
import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SystemDiagram } from "@/components/hero/system-diagram";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
              <span
                className="size-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              <span className="font-mono text-xs text-muted">
                {site.availability.label}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
              {profile.heroEyebrow}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              {profile.heroName}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted text-balance">
              {profile.heroTagline}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/#projects">
                View Projects
                <ArrowRight className="size-4" />
              </Button>
              <Button href={site.resume} variant="outline" download>
                <Download className="size-4" />
                Download Resume
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <li>
                <a
                  href={site.socials.github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring muted-link inline-flex items-center gap-2 rounded-md text-sm"
                >
                  <GithubIcon className="size-4" />
                  {site.socials.github.handle}
                </a>
              </li>
              <li>
                <a
                  href={site.socials.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring muted-link inline-flex items-center gap-2 rounded-md text-sm"
                >
                  <LinkedinIcon className="size-4" />
                  {site.socials.linkedin.handle}
                </a>
              </li>
              <li>
                <a
                  href={site.socials.email.href}
                  className="focus-ring muted-link inline-flex items-center gap-2 rounded-md text-sm"
                >
                  <Mail className="size-4" />
                  {site.socials.email.handle}
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={32}>
          <SystemDiagram steps={profile.heroSystem} />
        </Reveal>
      </div>
    </section>
  );
}
