import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Simple favicon: gold cross on deep teal. Replace with a designed icon later. */
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
    { ...size }
  );
}
