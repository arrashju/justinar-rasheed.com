import { llmsFull, markdownResponse } from "@/content/markdown";

// The whole site as one plain-text file, for assistants that read a single document.
export const dynamic = "force-static";

export function GET() {
  return markdownResponse(llmsFull(), "text/plain");
}
