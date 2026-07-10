import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Placeholder favicon — a gold cross on deep teal, matching the site palette.
// The cross is drawn with rectangles (not the ✝ character) so it renders the
// same everywhere. A real designed favicon is on the backlog.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0a3d40",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 10,
            width: 8,
            height: 44,
            background: "#c9962e",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 22,
            width: 32,
            height: 8,
            background: "#c9962e",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
