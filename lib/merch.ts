/** Enable only after the family's shop, fulfillment, and payout owner are verified. */
export function merchStorefront(
  value = process.env.MERCH_STOREFRONT_URL,
): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const allowed =
      url.hostname === "shop.donandpatti.com" ||
      /^[a-z0-9][a-z0-9-]*\.fourthwall\.com$/.test(url.hostname);
    if (
      url.protocol !== "https:" ||
      !allowed ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash
    )
      return null;
    return url.toString();
  } catch {
    return null;
  }
}
