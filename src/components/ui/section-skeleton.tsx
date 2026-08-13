import { Loader2 } from "lucide-react";

export function SectionSkeleton({ label }: { label: string }) {
  return (
    <div className="py-20 sm:py-28">
      <div className="container-shell">
        <div className="card flex items-center justify-center gap-3 p-10">
          <Loader2 className="size-5 animate-spin text-accent" />
          <p className="font-mono text-xs uppercase tracking-widest text-subtle">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
