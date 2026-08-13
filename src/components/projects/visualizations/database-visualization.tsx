"use client";

import { useState } from "react";
import { Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TableNode = {
  id: string;
  label: string;
  columns: string[];
  color: string;
};

const TABLES: TableNode[] = [
  {
    id: "users",
    label: "users",
    columns: ["id PK", "name", "email"],
    color: "border-sky-400/40 text-sky-400",
  },
  {
    id: "orders",
    label: "orders",
    columns: ["id PK", "user_id FK", "total"],
    color: "border-violet-400/40 text-violet-400",
  },
  {
    id: "order_items",
    label: "order_items",
    columns: ["id PK", "order_id FK", "product_id FK", "qty"],
    color: "border-amber-400/40 text-amber-400",
  },
  {
    id: "products",
    label: "products",
    columns: ["id PK", "name", "price"],
    color: "border-emerald-400/40 text-emerald-400",
  },
  {
    id: "payments",
    label: "payments",
    columns: ["id PK", "order_id FK", "amount", "status"],
    color: "border-cyan-400/40 text-cyan-400",
  },
];

type Query = {
  id: string;
  label: string;
  sql: string;
  focus: string[];
};

const QUERIES: Query[] = [
  {
    id: "join",
    label: "JOIN",
    sql: "SELECT * FROM orders\nJOIN users ON orders.user_id = users.id;",
    focus: ["users", "orders"],
  },
  {
    id: "group",
    label: "GROUP BY",
    sql: "SELECT product_id, SUM(qty) AS sold\nFROM order_items\nGROUP BY product_id;",
    focus: ["order_items", "products"],
  },
  {
    id: "agg",
    label: "Aggregation",
    sql: "SELECT u.name, SUM(o.total) AS spent\nFROM users u\nJOIN orders o ON o.user_id = u.id\nGROUP BY u.id\nHAVING SUM(o.total) > 0;",
    focus: ["users", "orders"],
  },
];

const FLOW: string[][] = [
  ["users", "orders", "payments"],
  ["order_items"],
  ["products"],
];

export function DatabaseVisualization() {
  const [queryId, setQueryId] = useState<string | null>(null);
  const query = QUERIES.find((q) => q.id === queryId);

  const tableById = (id: string) => TABLES.find((t) => t.id === id)!;

  const focused = query ? new Set(query.focus) : null;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-1 inline-flex items-center gap-1.5 font-mono text-xs text-subtle">
          <Table2 className="size-3.5" /> run a query:
        </p>
        {QUERIES.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setQueryId(queryId === q.id ? null : q.id)}
            className={cn(
              "focus-ring rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
              queryId === q.id
                ? "border-accent bg-accent-soft text-foreground"
                : "border-border text-muted hover:border-accent/50",
            )}
          >
            {q.label}
          </button>
        ))}
        {queryId && (
          <button
            type="button"
            onClick={() => setQueryId(null)}
            className="focus-ring ml-auto font-mono text-xs text-subtle hover:text-foreground"
          >
            clear
          </button>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-1.5">
        {FLOW.map((row, ri) => (
          <div key={ri}>
            <div className="flex flex-wrap items-stretch justify-center gap-1.5">
              {row.map((id) => {
                const table = tableById(id);
                const involved = !focused || focused.has(id);
                return (
                  <div
                    key={id}
                    className={cn(
                      "w-40 rounded-lg border bg-card p-3 transition-all duration-300",
                      table.color,
                      involved
                        ? "opacity-100"
                        : "opacity-35 saturate-50",
                    )}
                  >
                    <p className="font-mono text-xs font-semibold">
                      {table.label}
                    </p>
                    <ul className="mt-1.5 space-y-0.5">
                      {table.columns.map((col) => (
                        <li
                          key={col}
                          className="truncate font-mono text-[10px] text-muted"
                        >
                          {col}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            {ri < FLOW.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="relative h-5 w-0.5 rounded-full bg-border">
                  <span
                    className={cn(
                      "absolute inset-x-0 top-0 h-full w-full rounded-full",
                      focused
                        ? "bg-accent/40 animate-pulse-soft"
                        : "bg-border",
                    )}
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 rounded-lg border border-border bg-surface/60 p-3">
        {query ? (
          <pre className="overflow-x-auto font-mono text-[11px] leading-5 text-emerald-300/90 dark:text-emerald-300/80">
            {query.sql}
          </pre>
        ) : (
          <p className="text-center font-mono text-[11px] text-subtle">
            A normalized schema — pick a query to trace which tables it touches.
          </p>
        )}
      </div>

      <p className="border-t border-border pt-3 font-mono text-[11px] leading-5 text-subtle">
        Normalized to 3NF: every foreign key points at a primary key, and no
        column duplicates data that lives elsewhere.
      </p>
    </div>
  );
}
