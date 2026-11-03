"use client";

import styled, { css } from "styled-components";
import type { FigureContent, Shot } from "@/content/site";
import { color, media, space, type } from "@/styles/tokens";

// A screenshot in both themes: each shot swaps to its dark version with the visitor's system
// setting, the same way the page itself does. With no shots it renders nothing, so a highlight
// without a strong picture stands as text.
export function Figure({ caption, frame = "browser", shots }: FigureContent) {
  if (!shots?.length) return null;

  return (
    <Frame>
      {frame === "phone" ? (
        <Plate>
          {shots.map((shot) => (
            <Phone key={shot.light}>
              <Picture shot={shot} />
            </Phone>
          ))}
        </Plate>
      ) : (
        <Wide>
          <Picture shot={shots[0]} />
        </Wide>
      )}
      <Caption>{caption}</Caption>
    </Frame>
  );
}

function Picture({ shot }: { shot: Shot }) {
  return (
    <picture>
      <source srcSet={shot.dark} media="(prefers-color-scheme: dark)" />
      <img src={shot.light} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
    </picture>
  );
}

const Frame = styled.figure`
  display: flex;
  flex-direction: column;
  gap: ${space(3)};
`;

const fill = css`
  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Wide = styled.div`
  ${fill}
  overflow: hidden;
  border-radius: 12px;
  /* The hairline keeps a white shot's edge on a white page. */
  box-shadow: 0 0 0 1px ${color.border};
`;

// Phones stand on the grey plate at their own proportions, never stretched to the column.
const Plate = styled.div`
  display: flex;
  justify-content: center;
  gap: ${space(4)};
  padding: ${space(6)} ${space(4)};
  border-radius: 12px;
  background: ${color.surface};
  box-shadow: inset 0 0 0 1px ${color.border};

  ${media.wide} {
    gap: ${space(8)};
    padding: ${space(10)} ${space(8)};
  }
`;

const Phone = styled.div`
  ${fill}
  flex: 0 1 220px;
  min-width: 0;
`;

const Caption = styled.figcaption`
  ${type.small}
  color: ${color.tertiary};
  text-wrap: pretty;
`;
