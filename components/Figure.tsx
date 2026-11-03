"use client";

import styled from "styled-components";
import { color, space, type } from "@/styles/tokens";

type Props = {
  caption: string;
  // A path under public/, e.g. "/work/need-to-talk/insights.png". Until one is set, a placeholder shows.
  // Screenshots must use sample data only: never a real client, provider or patient.
  src?: string;
  alt?: string;
};

export function Figure({ caption, src, alt }: Props) {
  return (
    <Frame>
      {src ? (
        <Shot src={src} alt={alt ?? caption} loading="lazy" decoding="async" />
      ) : (
        <Placeholder role="img" aria-label={`Screenshot placeholder: ${caption}`}>
          <span aria-hidden="true">Screenshot</span>
        </Placeholder>
      )}
      <Caption>{caption}{src ? " · sample data" : ""}</Caption>
    </Frame>
  );
}

const Frame = styled.figure`
  display: flex;
  flex-direction: column;
  gap: ${space(3)};
`;

const Placeholder = styled.div`
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  background: ${color.surface};
  box-shadow: inset 0 0 0 1px ${color.border};
  color: ${color.tertiary};
  ${type.small}
`;

const Shot = styled.img`
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 0 0 1px ${color.border};
`;

const Caption = styled.figcaption`
  ${type.small}
  color: ${color.tertiary};
`;
