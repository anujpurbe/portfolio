import { ArrowRight, Eye, Mail } from "lucide-react";
import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { HeroNetwork } from "@/components/hero/hero-network";
import { AskAnuj } from "@/components/hero/ask-anuj";
import { RotatingWord } from "@/components/hero/rotating-word";
import { ProfilePhoto } from "@/components/hero/profile-photo";
import { ParallaxFrame } from "@/components/hero/parallax-frame";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const verbs = ["BUILD", "SOLVE", "DESIGN", "LEARN", "CREATE"];

const socials = [
  {
    label: "GitHub",
    href: site.socials.github.href,
    external: true,
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: site.socials.linkedin.href,
    external: true,
    icon: LinkedinIcon,
  },
  {
    label: "Instagram",
    href: site.socials.instagram.href,
    external: true,
    icon: InstagramIcon,
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 sm:pt-36 sm:pb-20">
      <HeroNetwork />
      <div
        className="bg-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="orb -top-32 left-[8%] h-80 w-80 bg-accent/15 animate-orb-drift dark:bg-accent/20"
        aria-hidden="true"
      />
      <div
        className="orb top-1/3 right-[4%] h-72 w-72 bg-violet-400/10 animate-orb-drift dark:bg-violet-500/10"
        style={{ animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="container-shell relative grid items-center gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12">
        <div className="lg:translate-y-12">
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
            <p className="mt-3 font-mono text-lg tracking-wide text-muted sm:text-xl">
              I <RotatingWord words={verbs} />
            </p>
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
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <ul className="mt-10 flex flex-wrap items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <Magnetic strength={0.25}>
                      <a
                        href={social.href}
                        target={social.external ? "_blank" : undefined}
                        rel={social.external ? "noopener noreferrer" : undefined}
                        className="focus-ring muted-link inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-4 py-2 text-sm shadow-sm transition-colors hover:border-accent/50 hover:text-foreground"
                      >
                        <Icon className="size-4" />
                        {social.label}
                      </a>
                    </Magnetic>
                  </li>
                );
              })}
              <li>
                <a
                  href={site.socials.email.href}
                  className="focus-ring muted-link inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
                >
                  <Mail className="size-4" />
                  {site.socials.email.handle}
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={28}>
          <div className="flex flex-col items-center gap-7 lg:gap-8">
            <ParallaxFrame>
              <div className="group relative">
                <div
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/20 to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div
                  className="photo-ring photo-ring-anim"
                  aria-hidden="true"
                />
                <div className="relative w-56 animate-float sm:w-72">
                  <ProfilePhoto
                    priority
                    className="transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </ParallaxFrame>
            <div className="w-full max-w-md">
              <AskAnuj />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
