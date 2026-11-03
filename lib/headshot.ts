import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/content/site";

// Build-time only. The headshot shows once public/headshot.jpg exists, and is left out until then.
const file = path.join(process.cwd(), "public", site.headshot.src);

export function hasHeadshot() {
  return existsSync(file);
}

// The share image is drawn without a browser, so it takes the photo as a data URL.
export function headshotDataUrl() {
  return hasHeadshot() ? `data:image/jpeg;base64,${readFileSync(file).toString("base64")}` : null;
}
