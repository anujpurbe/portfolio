"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BadgeCheck,
  Download,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import type { Certification } from "@/lib/types";

function isPdf(src: string) {
  return src.toLowerCase().endsWith(".pdf");
}

export function CertificateViewer({
  certificate,
  open,
  onClose,
}: {
  certificate: Certification | null;
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  const preview = certificate?.preview;
  const file = certificate?.file;

  return (
    <AnimatePresence>
      {open && certificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-viewer-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <h2
                  id="certificate-viewer-title"
                  className="truncate font-semibold"
                >
                  {certificate.title}
                </h2>
                <p className="mt-0.5 text-xs text-subtle">
                  {certificate.issuer}
                  {certificate.issuer && certificate.date ? " · " : ""}
                  {certificate.date}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close certificate viewer"
                className="focus-ring grid size-9 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-64 flex-1 overflow-auto bg-surface-2">
              {preview ? (
                isPdf(preview) ? (
                  <iframe
                    src={preview}
                    title={`${certificate.title} preview`}
                    className="h-[55vh] w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local certificate files, size is arbitrary */}
                    <img
                      src={preview}
                      alt={`${certificate.title} certificate`}
                      className="max-h-[55vh] w-auto rounded-lg border border-border shadow-md"
                    />
                  </div>
                )
              ) : (
                <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
                  <Loader2 className="size-6 animate-spin text-subtle" />
                  <p className="text-sm text-muted">
                    Preview isn&apos;t available yet — you can still open the
                    original file below.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4">
              {file && (
                <>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    <ExternalLink className="size-4" />
                    Open Original
                  </a>
                  <a
                    href={file}
                    download
                    className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    <Download className="size-4" />
                    Download
                  </a>
                </>
              )}
              {certificate.verificationUrl && (
                <a
                  href={certificate.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:border-emerald-500/70 dark:text-emerald-400"
                >
                  <BadgeCheck className="size-4" />
                  Verify
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
