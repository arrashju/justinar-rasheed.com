import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { palette } from "@/styles/tokens";

// The link-preview image, rendered once at build time into out/og.png.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export function GET() {
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
        <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -2 }}>{site.name}</div>
        <div style={{ fontSize: 34, color: palette.light.secondary, marginTop: 16 }}>{site.title}</div>
      </div>
    ),
    size,
  );
}
