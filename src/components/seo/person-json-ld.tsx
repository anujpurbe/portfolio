import { seo } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

// Schema.org Person — the primary identity entity for Anuj Purbe.
// `sameAs` mirrors the exact profiles already linked in the site (site.ts)
// so Google can connect this website to the GitHub / LinkedIn / Instagram
// profiles of the same real person. Only fields backed by real site data are
// populated.
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: seo.person.name,
    url: seo.siteUrl,
    image: seo.person.image,
    description: seo.person.description,
    jobTitle: seo.person.role,
    email: `mailto:${seo.person.email}`,
    sameAs: seo.person.sameAs,
    alumniOf: seo.person.alumniOf,
    affiliation: seo.person.affiliation,
    knowsAbout: seo.person.knowsAbout,
  };

  return <JsonLd data={data} />;
}