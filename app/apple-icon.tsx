import { ImageResponse } from "next/og";

/**
 * The icon that appears when Don or Patti add the site to their phone's home
 * screen. iOS uses this for "Add to Home Screen", which is how the admin
 * becomes a one-tap app on their phones.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 36,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <svg width="110" height="110" viewBox="0 0 24 24" fill="#c9962e">
          <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
        </svg>
      </div>
    ),
    size,
  );
}
