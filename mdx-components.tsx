import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const components: MDXComponents = {
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="mt-12 mb-4 scroll-mt-28 text-2xl font-semibold tracking-tight text-balance"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="mt-8 mb-3 scroll-mt-28 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-7 text-muted">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-2 pl-5 leading-7 text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-2 pl-5 leading-7 text-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-accent/50 pl-4 text-muted italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock =
      typeof className === "string" && className.includes("language-");
    if (isBlock) {
      return (
        <code className="block font-mono text-[0.875em] leading-6">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm leading-6">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
