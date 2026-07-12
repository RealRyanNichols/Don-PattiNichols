import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Google Analytics 4 + Meta Pixel loaders, each guarded by its env-backed id in
 * `lib/site.ts → analytics`. When an id is empty the block renders nothing, so a
 * missing analytics key can never break the build or the page. Set the ids via
 * NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID to switch them on.
 */
export default function AnalyticsScripts() {
  const { gaId, metaPixelId } = site.analytics;

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      ) : null}

      {metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}
    </>
  );
}
