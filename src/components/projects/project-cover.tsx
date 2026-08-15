import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

function hasAsset(asset: string | undefined) {
  if (!asset) return false;
  try {
    return fs.existsSync(path.join(process.cwd(), "public", asset));
  } catch {
    return false;
  }
}

function FallbackCover({ project }: { project: Project }) {
  return (
    <div
      role="img"
      aria-label={`${project.title} — cover image coming soon`}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-surface-2 via-card to-surface"
    >
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-10 -right-10 size-40 rounded-full bg-accent/15 blur-3xl dark:bg-accent/20"
        aria-hidden="true"
      />
      <div className="relative flex max-w-sm flex-col items-center gap-3 px-6 text-center">
        <span className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
          <LayoutGrid className="size-5" />
        </span>
        <p className="text-sm font-semibold leading-6 text-balance">
          {project.title}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-subtle">
          {project.category}
        </p>
      </div>
    </div>
  );
}

export function ProjectCover({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const cover = project.media?.cover;
  const available = hasAsset(cover);

  return (
    <div
      className={cn(
        "aspect-[16/9] w-full overflow-hidden rounded-xl border border-border",
        className,
      )}
    >
      {available ? (
        <Image
          src={cover!}
          alt={`${project.title} cover`}
          width={1024}
          height={576}
          className="h-full w-full object-cover"
        />
      ) : (
        <FallbackCover project={project} />
      )}
    </div>
  );
}
