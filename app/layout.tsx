import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Fonts are self-hosted by next/font — it downloads Inter and Lora at build
 * time, serves them from our own origin, and inlines the @font-face rules.
 *
 * Do NOT replace this with a <link> to fonts.googleapis.com. That is a
 * render-blocking request to a third-party origin on every page load, and it
 * cost 4.6 seconds of LCP the last time it was on this site. Mobile is 55% of
 * the traffic here.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  robots: { index: true, follow: true },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  // Rendered only once a token is set in lib/site.ts → verification.
  verification: {
    ...(site.verification.google ? { google: site.verification.google } : {}),
    ...(site.verification.bing ? { other: { "msvalidate.01": site.verification.bing } } : {}),
  },
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
      name: "Don & Patti Nichols Mission Work",
      url: site.url,
      description: site.description,
      founder: [{ "@id": `${site.url}/don#person` }, { "@id": `${site.url}/patti#person` }],
    },
    {
      "@type": "Person",
      "@id": `${site.url}/don#person`,
      name: "Don Nichols",
      url: `${site.url}/don`,
      jobTitle: "Preacher & Mission Team Member",
    },
    {
      "@type": "Person",
      "@id": `${site.url}/patti#person`,
      name: "Patti Nichols",
      url: `${site.url}/patti`,
      jobTitle: "Mission Team Member",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
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
        {site.analytics.gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.analytics.gaId}');`}
            </Script>
          </>
        ) : null}
        {site.analytics.metaPixelId ? (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${site.analytics.metaPixelId}');
fbq('track', 'PageView');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
