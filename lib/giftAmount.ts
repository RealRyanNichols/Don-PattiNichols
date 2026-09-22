/**
 * Validate the displayed USD amount before creating a checkout link.
 * `max` is $2,000 for everyday giving; a campaign whose single need costs
 * more (the $7,630 Malawi well) may raise it so one donor can fund it all.
 */
export function giftAmount(input: string, max = 2000): number | null {
  if (!/^\d+(?:\.\d{1,2})?$/.test(input.trim())) return null;
  const amount = Number(input);
  return Number.isFinite(amount) && amount >= 1 && amount <= max
    ? amount
    : null;
}

/** Examples use the published budget, without promising purchases or delivery. */
export function giftExample(amount: number, fund: string): string {
  if (fund === "malawi-water-well")
    return "Marked “Malawi Water Well” in PayPal. Don has said every gift for the well is forwarded publicly to Wings of Promise, which oversees the project.";
  if (fund === "malawi-maize-mill")
    return "Marked “Malawi Maize Mill” in PayPal. Don has said every gift for the mill is forwarded publicly to Wings of Promise, which oversees the project.";
  if (fund === "local-outreach")
    return "Your gift supports Don and Patti’s church and community work at home.";
  if (fund === "belize-trip")
    return "Your gift helps with travel, clinic setup, and on-the-ground costs in Belize.";
  if (fund === "medical-supplies") {
    const kits = Math.floor(amount / 3);
    return kits > 0
      ? `For example, this covers the published supply cost of ${kits} hygiene ${kits === 1 ? "kit" : "kits"}. Medical and pharmacy gifts help meet the team’s practical needs.`
      : "Your gift contributes toward medical and pharmacy supplies. Every amount helps.";
  }
  if (fund === "bibles-pastors") {
    const bibles = Math.floor(amount / 2.5);
    return bibles > 0
      ? `For example, this covers the published cost of ${bibles} ${bibles === 1 ? "Bible" : "Bibles"}. This fund also supports village pastors.`
      : "Your gift contributes toward Bibles and practical support for village pastors.";
  }
  return "Let Don and Patti put your gift toward the most urgent ministry need.";
}
