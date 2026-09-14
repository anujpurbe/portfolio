import { site } from "@/data/site";
import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { currentStack } from "@/data/skills";

// Centralized SEO configuration — single source of truth.
//
// TODO(domain-migration): when a custom domain is added, change `site.url`
// in src/data/site.ts to the new URL (e.g. https://anujpurbe.in). Everything
// below (metadataBase, canonical, OG URLs, sitemap, robots, JSON-LD,
// profile URLs) derives from it automatically.

const baseUrl = site.url.replace(/\/+$/, "");

export const seo = {
  siteUrl: baseUrl,
  siteName: site.name,
  fullName: site.fullName,
  role: site.role,
  title: site.seo.title,
  titleTemplate: site.seo.titleTemplate,
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  openGraphImage: `${baseUrl}${site.seo.openGraphImage}`,
  openGraphImageWidth: 1731,
  openGraphImageHeight: 909,
  googleSiteVerification: site.seo.googleSiteVerification,
  person: {
    name: site.fullName,
    role: site.role,
    description: profile.heroTagline,
    image: `${baseUrl}${site.photo.primary}`,
    email: site.email,
    socials: {
      github: site.socials.github.href,
      linkedin: site.socials.linkedin.href,
      instagram: site.socials.instagram.href,
    },
    sameAs: [
      site.socials.github.href,
      site.socials.linkedin.href,
      site.socials.instagram.href,
    ],
    alumniOf: education
      .filter((item) => !item.period.toLowerCase().includes("present"))
      .map((item) => ({
        "@type": "EducationalOrganization",
        name: item.institution,
      })),
    affiliation: education
      .filter((item) => item.period.toLowerCase().includes("present"))
      .map((item) => ({
        "@type": "EducationalOrganization",
        name: item.institution,
      })),
    knowsAbout: currentStack.map((tech) => tech.name),
  },
};