"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { color, layout, media, radius, space, type, weight } from "@/styles/tokens";

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

// `split`: on the portfolio's wide two-column layout the label stacks over its content,
// because the pinned menu already names the sections down the left.
export function Section({ id, label, split, children }: { id: string; label: string; split?: boolean; children: ReactNode }) {
  return (
    <Grid aria-labelledby={id} $split={split}>
      <SectionLabel id={id}>{label}</SectionLabel>
      <Body>{children}</Body>
    </Grid>
  );
}

const Grid = styled.section<{ $split?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${space(4)};

  ${media.wide} {
    display: grid;
    grid-template-columns: ${layout.label} minmax(0, 1fr);
    column-gap: ${space(8)};
  }

  ${({ $split }) =>
    $split &&
    `@media (min-width: 1100px) {
      display: flex;
      flex-direction: column;
    }`}
`;

export const SectionLabel = styled.h2`
  /* Clear of the window's top when jumped to from the menu. */
  scroll-margin-top: ${space(24)};
  ${type.small}
  font-weight: ${weight.medium};
  color: ${color.tertiary};

  /* On a phone the heading pins to the top while its section scrolls, so a long page
     always says where you are. It spans the screen, on the page's own ground. */
  @media (max-width: 759px) {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: 0 -${layout.gutter};
    padding: ${space(3)} ${layout.gutter};
    background: ${color.bg};
    color: ${color.ink};
    font-weight: ${weight.semibold};
  }

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

// One entry for every list on the site: what it is, then its facts on one line (the role
// or issuer · the dates), then anything more. Work, Experience and Education each had their
// own markup, so their titles, dates and spacing all disagreed.
// `media` is a picture above the words, for an entry that has one to show (the Work card).
export function Entry({
  title,
  meta,
  media,
  children,
  className,
}: {
  title: ReactNode;
  meta: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <EntryRoot className={className}>
      {media && <EntryMedia>{media}</EntryMedia>}
      <ItemTitle>{title}</ItemTitle>
      <Meta>{meta}</Meta>
      {children && <EntryBody>{children}</EntryBody>}
    </EntryRoot>
  );
}

const EntryRoot = styled.article`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EntryMedia = styled.div`
  margin-bottom: ${space(4)};
`;

const EntryBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(3)};
  margin-top: ${space(3)};
  color: ${color.secondary};
  text-wrap: pretty;
`;

export const EntryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${space(6)};
`;

export const SkipLink = styled.a`
  position: absolute;
  top: ${space(3)};
  left: ${space(3)};
  z-index: 10;
  padding: ${space(2)} ${space(3)};
  border-radius: ${radius.sm};
  background: ${color.ink};
  color: ${color.bg};
  ${type.small}
`;
