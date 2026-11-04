"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, type } from "@/styles/tokens";
import { Indented } from "./layout";

export function Footer({ className }: { className?: string }) {
  return (
    <Indented as="footer" className={className}>
      <Line>
        &copy; {new Date().getFullYear()} {site.name}
      </Line>
    </Indented>
  );
}

const Line = styled.p`
  ${type.small}
  color: ${color.tertiary};
`;
