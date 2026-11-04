"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, layout, media, space, type, weight } from "@/styles/tokens";
import { ContactIcons } from "./ContactIcons";
import { TextLink } from "./TextLink";

// The homepage, whole. One block says who and what and where next (name, role, the way
// in); the portrait stands on the window's bottom edge; the top bar holds only links.
export function Cover() {
  return (
    <Frame id="main">
      <Top>
        <Links>
          <li>
            <TextLink href="/portfolio/">Portfolio</TextLink>
          </li>
          <li>
            <ContactIcons />
          </li>
        </Links>
      </Top>

      <Identity>
        <Name>
          {/* A non-breaking hyphen, so the name wraps as "Justin / Ar-Rasheed". */}
          <span>{site.name.split(" ")[0]}</span> <span>{site.name.split(" ").slice(1).join(" ").replace("-", "\u2011")}</span>
        </Name>
        <Role>{site.title}</Role>
        <Enter>
          <TextLink href="/portfolio/" arrow="right">
            See my work
          </TextLink>
        </Enter>
      </Identity>

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

  /* Fade in without the other pages' 6px rise: risen, the cover is 6px taller than the
     window, so a browser that always shows scrollbars draws one, then drops it, and the
     page shifts sideways. */
  ${media.motion} {
    animation-name: fade;
  }

  ${wide} {
    min-height: max(100svh, 620px);
    padding: ${space(8)} ${space(10)} 0;
  }
`;

const Top = styled.nav`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  ${type.small}
`;

const Links = styled.ul`
  display: flex;
  align-items: center;
  gap: ${space(3)};

  /* Only the Portfolio link's own item; the icon row inside has its own spacing. */
  > li:first-child {
    margin-right: ${space(4)};
  }
`;

// Name, role and the way in, read as one unit. On a phone it is centred in the space
// between the top bar and the portrait; on a wide screen, centred on the window's height
// beside the face.
const Identity = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${space(6)} 0;

  ${wide} {
    position: absolute;
    left: ${space(10)};
    top: 50%;
    transform: translateY(-50%);
    padding: 0;
  }
`;

const Name = styled.h1`
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
    font-size: clamp(88px, 9.2vw, 140px);
  }
`;

const Role = styled.p`
  ${type.body}
  color: ${color.secondary};
  text-wrap: balance;
  margin-top: ${space(4)};

  ${wide} {
    ${type.lede}
    margin-top: ${space(5)};
  }
`;

const Enter = styled.p`
  ${type.lede}
  font-weight: ${weight.medium};
  margin-top: ${space(6)};

  ${wide} {
    margin-top: ${space(8)};
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
  margin: 0 0 0 50%;
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
