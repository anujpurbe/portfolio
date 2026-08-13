import Link from "next/link";
import { Mail, FileText } from "lucide-react";
import { site } from "@/data/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-shell flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <p className="text-sm font-medium">{site.fullName}</p>
          <p className="text-xs text-subtle">
            © {year} Anuj Purbe. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer" className="flex items-center gap-2">
          <a
            href={site.socials.github.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="focus-ring grid size-9 place-items-center rounded-md text-muted transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={site.socials.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="focus-ring grid size-9 place-items-center rounded-md text-muted transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href={site.socials.email.href}
            aria-label="Email"
            className="focus-ring grid size-9 place-items-center rounded-md text-muted transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
          </a>
          <a
            href={site.resume}
            download
            aria-label="Download resume"
            className="focus-ring ml-1 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            <FileText className="size-3.5" />
            Resume
          </a>
        </nav>

        <Link
          href="/journal"
          className="focus-ring rounded-md text-xs text-subtle transition-colors hover:text-muted"
        >
          Built in public · Journal
        </Link>
      </div>
    </footer>
  );
}
