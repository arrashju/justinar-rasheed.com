import { caseStudyMarkdown, markdownResponse } from "@/content/markdown";

// The Need to Talk case study as Markdown, for AI assistants and crawlers.
export const dynamic = "force-static";

export function GET() {
  return markdownResponse(caseStudyMarkdown());
}
