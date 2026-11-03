"use client";

import Link from "next/link";
import styled from "styled-components";
import { certifications, education, experience, needToTalk, recognition, site, type Credential } from "@/content/site";
import { color, duration, ease, media, space, type, weight } from "@/styles/tokens";
import { Contact } from "../Contact";
import { ItemTitle, Meta, Prose, Section } from "../layout";
import { TextLink } from "../TextLink";

export function Home() {
  return (
    <>
      <Intro>
        <Name>{site.name}</Name>
        <Title>{site.title}</Title>
        <Lede>
          {site.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Lede>
        <QuickLinks aria-label="Contact">
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
        </QuickLinks>
      </Intro>

      <Section id="work" label="Work">
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

      <Section id="experience" label="Experience">
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

      <Section id="education" label="Education">
        <Credentials items={education} />
      </Section>

      <Section id="certifications" label="Certifications">
        <Credentials items={certifications} />
      </Section>

      <Section id="recognition" label="Recognition">
        <Credentials items={recognition} />
      </Section>

      <Section id="contact" label="Contact">
        <Stack>
          <Prose>
            <p>Email is the fastest way to reach me.</p>
          </Prose>
          <Contact />
        </Stack>
      </Section>
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

// Contact within reach at the top: the three links a reader most often wants. The full list
// stays in the Contact section at the end.
const QuickLinks = styled.ul`
  display: flex;
  flex-wrap: wrap;
  column-gap: ${space(6)};
  row-gap: ${space(2)};
  margin-top: ${space(6)};
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
  border-radius: 14px;
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
