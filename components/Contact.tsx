"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, space } from "@/styles/tokens";
import { TextLink } from "./TextLink";

const { contact } = site;

const bare = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/^linkedin\.com\//, "").replace(/\/$/, "");

const rows = [
  { label: "Email", href: `mailto:${contact.email}`, text: contact.email },
  { label: "LinkedIn", href: contact.linkedin, text: bare(contact.linkedin), arrow: "out" as const },
  { label: "GitHub", href: contact.github, text: bare(contact.github), arrow: "out" as const },
  { label: "Dribbble", href: contact.dribbble, text: bare(contact.dribbble), arrow: "out" as const },
  { label: "Résumé", href: contact.resume, text: "PDF", arrow: "right" as const },
];

export function Contact() {
  return (
    <List>
      {rows.map((row) => (
        <Row key={row.label}>
          <Term>{row.label}</Term>
          <dd>
            <TextLink href={row.href} arrow={row.arrow}>
              {row.text}
            </TextLink>
          </dd>
        </Row>
      ))}
    </List>
  );
}

const List = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${space(2)};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  column-gap: ${space(4)};
  overflow-wrap: anywhere;
`;

const Term = styled.dt`
  color: ${color.tertiary};
`;
