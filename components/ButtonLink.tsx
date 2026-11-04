"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styled from "styled-components";
import { color, duration, ease, radius, space, type, weight } from "@/styles/tokens";

// The one action a page exists for, as a solid pill: the ink, with the page's ground for its
// words, so it is dark on a light page and pale on a dark one. Never blue: blue is for links.
// Solid, not outlined: an outline is how a secondary action looks. No arrow either, since
// the button's shape already says it goes somewhere.
export function ButtonLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Pill href={href} className={className}>
      {children}
    </Pill>
  );
}

const Pill = styled(Link)`
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 ${space(5)};
  border-radius: ${radius.pill};
  background: ${color.ink};
  color: ${color.bg};
  ${type.body}
  font-weight: ${weight.medium};
  transition: background-color ${duration.fast} ${ease};

  /* Hover is one step of the fill, nothing more: no fade, lift or shadow. */
  @media (hover: hover) {
    &:hover {
      background: ${color.inkHover};
    }
  }
`;
