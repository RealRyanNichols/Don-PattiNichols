import { ImageResponse } from "next/og";

/**
 * PWA icons at the two sizes the web app manifest requires (192 and 512).
 *
 * Android reads these when Don or Patti tap "Install app"; without a 192 and a
 * 512 the install prompt never appears at all. They are generated rather than
 * checked in as binaries because this project deploys from a source archive
 * with no `public/` directory — an image route is the only way to ship a real
 * PNG. Same gold cross on deep teal as the iOS icon so the two platforms match
 * on their phones.
 */
// Note: a Route Handler must not export `contentType` — that field only exists
// on Next's image-convention files (icon.tsx, opengraph-image.tsx). Next fails
// the build on it, and `ImageResponse` sets image/png on the response anyway.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }];
}

export function GET(
  _req: Request,
  { params }: { params: { size: string } },
) {
  const px = params.size === "512" ? 512 : 192;
  // Maskable icons get cropped to a circle on Android, so the cross has to sit
  // inside the safe zone — roughly the middle 80% of the canvas.
  const cross = Math.round(px * 0.5);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0e6b70 0%, #0a3d40 100%)",
        }}
      >
        <svg width={cross} height={cross} viewBox="0 0 24 24" fill="#c9962e">
          <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
