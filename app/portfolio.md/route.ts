import { markdownResponse, portfolioMarkdown } from "@/content/markdown";

// The portfolio page as Markdown, for AI assistants and crawlers.
export const dynamic = "force-static";

export function GET() {
  return markdownResponse(portfolioMarkdown());
}
