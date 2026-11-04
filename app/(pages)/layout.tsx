import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Main, Page } from "@/components/layout";

// The reading pages (the portfolio, the case study) share the page column and footer.
// The homepage is the cover alone and sits outside this group.
export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <Page>
      <Main id="main">{children}</Main>
      <Footer />
    </Page>
  );
}
