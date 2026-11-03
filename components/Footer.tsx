"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, type } from "@/styles/tokens";
import { Indented } from "./layout";

export function Footer() {
  return (
    <Indented as="footer">
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
