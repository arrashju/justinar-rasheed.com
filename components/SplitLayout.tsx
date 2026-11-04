"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { space } from "@/styles/tokens";
import { Footer } from "./Footer";
import { PageNav } from "./PageNav";

export const split = "@media (min-width: 1100px)";

type Props = {
  // What the page is: pinned on the left from 1100px, first on the page below that.
  aside: ReactNode;
  // The foot of the pinned column (the portfolio's icons); after `aside` on a phone.
  asideFoot?: ReactNode;
  // The page's sections, for the menu that follows the scroll.
  menu: { id: string; label: string }[];
  children: ReactNode;
};

// The reading pages' one layout, so the portfolio and the case study can't drift apart.
// From 1100px the page uses the window: who or what it is, and a section menu, stay
// pinned on the left while the content scrolls on the right. Below it, one column.
export function SplitLayout({ aside, asideFoot, menu, children }: Props) {
  return (
    <Split>
      <Aside>
        <div>
          {aside}
          <Menu items={menu} />
        </div>
        {asideFoot}
      </Aside>
      <Content>
        {children}
        <PageFooter />
      </Content>
    </Split>
  );
}

const Split = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(14)};

  ${split} {
    display: grid;
    grid-template-columns: minmax(300px, 380px) minmax(0, 680px);
    justify-content: space-between;
    column-gap: ${space(16)};
    width: min(1180px, calc(100vw - ${space(24)}));
    margin-left: calc(50% - min(590px, 50vw - ${space(12)}));
  }
`;

const Aside = styled.div`
  ${split} {
    position: sticky;
    top: ${space(24)};
    align-self: start;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${space(14)};
    min-height: calc(100svh - ${space(48)});
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(14)};

  ${split} {
    gap: ${space(18)};
  }
`;

const Menu = styled(PageNav)`
  display: none;

  ${split} {
    display: block;
    margin-top: ${space(12)};
  }
`;

// The footer line ends the content column, so it sits under the content.
const PageFooter = styled(Footer)`
  ${split} {
    padding-left: 0;
  }
`;
