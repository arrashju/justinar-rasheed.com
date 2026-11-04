"use client";

import styled from "styled-components";
import { needToTalk, site } from "@/content/site";
import { color, media, space, type, weight } from "@/styles/tokens";
import { Figure } from "../Figure";
import { ItemTitle, Prose, Section } from "../layout";
import { SplitLayout, split } from "../SplitLayout";
import { TextLink } from "../TextLink";

const project = needToTalk;

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "built", label: "What I built" },
  { id: "decisions", label: "Key decisions" },
  { id: "next", label: "Next" },
];

export function CaseStudy() {
  return (
    <SplitLayout
      menu={SECTIONS}
      aside={
        <Header>
          <Back>
            <TextLink href="/portfolio/" arrow="left" quiet>
              Portfolio
            </TextLink>
          </Back>
          <Heading>{project.name}</Heading>
          <Lede>{project.summary}</Lede>

          <Facts>
            <Fact>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </Fact>
            <Fact>
              <dt>When</dt>
              <dd>{project.dates}</dd>
            </Fact>
            <Fact>
              <dt>Live</dt>
              <dd>
                <TextLink href={project.url} arrow="out">
                  {project.urlLabel}
                </TextLink>
              </dd>
            </Fact>
            <Fact>
              <dt>Stack</dt>
              <dd>{project.stack.join(", ")}</dd>
            </Fact>
          </Facts>
        </Header>
      }
    >
      <Section split id="overview" label="Overview">
        <Prose>
          {project.overview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>
        <Figure {...project.cover} />
      </Section>

      <Section split id="built" label="What I built">
        {project.highlights.map((item) => (
          <Item key={item.title}>
            <ItemTitle>{item.title}</ItemTitle>
            <Body>{item.body}</Body>
            <Figure {...item.figure} />
          </Item>
        ))}
      </Section>

      <Section split id="decisions" label="Key decisions">
        {project.decisions.map((item) => (
          <Item key={item.title}>
            <ItemTitle>{item.title}</ItemTitle>
            <Body>{item.body}</Body>
          </Item>
        ))}
      </Section>

      <Section split id="next" label="Next">
        <Prose>
          <p>
            <TextLink href={`mailto:${site.contact.email}`}>Get in touch</TextLink> to talk through any of it, or{" "}
            <TextLink href={project.url} arrow="out">
              see it live
            </TextLink>
            .
          </p>
        </Prose>
      </Section>
    </SplitLayout>
  );
}

const Header = styled.header`
  display: flex;
  flex-direction: column;
`;

const Back = styled.p`
  ${type.small}
  margin-bottom: ${space(10)};

  ${split} {
    margin-bottom: ${space(12)};
  }
`;

// The same headline as the portfolio's name: each page's own name tops its hierarchy.
const Heading = styled.h1`
  ${type.headline}
  font-weight: ${weight.semibold};

  ${split} {
    font-size: 44px;
  }
`;

const Lede = styled.p`
  ${type.lede}
  color: ${color.secondary};
  margin-top: ${space(4)};
  max-width: 560px;
  text-wrap: pretty;
`;

const Facts = styled.dl`
  margin-top: ${space(10)};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${space(5)} ${space(6)};
  ${type.small}

  ${media.wide} {
    grid-template-columns: auto auto auto;
    max-width: 600px;
  }

  /* In the pinned column, one fact per row. */
  ${split} {
    grid-template-columns: 1fr;
    gap: ${space(4)};
  }

  dt {
    color: ${color.tertiary};
    margin-bottom: ${space(1)};
  }

  dd {
    color: ${color.ink};
  }
`;

const Fact = styled.div`
  &:last-child {
    grid-column: 1 / -1;
  }
`;

const Item = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${space(2)};

  figure {
    margin-top: ${space(4)};
  }
`;

const Body = styled.p`
  color: ${color.secondary};
  text-wrap: pretty;
`;
