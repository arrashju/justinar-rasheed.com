import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CaseStudy } from "@/components/views/CaseStudy";
import { needToTalk } from "@/content/site";
import { caseStudySchema } from "@/content/structuredData";

export const metadata: Metadata = {
  title: needToTalk.name,
  description: needToTalk.summary,
  openGraph: { title: needToTalk.name, description: needToTalk.summary },
  alternates: { types: { "text/markdown": `/work/${needToTalk.slug}.md` } },
};

export default function NeedToTalkPage() {
  return (
    <>
      <JsonLd data={caseStudySchema()} />
      <CaseStudy />
    </>
  );
}
