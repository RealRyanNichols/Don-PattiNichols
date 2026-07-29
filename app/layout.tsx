import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";
import { people } from "@/content/people";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import LivePresence from "@/components/LivePresence";
import "./globals.css";

/**
 * FONTS — self-hosted by Next at build time.
 *
 * These used to load from fonts.googleapis.com via a <link> in <head>, which is
 * render-blocking and cost the desktop homepage seconds of Largest Contentful
 * Paint: the big serif headline could not paint until a third-party stylesheet
 * and a font file both arrived. next/font inlines the CSS, serves the fonts from
 * our own domain, and `display: swap` paints text immediately in a fallback.
 * Do not go back to a Google Fonts <link>.
 */
const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  // Next matches fallback metrics automatically, which also removes the
  // layout shift that happens when a webfont swaps in.
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Mission Work & Ministry`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Don Nichols",
    "Patti Nichols",
    "Belize medical mission",
    "medical mission trip",
    "mission trip donations",
    "Christian missions Belize",
    "free medical clinic Belize",
    "Malawi mission trip",
    "Dominican Republic medical mission",
    "mission water wells Malawi",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Mission Work & Ministry`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Mission Work & Ministry`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  /*
   * SEARCH ENGINE VERIFICATION.
   *
   * Google has never been told this site exists — no Search Console property,
   * so a 47-URL sitemap has never been submitted. That is the single biggest
   * thing standing between this site and organic traffic.
   *
   * Driven by env vars so Ryan can paste a token into Vercel and redeploy
   * without touching code:
   *   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
   *   NEXT_PUBLIC_BING_SITE_VERIFICATION
   * Absent = no tag rendered, which is harmless.
   */
  verification: {
    /*
     * Token issued 29 Jul 2026 when the Search Console property
     * https://www.donandpatti.com was created (Ryan's Google account).
     * Hardcoded as the default because it is not a secret — it is published
     * in a public meta tag by design. Env var still wins if ever set.
     * Google re-checks this tag periodically: REMOVING IT UN-VERIFIES THE SITE.
     */
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "b6S0ay4_gt-KoUCUiHVdfi6GcrRPVGS8m2rRWGsn3Wc",
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  manifest: "/manifest.webmanifest",
  /*
   * iOS ignores the web app manifest's display mode; it needs these instead
   * before an added-to-home-screen site launches full screen. Without them Don
   * and Patti would tap the icon and get Safari chrome, which immediately
   * breaks the illusion that this is their app.
   */
  appleWebApp: {
    capable: true,
    title: "Don & Patti",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

/**
 * `viewportFit: "cover"` lets the page paint under the iPhone notch and home
 * indicator; `env(safe-area-inset-*)` in globals.css then keeps real content
 * out from under them. `themeColor` paints the phone status bar deep teal so
 * the app has no seam at the top edge.
 */
export const viewport: Viewport = {
  themeColor: "#0a3d40",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: `${site.name} Mission Work`,
      url: site.url,
      description: site.description,
      founder: [
        { "@id": `${site.url}/don#person` },
        { "@id": `${site.url}/patti#person` },
      ],
    },
    {
      "@type": "Person",
      "@id": `${site.url}/don#person`,
      name: people.don.name,
      url: `${site.url}/don`,
      jobTitle: people.don.role,
    },
    {
      "@type": "Person",
      "@id": `${site.url}/patti#person`,
      name: people.patti.name,
      url: `${site.url}/patti`,
      jobTitle: people.patti.role,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <head>
        {/*
          Photographs are served from Google's Drive CDN. Opening the TCP and TLS
          connection early saves roughly a third of a second on the first image.
        */}
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
        <AnalyticsScripts />
        <LivePresence />
      </body>
    </html>
  );
}
