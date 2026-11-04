"use client";

import Link from "next/link";
import styled from "styled-components";
import { certifications, education, experience, needToTalk, recognition, site, type Credential } from "@/content/site";
import { color, duration, ease, radius, space, type, weight } from "@/styles/tokens";
import { ContactIcons } from "../ContactIcons";
import { ICON_SIZE } from "../icons";
import { SplitLayout, split } from "../SplitLayout";
import { Entry, EntryList, Section } from "../layout";
import { TextLink } from "../TextLink";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

export function Portfolio() {
  return (
    <>
      <SplitLayout
        menu={SECTIONS}
        aside={
          <Intro>
            <Name>
              <span>{site.name.split(" ")[0]}</span> <span>{site.name.split(" ").slice(1).join(" ").replace("-", "\u2011")}</span>
            </Name>
            <Title>{site.title}</Title>
            <Lede>
              {site.intro.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Lede>
          </Intro>
        }
        asideFoot={<Icons size={ICON_SIZE.phone} />}
      >
          <Section split id="work" label="Work">
            <WorkCard
              title={<Stretched href={`/work/${needToTalk.slug}/`}>{needToTalk.name}</Stretched>}
              meta={`${needToTalk.role} \u00b7 ${needToTalk.dates}`}
            >
              <p>{needToTalk.cardSummary}</p>
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
            <EntryList>
              {experience.map((role) => (
                <li key={role.company}>
                  <Entry
                    title={
                      <>
                        {role.company}
                        {role.formerly && <Formerly> (formerly {role.formerly})</Formerly>}
                      </>
                    }
                    meta={`${role.title} \u00b7 ${role.dates}`}
                  >
                    <Points>
                      {role.points.map((point, i) => (
                        <li key={i}>
                          {typeof point === "string"
                            ? point
                            : point.map((part, j) =>
                                typeof part === "string" ? (
                                  part
                                ) : (
                                  <TextLink key={j} href={part.href}>
                                    {part.text}
                                  </TextLink>
                                ),
                              )}
                        </li>
                      ))}
                    </Points>
                  </Entry>
                </li>
              ))}
            </EntryList>
          </Section>

          {/* Degrees, then certifications, then the grant: one list, so six small items
              don't need three sections. Contact lives in the icons under the intro. */}
          <Section split id="education" label="Education">
            <Credentials items={[...education, ...certifications, ...recognition]} />
          </Section>
      </SplitLayout>
    </>
  );
}

function Credentials({ items }: { items: Credential[] }) {
  return (
    <EntryList>
      {items.map((item) => (
        <li key={item.name}>
          <Entry title={item.name} meta={[item.issuer, item.year, item.note].filter(Boolean).join(" \u00b7 ")} />
        </li>
      ))}
    </EntryList>
  );
}

const Icons = styled(ContactIcons)`
  margin: ${space(8)} 0 0 9px;
  gap: ${space(5)};

  ${split} {
    margin-top: 0;
  }
`;

const Intro = styled.header`
  display: flex;
  flex-direction: column;
  max-width: 600px;
`;

// Name, title, intro: three steps down in size and weight, read in that order.
const Name = styled.h1`
  ${type.headline}
  font-weight: ${weight.semibold};

  span {
    display: block;
  }

  ${split} {
    font-size: 44px;
  }
`;

const Title = styled.p`
  ${type.lede}
  font-weight: ${weight.medium};
  color: ${color.ink};
  margin-top: ${space(3)};
  text-wrap: balance;
`;

const Lede = styled.div`
  ${type.body}
  color: ${color.secondary};
  margin-top: ${space(5)};
  max-width: 380px;
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
const WorkCard = styled(Entry)`
  position: relative;
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

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: ${space(5)};
  row-gap: ${space(1)};
  ${type.small}
`;

const Raised = styled.span`
  position: relative;
  z-index: 1;
`;

const Formerly = styled.span`
  color: ${color.tertiary};
  font-weight: ${weight.regular};
`;

const Points = styled.ul`
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

