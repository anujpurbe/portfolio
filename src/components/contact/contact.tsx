"use client";

import { useState } from "react";
import { CheckCircle2, Download, Loader2, Send, XCircle } from "lucide-react";
import { site } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

const MAX_MESSAGE = 1200;

function validate(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  const errors: Record<string, string> = {};
  if (name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Enter a valid email address.";
  if (subject.trim().length < 3)
    errors.subject = "Add a short subject (3+ characters).";
  if (message.trim().length < 10)
    errors.message = "Message should be at least 10 characters.";
  return errors;
}

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [configured, setConfigured] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honey) return;

    const nextErrors = validate(name, email, subject, message);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name: name,
          reply_to: email,
          subject,
          message,
          website: honey,
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        configured?: boolean;
      } | null;
      if (!res.ok) {
        if (json?.configured === false) {
          setConfigured(false);
          setStatus("error");
          return;
        }
        throw new Error("send failed");
      }
      setStatus("success");
      setConfigured(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-lg border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
      errors[field] ? "border-red-500/60" : "border-border",
    );

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's talk"
      description="Open to software engineering internships for Summer 2027 — plus projects and collaborations worth building together."
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="space-y-4">
            <p className="leading-7 text-muted">
              I&apos;m currently available for internships starting Summer 2027
              (May 2027 onwards). If the timing doesn&apos;t line up, I&apos;m
              still happy to talk projects and collaborations.
            </p>
            <dl className="card divide-y divide-border overflow-hidden">
              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-subtle">
                  Open to
                </dt>
                <dd className="text-right text-sm leading-6 text-muted">
                  Software engineering internships, full-stack and backend
                  roles, DSA-focused technical interviews.
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-subtle">
                  Best for
                </dt>
                <dd className="text-right text-sm leading-6 text-muted">
                  Teams that value clean schema design, explainable algorithms,
                  and honest engineering documentation.
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-subtle">
                  Response time
                </dt>
                <dd className="text-right text-sm text-muted">
                  Within 1–2 business days.
                </dd>
              </div>
            </dl>
            <p className="leading-7 text-muted">
              For a quick note, email me at{" "}
              <a
                href={site.socials.email.href}
                className="focus-ring text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
              >
                {site.socials.email.handle}
              </a>{" "}
              — or use the form and I&apos;ll reply within a day or two.
            </p>
            <a
              href={site.resume}
              download
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/60 hover:text-foreground"
            >
              <Download className="size-4" />
              Download resume
            </a>
            <dl className="card divide-y divide-border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-subtle">
                  GitHub
                </dt>
                <dd>
                  <a
                    href={site.socials.github.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted-link text-sm"
                  >
                    {site.socials.github.handle}
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-subtle">
                  LinkedIn
                </dt>
                <dd>
                  <a
                    href={site.socials.linkedin.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted-link text-sm"
                  >
                    {site.socials.linkedin.handle}
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-subtle">
                  Instagram
                </dt>
                <dd>
                  <a
                    href={site.socials.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted-link text-sm"
                  >
                    {site.socials.instagram.handle}
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-subtle">
                  Location
                </dt>
                <dd className="text-sm text-muted">Chennai, India (IST)</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                    className={inputClass("name")}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ada@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.email}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-subtle">
                    You control what you enter — it&apos;s used only as the
                    Reply-To on my notification email.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Subject
                </label>
                <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Software engineering internship"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={
                    errors.subject ? "contact-subject-error" : undefined
                  }
                  className={inputClass("subject")}
                />
                {errors.subject && (
                  <p
                    id="contact-subject-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-500"
                  >
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 flex items-center justify-between text-sm font-medium"
                >
                  Message
                  <span className="font-mono text-xs text-subtle">
                    {message.length}/{MAX_MESSAGE}
                  </span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value.slice(0, MAX_MESSAGE))
                  }
                  placeholder="Tell me about the role, project, or idea…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  className={cn(inputClass("message"), "resize-y")}
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-500"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="focus-ring btn-lift inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send message
                    </>
                  )}
                </button>

                {status === "success" && (
                  <p
                    role="status"
                    className="inline-flex items-center gap-1.5 text-sm text-emerald-500"
                  >
                    <CheckCircle2 className="size-4" />
                    Message sent successfully. I&apos;ll get back to you as soon
                    as I can.
                  </p>
                )}
                {status === "error" && (
                  <p
                    role="alert"
                    className="inline-flex items-center gap-1.5 text-sm text-red-500"
                  >
                    <XCircle className="size-4" />
                    {configured ? (
                      <>
                        Something went wrong. Please try again or email me{" "}
                        <a
                          href={site.socials.email.href}
                          className="underline decoration-red-500/40 underline-offset-4"
                        >
                          directly
                        </a>
                        .
                      </>
                    ) : (
                      <>
                        The contact form isn&apos;t connected yet — email me{" "}
                        <a
                          href={site.socials.email.href}
                          className="underline decoration-red-500/40 underline-offset-4"
                        >
                          directly
                        </a>{" "}
                        and I&apos;ll get back to you.
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
