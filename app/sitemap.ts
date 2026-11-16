import type { MetadataRoute } from "next";
import { needToTalk, site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/portfolio/", `/work/${needToTalk.slug}/`].map((path) => ({
    url: new URL(path, site.url).toString(),
  }));
}
