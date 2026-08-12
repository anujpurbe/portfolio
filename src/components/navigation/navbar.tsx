"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GithubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

export function Navbar() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring flex items-center gap-2 rounded-md font-semibold tracking-tight"
          aria-label="Home"
        >
          <span className="grid size-7 place-items-center rounded-md bg-accent font-mono text-xs font-bold text-accent-foreground">
            {site.initials}
          </span>
          <span className="hidden text-sm text-foreground sm:inline">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {site.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/#")
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "focus-ring rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={site.socials.github.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="focus-ring hidden size-9 place-items-center rounded-md text-muted transition-colors hover:text-foreground sm:grid"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={site.resume}
            download
            aria-label="Download resume"
            className="focus-ring hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground sm:flex"
          >
            <FileText className="size-3.5" />
            Resume
          </a>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring grid size-9 place-items-center rounded-md text-muted transition-colors hover:text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-background lg:hidden"
          aria-label="Mobile"
        >
          <div className="container-shell flex flex-col py-3">
            {site.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-2 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-4 border-t border-border px-2 pt-3 pb-1">
              <a
                href={site.socials.github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground"
              >
                <GithubIcon className="size-4" /> GitHub
              </a>
              <a
                href={site.resume}
                download
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground"
              >
                <FileText className="size-4" /> Resume
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
