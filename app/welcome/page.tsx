import type { Metadata } from "next";
import WelcomeFlow from "@/components/admin/WelcomeFlow";

export const metadata: Metadata = {
  title: "Welcome to Your Website",
  description:
    "A personal welcome for Don & Patti Nichols — a tour of their website and the door to posting on it.",
  robots: { index: false, follow: false },
};

/**
 * /welcome — the front door Ryan texts to his parents.
 *
 * Personalized links:  donandpatti.com/welcome?for=don
 *                      donandpatti.com/welcome?for=patti
 *
 * Greets them by name, walks them through what their website is and what they
 * can do on it, then lets them raise their hand: "This is me." That sends an
 * access REQUEST to Ryan, who approves it from his own dashboard. Approval —
 * not sign-up — is what grants posting rights, so a stranger who finds this
 * page can knock but the door only opens from the inside.
 */
export default function WelcomePage({
  searchParams,
}: {
  searchParams: { for?: string };
}) {
  const who =
    searchParams.for === "don"
      ? "don"
      : searchParams.for === "patti"
        ? "patti"
        : null;
  return <WelcomeFlow who={who} />;
}
