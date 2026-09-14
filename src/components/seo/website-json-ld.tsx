import { seo } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

// Schema.org WebSite for the homepage — ties the site name to the canonical
// URL. Combined with the Person entity it helps Google associate the owner
// with the site.
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo.siteName,
    url: seo.siteUrl,
    description: seo.description,
  };

  return <JsonLd data={data} />;
}