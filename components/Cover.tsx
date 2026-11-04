"use client";

import styled from "styled-components";
import { site } from "@/content/site";
import { color, layout, space, type, weight } from "@/styles/tokens";
import { TextLink } from "./TextLink";

// The homepage, whole: the name large, the cut-out portrait standing on the window's
// bottom edge, and the way into the work. The portfolio is its own page (/portfolio).
export function Cover() {
  return (
    <Frame id="main">
      <Top>
        <Role>{site.title}</Role>
        <Links aria-label="Contact">
          <li>
            <TextLink href="/portfolio/">Portfolio</TextLink>
          </li>
          <li>
            <TextLink href={`mailto:${site.contact.email}`}>Email</TextLink>
          </li>
          <li>
            <TextLink href={site.contact.linkedin} arrow="out">
              LinkedIn
            </TextLink>
          </li>
          <li>
            <TextLink href={site.contact.github} arrow="out">
              GitHub
            </TextLink>
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
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  padding: ${space(6)} ${layout.gutter} 0;
  overflow: hidden;
  background: ${color.surface};

  /* Light rising from the bottom edge behind the portrait, never behind the name. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(ellipse 520px 440px at 50% 100%, ${color.glow} 0%, transparent 100%),
      radial-gradient(ellipse 900px 720px at 50% 100%, ${color.glowSpread} 0%, transparent 100%);
  }

  ${wide} {
    min-height: max(100svh, 620px);
    padding: ${space(8)} ${space(10)} 0;

    /* Centred under the portrait: its right inset plus half its width. */
    &::before {
      --x: calc(100% - ${space(6)} - min(26vw, 420px));
      background:
        radial-gradient(ellipse 760px 600px at var(--x) 100%, ${color.glow} 0%, transparent 100%),
        radial-gradient(ellipse 1400px 960px at var(--x) 100%, ${color.glowSpread} 0%, transparent 100%);
    }
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
  gap: ${space(5)};
`;

const Name = styled.h1`
  position: relative;
  z-index: 1;
  margin-top: ${space(10)};
  font-size: clamp(56px, 15vw, 72px);
  line-height: 0.95;
  letter-spacing: -0.045em;
  font-weight: ${weight.semibold};
  color: ${color.ink};

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
  width: min(150%, 600px);
  height: auto;
  /* Wider than the column on a phone, so centre it on the column's middle explicitly. */
  margin: auto 0 0 50%;
  transform: translateX(-50%);

  ${wide} {
    position: absolute;
    right: ${space(6)};
    bottom: 0;
    width: min(52vw, 840px);
    margin: 0;
    transform: none;
  }
`;
