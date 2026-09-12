import { ldJson } from "@/lib/seo";

/**
 * One structured-data block. Accepts a single object or several; each gets
 * its own <script> so a malformed entry cannot invalidate its neighbours.
 */
export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ldJson(d) }}
        />
      ))}
    </>
  );
}
