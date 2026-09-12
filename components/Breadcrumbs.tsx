import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

/**
 * Visible breadcrumbs plus the matching BreadcrumbList structured data.
 *
 * Google shows these under the title in search results instead of the raw
 * URL, and they give a stranger who landed three levels deep a way back up.
 * The last crumb is the current page and is not a link.
 */
export default function Breadcrumbs({
  crumbs,
  dark = false,
  className = "",
}: {
  crumbs: { name: string; path: string }[];
  dark?: boolean;
  className?: string;
}) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  const base = dark ? "text-white/60" : "text-ink/55";
  const link = dark ? "hover:text-white" : "hover:text-sea";
  const current = dark ? "text-white/90" : "text-ink/85";
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <nav aria-label="Breadcrumb" className={`text-[13px] ${base} ${className}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className={`font-semibold ${current}`}>
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className={`transition ${link}`}>
                    {c.name}
                  </Link>
                )}
                {!last && (
                  <span aria-hidden className="opacity-50">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
