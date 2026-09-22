/** Validate the displayed USD amount before creating a checkout link. */
export function giftAmount(input: string): number | null {
  if (!/^\d+(?:\.\d{1,2})?$/.test(input.trim())) return null;
  const amount = Number(input);
  return Number.isFinite(amount) && amount >= 1 && amount <= 2000
    ? amount
    : null;
}

/** Examples use the published budget, without promising purchases or delivery. */
export function giftExample(amount: number, fund: string): string {
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
