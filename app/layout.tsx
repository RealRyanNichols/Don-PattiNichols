import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { site } from "@/lib/site";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
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
        <AnalyticsScripts />
      </body>
    </html>
  );
}
