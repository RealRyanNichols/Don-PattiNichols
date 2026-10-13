import { findVideo } from "@/content/videos";
import { videoEmbedHtml } from "@/lib/videoEmbed";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const video = findVideo((await params).slug);
  if (!video) return new Response("Video not found", { status: 404 });
  return new Response(videoEmbedHtml(video), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; media-src 'self'; frame-ancestors *; base-uri 'none'; form-action 'none'",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": "public, max-age=300, must-revalidate",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
