/**
 * PAYPAL GIVING — live.
 *
 * Don's PayPal merchant ID. This is PUBLIC BY DESIGN — it appears in every
 * PayPal donate link on every nonprofit site on the internet. It is NOT a
 * credential: it only tells PayPal which account receives the money. Using the
 * merchant ID instead of his email also keeps his email address off the site.
 *
 * Verified working 2026-07-18: custom item_name and prefilled amount both
 * render correctly on PayPal's donate page, with the monthly-recurring
 * checkbox available on every link.
 *
 * WHEN THE 501(c)(3) IS APPROVED: upgrade the account to Business + confirmed
 * charity, then this same merchant ID keeps working — the display name changes
 * from "Donald Nichols" to the ministry name and fees drop to nonprofit rates.
 */
export const PAYPAL_MERCHANT_ID = "EZLD2X3NN5JGL";

/**
 * Build a PayPal donate URL.
 * @param itemName  What the donor sees + what shows in Don's PayPal record.
 * @param amount    Optional prefilled amount (USD). Omit to let the donor choose.
 */
export function paypalDonateUrl(itemName: string, amount?: number): string {
  const params = new URLSearchParams({
    business: PAYPAL_MERCHANT_ID,
    no_recurring: "0", // 0 = donor may choose monthly recurring
    item_name: itemName,
    currency_code: "USD",
  });
  if (amount && amount > 0) params.set("amount", amount.toFixed(2));
  return `https://www.paypal.com/donate/?${params.toString()}`;
}
