// schema.org JSON-LD, so search engines and AI assistants read who Justin is and what the
// case study is from facts, not guesses. Every value comes from content/site.ts.

import { certifications, education, experience, needToTalk, site } from "@/content/site";

const personId = `${site.url}/#person`;

export function personSchema() {
  const { email, linkedin, github, dribbble } = site.contact;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: site.url,
    image: new URL(site.portrait.src, site.url).toString(),
    jobTitle: "Design Engineer",
    description: site.description,
    email: email ? `mailto:${email}` : undefined,
    sameAs: [linkedin, github, dribbble].filter(Boolean),
    worksFor: [
      ...experience.map((role) => ({ "@type": "Organization", name: role.company })),
      { "@type": "Organization", name: needToTalk.name, url: needToTalk.url },
    ],
    alumniOf: [...new Set(education.map((e) => e.issuer))].map((name) => ({
      "@type": "CollegeOrUniversity",
      name,
    })),
    hasCredential: [...education, ...certifications].map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
    knowsAbout: needToTalk.stack,
  };
}

export function caseStudySchema() {
  const p = needToTalk;
  const url = new URL(`/work/${p.slug}/`, site.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    name: `${p.name} case study`,
    url,
    abstract: p.summary,
    author: { "@id": personId },
    about: {
      "@type": "SoftwareApplication",
      name: p.name,
      url: p.url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    image: p.cover.shots?.map((s) => new URL(s.light, site.url).toString()),
    keywords: p.stack.join(", "),
  };
}
