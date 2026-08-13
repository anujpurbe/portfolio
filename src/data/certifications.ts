import type { Certification } from "@/lib/types";

// Central source of truth for certifications.
// Titles, dates, and issuers come from the user. Add `verificationUrl`,
// `credentialId`, or `linkedinUrl` only once real URLs exist — never invent them.
export const certifications: Certification[] = [
  {
    title: "Advanced Python Developer Training",
    issuer: "Codingal",
    date: "2023",
  },
  {
    title: "SQL Developer Certification",
    issuer: "Codingal",
  },
  {
    title: "Data Science Fundamentals",
    issuer: "Codingal",
  },
  {
    title: "Web Development Course",
    issuer: "Codingal",
  },
];
