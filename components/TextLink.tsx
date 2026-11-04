"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import { color, duration, ease, radius } from "@/styles/tokens";

type Arrow = "right" | "left" | "out";

const glyph: Record<Arrow, string> = { right: "→", left: "←", out: "↗" };
const nudge: Record<Arrow, string> = {
  right: "translateX(2px)",
  left: "translateX(-2px)",
  out: "translate(1.5px, -1.5px)",
};

type Props = {
  href: string;
  children: ReactNode;
  arrow?: Arrow;
  quiet?: boolean;
  className?: string;
};

// One link for the whole site. Outside URLs open in a new tab and say so to screen readers.
export function TextLink({ href, children, arrow, quiet, className }: Props) {
  const external = /^https?:\/\//.test(href);
  const content = (
    <>
      {arrow === "left" && <Glyph aria-hidden="true">{glyph.left}</Glyph>}
      <Label>{children}</Label>
      {arrow && arrow !== "left" && <Glyph aria-hidden="true">{glyph[arrow]}</Glyph>}
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </>
  );

  if (external || href.startsWith("mailto:") || href.endsWith(".pdf")) {
    return (
      <Anchor
        href={href}
        className={className}
        $quiet={quiet}
        $arrow={arrow}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </Anchor>
    );
  }

  return (
    <Anchor as={Link} href={href} className={className} $quiet={quiet} $arrow={arrow}>
      {content}
    </Anchor>
  );
}

const Label = styled.span`
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.28em;
  text-decoration-color: ${color.border};
  transition: text-decoration-color ${duration.fast} ${ease};
`;

const Glyph = styled.span`
  display: inline-block;
  margin: 0 0.2em;
  color: ${color.tertiary};
  transition:
    transform ${duration.base} ${ease},
    color ${duration.fast} ${ease};

  &:last-of-type {
    margin-right: 0;
  }

  &:first-child {
    margin-left: 0;
  }
`;

export const Anchor = styled.a<{ $quiet?: boolean; $arrow?: Arrow }>`
  color: ${color.ink};
  border-radius: ${radius.xs};

  ${({ $quiet }) =>
    $quiet &&
    css`
      color: ${color.secondary};
      transition: color ${duration.fast} ${ease};

      ${Label} {
        text-decoration-color: transparent;
      }
    `}

  @media (hover: hover) {
    &:hover {
      color: ${color.ink};
    }

    &:hover ${Label} {
      text-decoration-color: ${({ $quiet }) => ($quiet ? color.border : color.accent)};
    }

    &:hover ${Glyph} {
      color: ${color.ink};
      transform: ${({ $arrow }) => ($arrow ? nudge[$arrow] : "none")};
    }
  }
`;
