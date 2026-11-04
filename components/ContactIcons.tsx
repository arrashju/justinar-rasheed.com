"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, duration, ease, radius, space } from "@/styles/tokens";
import { GitHubIcon, ICON_SIZE, LinkedInIcon, Mail } from "./icons";

// Email, LinkedIn and GitHub as their marks, named for screen readers and on hover.
export function ContactIcons({ className }: { className?: string }) {
  const { contact } = site;
  return (
    <Row className={className}>
      <li>
        <IconLink href={`mailto:${contact.email}`} aria-label="Email" title="Email">
          <Mail size={ICON_SIZE.chrome} />
        </IconLink>
      </li>
      <li>
        <IconLink href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn">
          <LinkedInIcon size={ICON_SIZE.chrome} />
        </IconLink>
      </li>
      <li>
        <IconLink href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" title="GitHub">
          <GitHubIcon size={ICON_SIZE.chrome} />
        </IconLink>
      </li>
    </Row>
  );
}

const Row = styled.ul`
  display: flex;
  align-items: center;
  gap: ${space(3)};
`;

// A glyph alone, so a 36px hit box around an 18px mark; quiet until pointed at.
const IconLink = styled.a`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin: -9px;
  border-radius: ${radius.pill};
  color: ${color.secondary};
  transition:
    color ${duration.fast} ${ease},
    background-color ${duration.fast} ${ease};

  @media (hover: hover) {
    &:hover {
      color: ${color.ink};
      background: ${color.border};
    }
  }
`;
