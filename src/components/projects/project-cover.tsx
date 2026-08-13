import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  Activity,
  BatteryCharging,
  Binary,
  LayoutGrid,
  Table2,
  Utensils,
} from "lucide-react";
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

const placeholderConfig: Record<
  string,
  { icon: typeof Binary; tag: string; note: string; lines: string[] }
> = {
  "dsa-algorithms": {
    icon: Binary,
    tag: "java · dsa",
    note: "/* source */",
    lines: [
      "Stack<Integer> stack = new Stack<>();",
      "stack.push(1);",
      "while (!stack.isEmpty()) {",
      "  int top = stack.pop();",
      "  // process top…",
      "}",
    ],
  },
  "sql-database": {
    icon: Table2,
    tag: "schema · sql",
    note: "/* relational */",
    lines: [
      "SELECT u.name, o.total",
      "FROM users u",
      "JOIN orders o ON o.user_id = u.id",
      "GROUP BY u.id",
      "HAVING SUM(o.total) > 0;",
    ],
  },
  hiingers: {
    icon: Activity,
    tag: "typescript · python",
    note: "/* realtime */",
    lines: [
      "const socket = new WebSocket(url);",
      "socket.onmessage = (event) => {",
      "  const bid = JSON.parse(event.data);",
      "  allocateHospitalBed(bid);",
      "};",
    ],
  },
  "atomic-endurance": {
    icon: BatteryCharging,
    tag: "python · pandas",
    note: "/* data */",
    lines: [
      "df = pd.read_csv('cycles.csv')",
      "capacity = df.groupby('cycle')",
      "  ['discharge'].mean()",
      "degradation = fit_curve(capacity)",
      "predict_remaining_life()",
    ],
  },
  foodiehub: {
    icon: Utensils,
    tag: "javascript · firebase",
    note: "/* ordering */",
    lines: [
      "const order = await addDoc(cart, {",
      "  items, total, customerId",
      "});",
      "sendPushNotification(order.id);",
      "renderOrderConfirmation(order);",
    ],
  },
  portfolio: {
    icon: LayoutGrid,
    tag: "typescript · next.js",
    note: "/* this site */",
    lines: [
      "export default function Home() {",
      "  return (",
      "    <Suspense fallback={null}>",
      "      <Section id='projects' />",
      "    </Suspense>",
      "  );",
      "}",
    ],
  },
};

function Placeholder({ project }: { project: Project }) {
  const config = placeholderConfig[project.slug] ?? placeholderConfig.portfolio;
  const Icon = config.icon;
  const lines = config.lines;

  return (
    <div
      role="img"
      aria-label={`${project.title} — cover placeholder`}
      className="relative flex h-full w-full items-center overflow-hidden bg-gradient-to-br from-surface-2 via-card to-surface"
    >
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-10 -right-10 size-40 rounded-full bg-accent/15 blur-3xl dark:bg-accent/20"
        aria-hidden="true"
      />
      <div className="relative w-full p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
              <Icon className="size-4" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
              {config.tag}
            </span>
          </div>
          <span className="font-mono text-[10px] text-subtle">
            {config.note}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-navy-900/80 p-3 font-mono text-[11px] leading-5 text-emerald-300/90 shadow-lg dark:bg-black/40">
          {lines.map((line) => (
            <div key={line} className="whitespace-pre">
              <span className="text-emerald-400/60 select-none">$ </span>
              {line}
            </div>
          ))}
        </div>
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

  if (!available) {
    return (
      <div
        className={cn(
          "aspect-[16/9] w-full overflow-hidden rounded-xl border border-border",
          className,
        )}
      >
        <Placeholder project={project} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "aspect-[16/9] w-full overflow-hidden rounded-xl border border-border",
        className,
      )}
    >
      <Image
        src={cover!}
        alt={`${project.title} cover`}
        width={1024}
        height={576}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
