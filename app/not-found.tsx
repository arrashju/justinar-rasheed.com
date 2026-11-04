import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Main, Page } from "@/components/layout";
import { NotFound } from "@/components/views/NotFound";

export const metadata: Metadata = { title: "Not found" };

export default function NotFoundPage() {
  return (
    <Page>
      <Main id="main">
        <NotFound />
      </Main>
      <Footer />
    </Page>
  );
}
