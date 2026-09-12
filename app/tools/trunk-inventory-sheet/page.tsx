import type { Metadata } from "next";
import { toolBySlug } from "@/content/tools";
import { behind } from "@/content/behind";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";
import PrintButton from "@/components/PrintButton";

const tool = toolBySlug("trunk-inventory-sheet")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Printable Customs Inventory Template`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "packing"),
  image: ogCardImage({
    eyebrow: "Printable",
    title: "The trunk inventory sheet that travels through customs",
    line: "Numbered trunk, owner, item-by-item contents, and the free-of-charge declaration.",
    photo: tool.photo,
  }),
});

const ROWS = 14;

export default function Page() {
  return (
    <ToolShell
      slug={tool.slug}
      eyebrow="Printable"
      intro="Every trunk the Nichols team checks through an airline carries a sheet like this: a number, owner information, the contents item by item, and a plain statement that nothing is for sale. Print one per trunk and keep a copy in your carry-on."
      guide={{ label: "What to pack for a medical mission trip", href: "/guides/what-to-pack-for-a-medical-mission-trip" }}
    >
      <div className="mb-6 print:hidden">
        <PrintButton label="Print the sheet" what="inventory_sheet" />
        <p className="mt-3 max-w-2xl text-sm text-ink/60">
          Don&rsquo;s own sheets also carry a Spanish translation and a customs explanation. The Spanish declaration below is the site&rsquo;s template wording, not Don&rsquo;s; have a Spanish speaker on your team read it once before you print.
        </p>
      </div>

      <div className="print-sheet mx-auto max-w-3xl">
        <div className="print-card rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-deep pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sea">
                Mission trunk inventory · Inventario del baúl
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
                Contents of this trunk
              </h2>
            </div>
            <div className="text-right text-sm">
              <p>
                Trunk No. <span className="inline-block w-16 border-b border-ink/40" />
                &nbsp;of&nbsp;
                <span className="inline-block w-16 border-b border-ink/40" />
              </p>
              <p className="mt-2">
                Weight <span className="inline-block w-20 border-b border-ink/40" /> lb
              </p>
            </div>
          </div>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {["Owner / Propietario", "Organization / Organización", "Destination / Destino", "Date / Fecha", "Phone / Teléfono", "Contact email / Correo"].map((l) => (
              <div key={l} className="flex items-baseline gap-2">
                <dt className="shrink-0 font-semibold text-ink/70">{l}:</dt>
                <dd className="w-full border-b border-ink/30">&nbsp;</dd>
              </div>
            ))}
          </dl>

          <table className="mt-6 w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink/20 text-xs uppercase tracking-wide text-ink/60">
                <th className="w-8 py-2">#</th>
                <th className="py-2">Item — be specific / Artículo</th>
                <th className="w-20 py-2 text-right">Qty / Cant.</th>
                <th className="w-28 py-2">For / Para</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROWS }).map((_, i) => (
                <tr key={i} className="border-b border-ink/10">
                  <td className="py-3 text-ink/40">{i + 1}</td>
                  <td className="py-3" />
                  <td className="py-3" />
                  <td className="py-3" />
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 rounded-xl bg-sand-dark p-4 text-sm leading-relaxed print:bg-white print:ring-1 print:ring-ink/20">
            <p className="font-semibold text-ink">
              Typical contents / Contenido típico: {behind.trunkContents.items.join(" · ")}
            </p>
          </div>

          <div className="mt-5 border-t-2 border-deep pt-4">
            <p className="font-serif text-lg font-bold text-deep">
              &ldquo;{behind.highlightQuote}&rdquo;
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Every item in this trunk was donated. Nothing is for sale. Everything will be given to the people we serve completely free of charge as part of a Christian medical and humanitarian mission.
            </p>
            <p className="mt-2 text-sm leading-relaxed italic text-ink/70">
              Todos los artículos en este baúl son donados. Nada está a la venta. Todo será entregado gratuitamente a las personas que servimos, como parte de una misión médica y humanitaria cristiana.
            </p>
          </div>

          <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
            <p>
              Signature / Firma
              <span className="mt-6 block border-b border-ink/40" />
            </p>
            <p>
              Date / Fecha
              <span className="mt-6 block border-b border-ink/40" />
            </p>
          </div>
          <p className="mt-6 text-[11px] text-ink/45">
            Template from donandpatti.com/tools/trunk-inventory-sheet, based on the trunk system Don Nichols describes in Behind Every Mission Trip.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
