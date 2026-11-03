"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { color, layout, media, space, type, weight } from "@/styles/tokens";

// The page column: main, then the footer. On a wide screen each section is a
// two-column grid: a quiet label, then its content.
export const Page = styled.div`
  max-width: calc(${layout.wide} + 2 * ${layout.gutter});
  margin: 0 auto;
  padding: ${space(14)} ${layout.gutter} ${space(10)};
  display: flex;
  flex-direction: column;
  gap: ${space(16)};

  ${media.wide} {
    padding-top: ${space(24)};
    gap: ${space(20)};
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${space(14)};

  ${media.wide} {
    gap: ${space(18)};
  }
`;

export function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <Grid aria-labelledby={id}>
      <SectionLabel id={id}>{label}</SectionLabel>
      <Body>{children}</Body>
    </Grid>
  );
}

const Grid = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${space(4)};

  ${media.wide} {
    display: grid;
    grid-template-columns: ${layout.label} minmax(0, 1fr);
    column-gap: ${space(8)};
  }
`;

export const SectionLabel = styled.h2`
  ${type.small}
  font-weight: ${weight.medium};
  color: ${color.tertiary};

  ${media.wide} {
    /* Sit on the first line of a 16px body beside it. */
    padding-top: 3px;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(10)};
  max-width: ${layout.column};
`;

// Pulls a block into the content column on a wide screen, so it lines up with the sections.
export const Indented = styled.div`
  ${media.wide} {
    padding-left: calc(${layout.label} + ${space(8)});
  }
`;

export const Prose = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(4)};
  color: ${color.secondary};

  strong {
    color: ${color.ink};
    font-weight: ${weight.medium};
  }
`;

export const ItemTitle = styled.h3`
  ${type.body}
  font-weight: ${weight.medium};
  color: ${color.ink};
`;

export const Meta = styled.p`
  ${type.small}
  color: ${color.tertiary};
  font-variant-numeric: tabular-nums;
`;

export const SkipLink = styled.a`
  position: absolute;
  top: ${space(3)};
  left: ${space(3)};
  z-index: 10;
  padding: ${space(2)} ${space(3)};
  border-radius: 8px;
  background: ${color.ink};
  color: ${color.bg};
  ${type.small}
`;
