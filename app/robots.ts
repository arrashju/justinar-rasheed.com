import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Every crawler is welcome, AI assistants included: being read correctly is the point.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
