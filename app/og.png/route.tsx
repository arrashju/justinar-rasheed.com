import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { headshotDataUrl } from "@/lib/headshot";
import { palette } from "@/styles/tokens";

// The link-preview image, rendered once at build time into out/og.png.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export function GET() {
  const photo = headshotDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 88,
          background: palette.light.bg,
          color: palette.light.ink,
          fontFamily: "sans-serif",
        }}
      >
        {photo && (
          <img src={photo} width={168} height={168} style={{ borderRadius: 84, marginBottom: 48 }} alt="" />
        )}
        <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -2 }}>{site.name}</div>
        <div style={{ fontSize: 34, color: palette.light.secondary, marginTop: 16 }}>{site.title}</div>
      </div>
    ),
    size,
  );
}
