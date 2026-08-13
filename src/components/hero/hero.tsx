import { ArrowRight, Download, Eye, Mail } from "lucide-react";
import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SystemDiagram } from "@/components/hero/system-diagram";
import { ProfilePhoto } from "@/components/hero/profile-photo";
import { ParallaxFrame } from "@/components/hero/parallax-frame";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div
        className="bg-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px] dark:bg-accent/15"
        aria-hidden="true"
      />

      <div className="container-shell relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 shadow-sm">
              <span
                className={cn(
                  "size-2 rounded-full",
                  site.availability.open
                    ? "bg-emerald-500 animate-pulse-soft"
                    : "bg-subtle",
                )}
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
              <Button href={site.resume} variant="outline">
                <Eye className="size-4" />
                View Resume
              </Button>
              <Button href={site.resumeDownload} variant="ghost" download>
                <Download className="size-4" />
                Download
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

        <Reveal delay={0.2} y={28}>
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <ParallaxFrame className="relative">
              <div
                className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/20 to-transparent blur-2xl"
                aria-hidden="true"
              />
              <ProfilePhoto className="relative shadow-elevated" priority />
            </ParallaxFrame>
            <div className="mt-8">
              <SystemDiagram steps={profile.heroSystem} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
