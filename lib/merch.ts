/**
 * Where the merchandise shop lives. Enable only after the family's shop,
 * fulfillment, and payout owner are verified.
 *
 * Set MERCH_STOREFRONT_URL in Vercel to the shop's home page. Accepted hosts:
 *   • shop.donandpatti.com           — a custom domain pointed at the shop
 *   • <name>.printify.me             — a Printify Pop-Up Store
 *   • <name>.fourthwall.com          — a Fourthwall shop
 * Anything else (plain http, credentials, ports, query strings, look-alike
 * domains) is refused and the page shows the "join the merch list" form.
 */
const SHOP_HOSTS = [
  /^shop\.donandpatti\.com$/,
  /^[a-z0-9][a-z0-9-]*\.printify\.me$/,
  /^[a-z0-9][a-z0-9-]*\.fourthwall\.com$/,
];

function safeShopUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !SHOP_HOSTS.some((re) => re.test(url.hostname)) ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

export function merchStorefront(
  value = process.env.MERCH_STOREFRONT_URL,
): string | null {
  if (!value) return null;
  return safeShopUrl(value)?.toString() ?? null;
}

/**
 * A featured product link is shown only if it lives on the SAME host as the
 * configured storefront — a typo or a pasted link to somewhere else must never
 * become a "buy" button on the family's site.
 */
export function merchProductUrl(
  value: string,
  storefront: string | null,
): string | null {
  if (!storefront) return null;
  const url = safeShopUrl(value);
  if (!url) return null;
  return url.hostname === new URL(storefront).hostname ? url.toString() : null;
}
