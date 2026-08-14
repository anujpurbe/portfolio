"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyLink() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — ignore silently.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy article link"
      className={cn(
        "focus-ring inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
        copied
          ? "border-accent/60 bg-accent/10 text-accent"
          : "border-border text-subtle hover:text-foreground",
      )}
    >
      {copied ? (
        <Check className="size-3.5" />
      ) : (
        <Link2 className="size-3.5" />
      )}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
