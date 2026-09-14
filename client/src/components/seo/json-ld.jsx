// Renders one or more schema.org objects as a single JSON-LD <script> tag.
// Server component — no client JS needed for a static data blob.
export function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(items.length === 1 ? items[0] : items) }}
    />
  );
}
