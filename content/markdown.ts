// Plain-text copies of the site for AI assistants and search crawlers: /llms.txt (the index,
// per llmstxt.org), /llms-full.txt (everything in one file), and a .md twin of each reading
// page. Every word comes from content/site.ts, so the copies never drift from the pages.

import {
  certifications,
  education,
  experience,
  needToTalk,
  recognition,
  site,
  type Credential,
  type Point,
} from "@/content/site";

const abs = (path: string) => new URL(path, site.url).toString();

const point = (p: Point) =>
  typeof p === "string" ? p : p.map((part) => (typeof part === "string" ? part : `[${part.text}](${part.href})`)).join("");

const credential = (c: Credential) => `- ${c.name}, ${[c.issuer, c.year, c.note].filter(Boolean).join(" · ")}`;

const contactLines = () => {
  const { email, linkedin, github, dribbble, resume } = site.contact;
  return [
    email && `- Email: ${email}`,
    linkedin && `- LinkedIn: ${linkedin}`,
    github && `- GitHub: ${github}`,
    dribbble && `- Dribbble: ${dribbble}`,
    resume && `- Résumé: ${abs(resume)}`,
  ].filter(Boolean) as string[];
};

const caseStudyPath = `/work/${needToTalk.slug}/`;

export function portfolioMarkdown(): string {
  return [
    `# ${site.name}`,
    "",
    `> ${site.title}`,
    "",
    ...site.intro.flatMap((p) => [p, ""]),
    "## Contact",
    "",
    ...contactLines(),
    "",
    "## Work",
    "",
    `### [${needToTalk.name}](${abs(caseStudyPath)})`,
    "",
    `${needToTalk.role} · ${needToTalk.dates} · [${needToTalk.urlLabel}](${needToTalk.url})`,
    "",
    needToTalk.cardSummary,
    "",
    "## Experience",
    "",
    ...experience.flatMap((role) => [
      `### ${role.company}${role.formerly ? ` (formerly ${role.formerly})` : ""}`,
      "",
      `${role.title} · ${role.dates}`,
      "",
      ...role.points.map((p) => `- ${point(p)}`),
      "",
    ]),
    "## Education",
    "",
    ...education.map(credential),
    "",
    "## Certifications",
    "",
    ...certifications.map(credential),
    "",
    "## Recognition",
    "",
    ...recognition.map(credential),
    "",
  ].join("\n");
}

export function caseStudyMarkdown(): string {
  const p = needToTalk;
  return [
    `# ${p.name}`,
    "",
    `> ${p.summary}`,
    "",
    `A case study by ${site.name}: ${p.role}, ${p.dates}. Live at [${p.urlLabel}](${p.url}).`,
    "",
    "## Overview",
    "",
    ...p.overview.flatMap((para) => [para, ""]),
    `Stack: ${p.stack.join(", ")}.`,
    "",
    "## What I built",
    "",
    ...p.highlights.flatMap((h) => [
      `### ${h.title}`,
      "",
      h.body,
      "",
      ...(h.figure.shots?.length
        ? [`Screenshot: ${h.figure.caption}${h.figure.link ? ` [${h.figure.link.label}](${h.figure.link.href})` : ""}`, ""]
        : []),
    ]),
    "## Key decisions",
    "",
    ...p.decisions.flatMap((d) => [`### ${d.title}`, "", d.body, ""]),
  ].join("\n");
}

export function llmsIndex(): string {
  return [
    `# ${site.name}`,
    "",
    `> ${site.title}`,
    "",
    site.intro.join(" "),
    "",
    "## Pages",
    "",
    `- [Portfolio](${abs("/portfolio.md")}): work, experience, education, certifications and recognition`,
    `- [${needToTalk.name} case study](${abs(`/work/${needToTalk.slug}.md`)}): ${needToTalk.summary}`,
    "",
    "## Contact",
    "",
    ...contactLines(),
    "",
    "## Optional",
    "",
    `- [Everything in one file](${abs("/llms-full.txt")})`,
    "",
  ].join("\n");
}

export function llmsFull(): string {
  return [portfolioMarkdown(), "---", "", caseStudyMarkdown()].join("\n");
}

export const markdownResponse = (body: string, type = "text/markdown") =>
  new Response(body, { headers: { "Content-Type": `${type}; charset=utf-8` } });
