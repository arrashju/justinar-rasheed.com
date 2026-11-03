"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, space, type, weight } from "@/styles/tokens";
import { Indented } from "../layout";
import { TextLink } from "../TextLink";

export function NotFound() {
  return (
    <Indented>
      <Heading>Nothing here</Heading>
      <Body>That page doesn&rsquo;t exist, or it moved.</Body>
      <Back>
        <TextLink href="/" arrow="left">
          {site.name}
        </TextLink>
      </Back>
    </Indented>
  );
}

const Heading = styled.h1`
  ${type.title}
  font-weight: ${weight.semibold};
`;

const Body = styled.p`
  color: ${color.secondary};
  margin-top: ${space(2)};
`;

const Back = styled.p`
  margin-top: ${space(8)};
`;
