"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, layout, space, type, weight } from "@/styles/tokens";
import { ContactIcons } from "./ContactIcons";
import { TextLink } from "./TextLink";

// The homepage, whole: the name large, the cut-out portrait standing on the window's
// bottom edge, and the way into the work. The portfolio is its own page (/portfolio).
export function Cover() {
  return (
    <Frame id="main">
      <Top>
        <Role>{site.title}</Role>
        <Links>
          <li>
            <TextLink href="/portfolio/">Portfolio</TextLink>
          </li>
          <li>
            <ContactIcons />
          </li>
        </Links>
      </Top>

      <Name>
        {/* A non-breaking hyphen, so the name wraps as "Justin / Ar-Rasheed". */}
        <span>{site.name.split(" ")[0]}</span> <span>{site.name.split(" ").slice(1).join(" ").replace("-", "‑")}</span>
      </Name>

      <Enter>
        <TextLink href="/portfolio/" arrow="right">
          See my work
        </TextLink>
      </Enter>

      <Portrait
        src={site.portrait.src}
        alt={site.portrait.alt}
        width={site.portrait.width}
        height={site.portrait.height}
        fetchPriority="high"
        decoding="async"
      />
    </Frame>
  );
}

const wide = "@media (min-width: 900px)";

// The whole window, and nothing under it: the portrait's bottom edge is the window's.
const Frame = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding: ${space(6)} ${layout.gutter} 0;
  overflow: hidden;
  background: ${color.surface};

  ${wide} {
    min-height: max(100svh, 620px);
    padding: ${space(8)} ${space(10)} 0;

  }
`;

const Top = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${space(2)};
  ${type.small}

  ${wide} {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
  }
`;

const Role = styled.p`
  color: ${color.secondary};
`;

const Links = styled.ul`
  display: flex;
  align-items: center;
  gap: ${space(3)};

  li:first-child {
    margin-right: ${space(4)};
  }
`;

const Name = styled.h1`
  position: relative;
  z-index: 1;
  margin-top: ${space(10)};
  font-size: clamp(56px, 15vw, 72px);
  ${type.hero}
  font-weight: ${weight.semibold};
  color: ${color.ink};
  /* A barely-there fade, top to bottom; the solid colour above is the fallback. */
  background: linear-gradient(180deg, ${color.nameTop}, ${color.nameBottom});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  span {
    display: block;
  }

  ${wide} {
    position: absolute;
    left: ${space(10)};
    top: 50%;
    transform: translateY(-40%);
    margin: 0;
    font-size: clamp(88px, 9.2vw, 140px);
  }
`;

const Enter = styled.p`
  position: relative;
  z-index: 1;
  margin-top: ${space(6)};
  ${type.lede}
  font-weight: ${weight.medium};

  ${wide} {
    position: absolute;
    left: ${space(10)};
    top: calc(50% + clamp(120px, 12vw, 190px));
    margin: 0;
  }
`;

// Its clean bottom edge stands on the window's bottom edge. On a wide screen its width
// is capped so the name and the face always keep their own columns.
const Portrait = styled.img`
  display: block;
  /* Sized by the height left under the name, so on any phone it fills down to the
     bottom edge; the screen's sides crop the shoulders, never the photo's edge. */
  height: clamp(300px, calc(100svh - 340px), 72svh);
  width: auto;
  max-width: none;
  aspect-ratio: ${site.portrait.width} / ${site.portrait.height};
  /* A flex column stretches its children to its width; the portrait keeps its own. */
  align-self: flex-start;
  /* Wider than the column on a phone, so centre it on the column's middle explicitly. */
  margin: auto 0 0 50%;
  transform: translateX(-50%);

  ${wide} {
    position: absolute;
    right: ${space(6)};
    bottom: 0;
    width: min(52vw, 840px);
    height: auto;
    margin: 0;
    transform: none;
  }
`;
