import type { Certification } from "@/lib/types";

// Central source of truth for certifications.
// Each entry has its original certificate PDF under public/certificates/
// and a rendered first-page thumbnail under public/certificates/thumbs/.
// Titles, issuers and dates come from the user; nothing is invented. If real
// credential/verification/LinkedIn URLs exist later, add them here.
export const certifications: Certification[] = [
  {
    title: "Advanced Python Developer Training",
    issuer: "Codingal",
    date: "2023",
    description:
      "Structured Python training covering core language fundamentals through advanced topics.",
    thumbnail: "/certificates/thumbs/advanced-python-developer.webp",
    preview: "/certificates/advanced-python-developer.pdf",
    file: "/certificates/advanced-python-developer.pdf",
  },
  {
    title: "SQL Developer Certification",
    issuer: "Codingal",
    description:
      "Hands-on SQL training focused on writing queries and working with relational data.",
    thumbnail: "/certificates/thumbs/sql-developer.webp",
    preview: "/certificates/sql-developer.pdf",
    file: "/certificates/sql-developer.pdf",
  },
  {
    title: "Data Science Fundamentals",
    issuer: "Codingal",
    description:
      "Foundational data science course covering data handling and analysis concepts.",
    thumbnail: "/certificates/thumbs/data-scientist.webp",
    preview: "/certificates/data-scientist.pdf",
    file: "/certificates/data-scientist.pdf",
  },
  {
    title: "Web Development Course",
    issuer: "Codingal",
    description:
      "Practical web development training covering front-end and site building fundamentals.",
    thumbnail: "/certificates/thumbs/web-developer.webp",
    preview: "/certificates/web-developer.pdf",
    file: "/certificates/web-developer.pdf",
  },
  {
    title: "Java Certification",
    description:
      "Java programming certification covering core language and object-oriented concepts.",
    thumbnail: "/certificates/thumbs/java.webp",
    preview: "/certificates/java.pdf",
    file: "/certificates/java.pdf",
  },
  {
    title: "Database Management Systems",
    description:
      "Coursework covering relational database design and database management concepts.",
    thumbnail: "/certificates/thumbs/dbms.webp",
    preview: "/certificates/dbms.pdf",
    file: "/certificates/dbms.pdf",
  },
  {
    title: "Coding Champion",
    description:
      "Competitive programming certification earned through problem-solving practice.",
    thumbnail: "/certificates/thumbs/coding-champion.webp",
    preview: "/certificates/coding-champion.pdf",
    file: "/certificates/coding-champion.pdf",
  },
  {
    title: "IBM Design",
    description:
      "IBM Design certification covering design thinking and user experience fundamentals.",
    thumbnail: "/certificates/thumbs/ibm-design.webp",
    preview: "/certificates/ibm-design.pdf",
    file: "/certificates/ibm-design.pdf",
  },
];
