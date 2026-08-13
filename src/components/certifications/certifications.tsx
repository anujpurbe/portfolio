"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, Download, ExternalLink } from "lucide-react";
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
      description="Evidence-backed — open any card to view the original certificate."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {certifications.map((cert, i) => {
          const viewable = Boolean(cert.preview || cert.file);
          return (
            <Reveal key={cert.title} delay={i * 0.06}>
              {viewable ? (
                <article className="card card-hover group flex h-full flex-col overflow-hidden">
                  <button
                    type="button"
                    onClick={() => openCertificate(cert)}
                    aria-haspopup="dialog"
                    aria-label={`View ${cert.title} certificate`}
                    className="focus-ring block w-full text-left"
                  >
                    {cert.thumbnail && (
                      <span className="relative block aspect-[3/2] w-full overflow-hidden border-b border-border bg-surface-2">
                        <Image
                          src={cert.thumbnail}
                          alt={`${cert.title} certificate preview`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </span>
                    )}
                    <span className="flex flex-col gap-1.5 px-5 pt-4">
                      <span className="flex items-start gap-2">
                        <Award className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span className="block text-sm font-semibold leading-5">
                          {cert.title}
                        </span>
                      </span>
                      {(cert.issuer || cert.date) && (
                        <span className="block font-mono text-xs text-subtle">
                          {cert.issuer}
                          {cert.issuer && cert.date ? " · " : ""}
                          {cert.date}
                        </span>
                      )}
                      {cert.description && (
                        <span className="mt-1 block text-sm leading-5 text-muted">
                          {cert.description}
                        </span>
                      )}
                    </span>
                  </button>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-border px-5 py-3">
                    <button
                      type="button"
                      onClick={() => openCertificate(cert)}
                      aria-haspopup="dialog"
                      className="focus-ring btn-lift inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
                    >
                      View certificate
                    </button>
                    {cert.file && (
                      <a
                        href={cert.file}
                        download
                        className="focus-ring btn-lift inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-accent/50 hover:text-foreground"
                      >
                        <Download className="size-3.5" />
                        Download
                      </a>
                    )}
                  </div>
                </article>
              ) : (
                <div className="card flex h-full flex-col items-start gap-3 p-5">
                  <Award className="size-5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold">{cert.title}</p>
                    {(cert.issuer || cert.date) && (
                      <p className="mt-1 font-mono text-xs text-subtle">
                        {cert.issuer}
                        {cert.issuer && cert.date ? " · " : ""}
                        {cert.date}
                      </p>
                    )}
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
