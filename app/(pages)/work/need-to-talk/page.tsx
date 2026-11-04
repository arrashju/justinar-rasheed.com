import type { Metadata } from "next";
import { CaseStudy } from "@/components/views/CaseStudy";
import { needToTalk } from "@/content/site";

export const metadata: Metadata = {
  title: needToTalk.name,
  description: needToTalk.summary,
  openGraph: { title: needToTalk.name, description: needToTalk.summary },
};

export default function NeedToTalkPage() {
  return <CaseStudy />;
}
