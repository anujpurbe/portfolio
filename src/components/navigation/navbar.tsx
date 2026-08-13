"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FileText, Menu, Send, X } from "lucide-react";
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

const sectionIds = ["about", "projects", "skills", "achievements", "contact"];

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return active;
}

export function Navbar() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  const onHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-shell shadow-sm"
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
            const isHash = item.href.startsWith("/#");
            const isActive = isHash
              ? onHome && active === item.href.slice(2)
              : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "focus-ring relative rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
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
          <Link
            href="/#contact"
            className="focus-ring hidden items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 lg:inline-flex"
          >
            <Send className="size-3.5" />
            Contact Me
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring grid size-9 place-items-center rounded-md text-muted transition-colors hover:text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
            aria-label="Mobile"
          >
            <div className="container-shell flex flex-col py-3">
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <span className="font-mono text-[10px] text-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border px-2 pt-3 pb-1">
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
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
                >
                  <Send className="size-3.5" /> Contact Me
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
