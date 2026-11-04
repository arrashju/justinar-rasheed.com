"use client";

import Link from "next/link";
import styled from "styled-components";
import { certifications, education, experience, needToTalk, recognition, site, type Credential } from "@/content/site";
import { color, duration, ease, media, radius, space, type, weight } from "@/styles/tokens";
import { Contact } from "../Contact";
import { ContactIcons } from "../ContactIcons";
import { Footer } from "../Footer";
import { PageNav } from "../PageNav";
import { ItemTitle, Meta, Prose, Section } from "../layout";
import { TextLink } from "../TextLink";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
];

export function Portfolio() {
  return (
    <>
      <Split>
        <Aside>
          <div>
            <Intro>
              <Name>{site.name}</Name>
              <Title>{site.title}</Title>
              <Lede>
                {site.intro.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </Lede>
            </Intro>
            <Menu items={SECTIONS} />
          </div>
          <Icons />
        </Aside>

        <Content>
          <Section split id="work" label="Work">
            <WorkCard>
              <ItemTitle>
                <Stretched href={`/work/${needToTalk.slug}/`}>{needToTalk.name}</Stretched>
              </ItemTitle>
              <Meta>
                {needToTalk.role} &middot; {needToTalk.dates}
              </Meta>
              <Summary>{needToTalk.cardSummary}</Summary>
              <Links>
                <CardCue aria-hidden="true">
                  Read the case study <span>&rarr;</span>
                </CardCue>
                <Raised>
                  <TextLink href={needToTalk.url} arrow="out" quiet>
                    {needToTalk.urlLabel}
                  </TextLink>
                </Raised>
              </Links>
            </WorkCard>
          </Section>

          <Section split id="experience" label="Experience">
            {experience.map((role) => (
              <article key={role.company}>
                <RoleHead>
                  <ItemTitle>
                    {role.company}
                    {role.formerly && <Formerly> (formerly {role.formerly})</Formerly>}
                  </ItemTitle>
                  <Meta>{role.dates}</Meta>
                </RoleHead>
                <RoleTitle>{role.title}</RoleTitle>
                <Points>
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </Points>
              </article>
            ))}
          </Section>

          <Section split id="education" label="Education">
            <Credentials items={education} />
          </Section>

          <Section split id="certifications" label="Certifications">
            <Credentials items={certifications} />
          </Section>

          <Section split id="recognition" label="Recognition">
            <Credentials items={recognition} />
          </Section>

          <Section split id="contact" label="Contact">
            <Stack>
              <Prose>
                <p>Email is the fastest way to reach me.</p>
              </Prose>
              <Contact />
            </Stack>
          </Section>
          <PageFooter />
        </Content>
      </Split>
    </>
  );
}

function Credentials({ items }: { items: Credential[] }) {
  return (
    <CredentialList>
      {items.map((item) => (
        <li key={item.name}>
          <CredentialName>{item.name}</CredentialName>
          <Meta>
            {[item.issuer, item.year, item.note].filter(Boolean).join(" \u00b7 ")}
          </Meta>
        </li>
      ))}
    </CredentialList>
  );
}

// From 1100px the page uses the window: the intro and a section menu stay pinned on the
// left while the work scrolls on the right. Below it, one column as before.
const split = "@media (min-width: 1100px)";

const Split = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(14)};

  ${split} {
    display: grid;
    grid-template-columns: minmax(300px, 380px) minmax(0, 640px);
    justify-content: space-between;
    column-gap: ${space(16)};
    width: min(1160px, calc(100vw - ${space(24)}));
    margin-left: calc(50% - min(580px, 50vw - ${space(12)}));
  }
`;

const Aside = styled.div`
  ${split} {
    position: sticky;
    top: ${space(24)};
    align-self: start;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${space(14)};
    min-height: calc(100svh - ${space(48)});
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(14)};

  ${split} {
    gap: ${space(18)};
  }
`;

const Menu = styled(PageNav)`
  display: none;

  ${split} {
    display: block;
    margin-top: ${space(12)};
  }
`;

// The footer line ends the work column, so it sits under the work, not the page's middle.
const PageFooter = styled(Footer)`
  ${split} {
    padding-left: 0;
  }
`;

const Icons = styled(ContactIcons)`
  margin: ${space(6)} 0 0 9px;

  ${split} {
    margin-top: 0;
  }
`;

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  max-width: 600px;
`;

const Name = styled.h1`
  ${type.title}
  font-weight: ${weight.semibold};
`;

const Title = styled.p`
  ${type.body}
  color: ${color.tertiary};
  margin-top: ${space(1)};
`;

const Lede = styled.div`
  ${type.lede}
  color: ${color.secondary};
  margin-top: ${space(8)};
  display: flex;
  flex-direction: column;
  gap: ${space(3)};
  text-wrap: pretty;
`;

const CardCue = styled.span`
  color: ${color.ink};
  font-weight: ${weight.medium};

  span {
    display: inline-block;
    margin-left: 0.2em;
    color: ${color.tertiary};
    transition:
      transform ${duration.base} ${ease},
      color ${duration.fast} ${ease};
  }
`;

// The whole card is one link to the case study; the live-site link sits above it.
const WorkCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${space(1)};
  margin: -${space(4)} -${space(5)};
  padding: ${space(4)} ${space(5)};
  border-radius: ${radius.md};
  transition: background-color ${duration.base} ${ease};

  @media (hover: hover) {
    &:hover {
      background: ${color.surface};
    }

    &:hover ${CardCue} span {
      transform: translateX(3px);
      color: ${color.ink};
    }
  }

  &:has(:focus-visible) {
    background: ${color.surface};
  }
`;

const Stretched = styled(Link)`
  color: ${color.ink};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  &:focus-visible {
    outline: none;
  }
`;

const Summary = styled.p`
  color: ${color.secondary};
  margin-top: ${space(2)};
  text-wrap: pretty;
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: ${space(5)};
  row-gap: ${space(1)};
  margin-top: ${space(3)};
  ${type.small}
`;


const Raised = styled.span`
  position: relative;
  z-index: 1;
`;

const RoleHead = styled.div`
  display: flex;
  flex-direction: column;

  ${media.wide} {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    gap: ${space(4)};
  }
`;

const Formerly = styled.span`
  color: ${color.tertiary};
  font-weight: ${weight.regular};
`;

const RoleTitle = styled.p`
  color: ${color.secondary};
`;

const Points = styled.ul`
  margin-top: ${space(4)};
  display: flex;
  flex-direction: column;
  gap: ${space(2)};
  color: ${color.secondary};
  text-wrap: pretty;

  li {
    position: relative;
    padding-left: ${space(5)};
  }

  li::before {
    content: "";
    position: absolute;
    left: 2px;
    top: 0.8em;
    width: 6px;
    height: 1px;
    background: ${color.tertiary};
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(5)};
`;

const CredentialList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${space(3)};
`;

const CredentialName = styled.p`
  color: ${color.ink};
`;
