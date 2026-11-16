import { llmsIndex, markdownResponse } from "@/content/markdown";

// The index AI assistants look for first (llmstxt.org), written once at build time.
export const dynamic = "force-static";

export function GET() {
  return markdownResponse(llmsIndex(), "text/plain");
}
