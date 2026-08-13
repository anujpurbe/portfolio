"use client";

import { useState } from "react";
import { Award, BadgeCheck, ExternalLink } from "lucide-react";
import { certifications } from "@/data/certifications";
import type { Certification } from "@/lib/types";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CertificateViewer } from "@/components/certifications/certificate-viewer";

export function Certifications() {
  const [active, setActive] = useState<Certification | null>(null);
  const [open, setOpen] = useState(false);

  const openCertificate = (cert: Certification) => {
    setActive(cert);
    setOpen(true);
  };

  return (
    <Section
      id="certifications"
      eyebrow="Credentials"
      title="Certifications"
      description="Evidence-backed — click a card to open the original certificate."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {certifications.map((cert, i) => {
          const viewable = Boolean(cert.preview || cert.file);
          return (
            <Reveal key={cert.title} delay={i * 0.06}>
              {viewable ? (
                <button
                  type="button"
                  onClick={() => openCertificate(cert)}
                  className="card card-hover focus-ring flex h-full w-full flex-col items-start gap-3 p-5 text-left"
                >
                  <Award className="size-5 text-accent" />
                  <span>
                    <span className="block text-sm font-semibold">
                      {cert.title}
                    </span>
                    <span className="mt-1 block font-mono text-xs text-subtle">
                      {cert.issuer}
                    </span>
                  </span>
                  <span className="mt-auto flex items-center gap-1.5 rounded-md border border-emerald-500/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <BadgeCheck className="size-3" />
                    View certificate
                  </span>
                </button>
              ) : (
                <div className="card flex h-full flex-col items-start gap-3 p-5">
                  <Award className="size-5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold">{cert.title}</p>
                    <p className="mt-1 font-mono text-xs text-subtle">
                      {cert.issuer}
                      {cert.date ? ` · ${cert.date}` : ""}
                    </p>
                  </div>
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring muted-link mt-auto inline-flex items-center gap-1 rounded-md text-xs font-medium"
                    >
                      Verify
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                  {cert.linkedinUrl && (
                    <a
                      href={cert.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring muted-link mt-auto inline-flex items-center gap-1 rounded-md text-xs font-medium"
                    >
                      View on LinkedIn
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              )}
            </Reveal>
          );
        })}
      </div>

      <CertificateViewer
        certificate={active}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Section>
  );
}
