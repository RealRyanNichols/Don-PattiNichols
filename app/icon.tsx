import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Placeholder favicon — a gold cross on deep teal, matching the site palette.
// A real designed favicon is on the backlog.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a3d40",
          borderRadius: 12,
          color: "#c9962e",
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        ✝
      </div>
    ),
    { ...size },
  );
}
