import type { Certification } from "@/lib/types";

// Central source of truth for certifications.
// Each entry has its original certificate PDF under public/certificates/.
// Dates and titles come from the user; nothing is invented. If real
// credential/verification/LinkedIn URLs exist later, add them here.
export const certifications: Certification[] = [
  {
    title: "Advanced Python Developer Training",
    issuer: "Codingal",
    date: "2023",
    preview: "/certificates/advanced-python-developer.pdf",
    file: "/certificates/advanced-python-developer.pdf",
  },
  {
    title: "SQL Developer Certification",
    issuer: "Codingal",
    preview: "/certificates/sql-developer.pdf",
    file: "/certificates/sql-developer.pdf",
  },
  {
    title: "Data Science Fundamentals",
    issuer: "Codingal",
    preview: "/certificates/data-scientist.pdf",
    file: "/certificates/data-scientist.pdf",
  },
  {
    title: "Web Development Course",
    issuer: "Codingal",
    preview: "/certificates/web-developer.pdf",
    file: "/certificates/web-developer.pdf",
  },
  {
    title: "Java Certification",
    preview: "/certificates/java.pdf",
    file: "/certificates/java.pdf",
  },
  {
    title: "Database Management Systems",
    preview: "/certificates/dbms.pdf",
    file: "/certificates/dbms.pdf",
  },
  {
    title: "Coding Champion",
    preview: "/certificates/coding-champion.pdf",
    file: "/certificates/coding-champion.pdf",
  },
  {
    title: "IBM Design",
    preview: "/certificates/ibm-design.pdf",
    file: "/certificates/ibm-design.pdf",
  },
];
