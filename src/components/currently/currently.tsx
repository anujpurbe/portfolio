import { Compass, Hammer, BookOpen } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const blocks = [
  {
    icon: BookOpen,
    label: "LEARNING",
    items: profile.currently.learning,
  },
  {
    icon: Hammer,
    label: "BUILDING",
    text: profile.currently.building,
  },
  {
    icon: Compass,
    label: "EXPLORING",
    items: profile.currently.exploring,
  },
];

export function Currently() {
  return (
    <Section
      eyebrow="Currently"
      title="What I'm working on right now"
      description="This block gets updated monthly so the site never looks stale."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((block, i) => {
          const Icon = block.icon;
          return (
            <Reveal key={block.label} delay={i * 0.08}>
              <div className="card h-full p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Icon className="size-4 text-accent" />
                  <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
                    {block.label}
                  </h3>
                </div>
                {block.items ? (
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li key={item} className="text-sm leading-6 text-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-6 text-foreground">
                    {block.text}
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
