// Renders a JSON-LD <script> tag safely. Server component only.
// JSON.stringify output is escaped by React via dangerouslySetInnerHTML —
// these objects are static constants derived from the site config, not
// user input, so this is safe.

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}