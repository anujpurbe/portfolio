import { Award, ExternalLink } from "lucide-react";
import { certifications } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Certifications() {
  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title="Verified training"
      description="Quality over quantity — no padding with trivial badges."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {certifications.map((cert, i) => (
          <Reveal key={cert.title} delay={i * 0.06}>
            <a
              href={cert.verificationUrl ?? "#contact"}
              className={cn(
                "card group flex h-full items-center gap-4 p-5",
                cert.verificationUrl && "hover:border-accent/50",
              )}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                <Award className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-6">{cert.title}</h3>
                <p className="mt-1 text-sm text-subtle">
                  {cert.issuer}
                  {cert.date ? ` · ${cert.date}` : ""}
                </p>
              </div>
              {cert.verificationUrl && (
                <ExternalLink className="size-4 shrink-0 text-subtle transition-colors group-hover:text-accent" />
              )}
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
