/**
 * Email notifications for new form submissions, via the Resend REST API — no
 * SDK. Inert until RESEND_API_KEY is set (then it emails the mission inbox).
 * A notification failure never affects the form submission: the row is already
 * saved in Supabase, so this is strictly best-effort and always swallows errors.
 */

const RESEND_API = "https://api.resend.com/emails";

/** Where notifications go. Override with MISSION_NOTIFY_EMAIL. */
export function notifyTo(): string {
  return process.env.MISSION_NOTIFY_EMAIL || "missions@donandpattinichols.org";
}

/**
 * From address. Resend requires a verified domain; until donandpattinichols.org
 * is verified in Resend, its test sender works. Override with MISSION_NOTIFY_FROM.
 */
export function notifyFrom(): string {
  return process.env.MISSION_NOTIFY_FROM || "Mission Website <onboarding@resend.dev>";
}

export function notifyConfigured(): boolean {
  return (process.env.RESEND_API_KEY || "").length > 0;
}

export async function sendNotification(subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY || "";
  if (!key) return; // not configured yet — no-op
  try {
    await fetch(RESEND_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: notifyFrom(), to: [notifyTo()], subject, text }),
      cache: "no-store",
    });
  } catch {
    // never let a notification failure surface to the donor/visitor
  }
}
