import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-20", className)}>
      <div className="container-shell">
        {(eyebrow || title) && (
          <Reveal>
            <header
              className={cn(
                "mb-10 max-w-2xl",
                align === "center" && "mx-auto text-center",
              )}
            >
              {eyebrow && (
                <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-4 leading-7 text-muted">{description}</p>
              )}
            </header>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
