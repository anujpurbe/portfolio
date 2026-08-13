import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function hasPhoto() {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", site.photo.primary),
    );
  } catch {
    return false;
  }
}

export function ProfilePhoto({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const available = hasPhoto();

  if (!available) {
    return (
      <div
        role="img"
        aria-label="Anuj Purbe portrait"
        className={cn(
          "relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface-2 to-surface p-6",
          className,
        )}
      >
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-16 -right-16 size-56 rounded-full bg-accent/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">
            portrait
          </p>
          <p className="mt-2 font-mono text-5xl font-bold tracking-tight">
            {site.initials}
          </p>
          <p className="mt-2 text-xs text-subtle">
            Drop your photo at{" "}
            <code className="rounded bg-surface px-1 py-0.5 font-mono text-[10px]">
              public/images/profile/anuj-purbe.webp
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border",
        className,
      )}
    >
      <Image
        src={site.photo.primary}
        alt="Portrait of Anuj Purbe"
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 420px"
        className="object-cover"
      />
    </div>
  );
}
