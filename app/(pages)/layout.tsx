import type { ReactNode } from "react";
import { Main, Page } from "@/components/layout";

// The reading pages (the portfolio, the case study) share the page column. Each ends with
// its own footer line, so the portfolio's wide layout can place it under its work column.
// The homepage is the cover alone and sits outside this group.
export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <Page>
      <Main id="main">{children}</Main>
    </Page>
  );
}
