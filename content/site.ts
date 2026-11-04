// Every word on the site lives in this file. Edit here, nothing else needs to change.
// Lines marked TODO are things to confirm or fill in before you share the link.

export const site = {
  name: "Justin Ar-Rasheed",
  title: "Design Engineer — React/Next.js + Product Design",
  url: "https://justinar-rasheed.com",
  description:
    "Design engineer building production web experiences at the seam of design and development.",

  intro: [
    "I build production web experiences at the seam of design and development.",
    "Nine-plus years shipping production UI software, and three years designing and building web apps end to end.",
  ],

  contact: {
    email: "justin.ar.rasheed@gmail.com",
    linkedin: "https://www.linkedin.com/in/justinarrasheed/",
    github: "https://github.com/arrashju", // TODO: confirm this is the profile you want public
    // Left empty, a row stays off the page.
    dribbble: "", // TODO: your Dribbble profile URL
    resume: "", // TODO: put your résumé at public/resume.pdf, then set this to "/resume.pdf"
  },
};

// A screenshot in both themes; the page shows the one matching the visitor's setting.
// Shots use fictional data, or a provider's own public page with their consent:
// never a client, a patient, or anything behind sign-in.
export type Shot = {
  light: string;
  dark: string;
  width: number;
  height: number;
  alt: string;
};

export type FigureContent = {
  // Say what the pixels show, and when the people in them are fictional.
  caption: string;
  // "browser" is one wide shot; "phone" puts up to two phone shots side by side.
  frame?: "browser" | "phone";
  // Left out, the highlight shows no picture.
  shots?: Shot[];
};

export type Highlight = {
  title: string;
  body: string;
  figure: FigureContent;
};

const shot = (name: string, ext: string, width: number, height: number, alt: string): Shot => ({
  light: `/work/need-to-talk/${name}-light.${ext}`,
  dark: `/work/need-to-talk/${name}-dark.${ext}`,
  width,
  height,
  alt,
});

export type Decision = {
  title: string;
  body: string;
};

export const needToTalk = {
  slug: "need-to-talk",
  name: "Need to Talk",
  url: "https://needtalk.com",
  urlLabel: "needtalk.com",
  role: "Cofounder and sole technical owner",
  dates: "Jan 2025 – present",
  summary:
    "A two-sided marketplace connecting mental health providers and clients.",
  cardSummary:
    "A two-sided marketplace connecting mental health providers and clients. Next.js, React and GraphQL on AWS, built to operate as a HIPAA business associate.",
  overview: [
    "Need to Talk helps people find a mental health provider and book them directly, and gives providers one place to run their practice: their profile, availability, bookings and insights.",
    "I designed and built it end to end, from the Figma design system to the AWS backend. It is built to operate as a HIPAA business associate, which shaped nearly every technical decision.",
  ],
  cover: {
    caption: "Deborah Spence’s public profile and booking card on needtalk.com.",
    frame: "browser",
    shots: [
      shot("profile", "jpg", 2880, 2000, "The Need to Talk profile of Deborah Spence, psychotherapist, licensed in Michigan, Florida and Georgia, beside a booking card with a free consultation and open times."),
    ],
  } as FigureContent,
  stack: [
    "Next.js 15 (App Router)",
    "React 19",
    "Apollo GraphQL",
    "Redux",
    "Styled-Components",
    "AWS AppSync",
    "DynamoDB",
    "S3",
    "Cognito",
  ],
  highlights: [
    {
      title: "A design system in code",
      body: "A shared component library, theme tokens and page templates built from my own Figma design system: multi-state layouts, bottom sheets, drag-and-drop reordering and full-screen search, with light and dark themes from the same tokens.",
      figure: {
        caption: "The provider’s Calendar with a day’s sheet open, and the Sessions list. Fictional provider and clients.",
        frame: "phone",
        shots: [
          shot("calendar", "png", 492, 1000, "A month calendar on a phone, with a sheet open for Thursday, October 22, set to available."),
          shot("sessions", "png", 492, 1000, "A list of upcoming sessions on a phone, one awaiting approval."),
        ],
      },
    },
    {
      title: "Headless content pipeline",
      body: "Multi-author articles moving through draft, in review, approved, published and archived, with the editor and the review flow built into the product.",
      // TODO: needs a dev lab with a fictional article and authors.
      figure: { caption: "Article editor and review workflow" },
    },
    {
      title: "Insights dashboard",
      body: "Interactive time-series charts (Nivo on D3) over an analytics pipeline that streams events through Kinesis Firehose and queries them with Athena.",
      // TODO: needs a dev lab with fictional chart data.
      figure: { caption: "Provider insights charts" },
    },
    {
      title: "Calendar and video integrations",
      body: "OAuth integrations with Google, Zoom, Microsoft Teams and Outlook, shared across the web app and a React Native client.",
      // TODO: needs a dev lab with fictional connected accounts.
      figure: { caption: "Integrations settings" },
    },
    {
      title: "Admin and trust tooling",
      body: "User management, invitations and email previews, Persona identity verification, and automated credential checks against state licensing boards and federal exclusion lists (OIG LEIE, SAM.gov).",
      figure: {
        caption: "The onboarding wizard\u2019s NPI step, with the number verified against the NPPES registry. Fictional provider.",
        frame: "browser",
        shots: [
          shot("onboarding-npi", "jpg", 2880, 1800, "The onboarding wizard at step 3 of 10: an NPI number entered and marked verified, with the onboarding rail on the left."),
        ],
      },
    },
  ] as Highlight[],
  decisions: [
    {
      title: "Persona over Stripe Identity",
      body: "As a business associate, the platform needs a BAA from the vendor that verifies providers' identities. Stripe doesn't sign BAAs; Persona does. That settled it, even with Stripe already handling payments.",
    },
    {
      title: "Notifications carry no health information",
      body: "Email, SMS and push leave the system we control. Every notification says only that something happened, like “You have a new message”, and the details wait behind sign-in.",
    },
    // TODO: add one or two more decisions you'd like to talk through in an interview.
  ] as Decision[],
};

export type Role = {
  company: string;
  formerly?: string;
  title: string;
  dates: string;
  points: string[];
};

export const experience: Role[] = [
  {
    company: "Stellantis",
    formerly: "FCA",
    title: "Senior Software Engineer / UX Engineer",
    dates: "2014 – present",
    points: [
      // TODO: confirm "7+" is the program count you want shown.
      "Shipped production display UI across 7+ vehicle programs, on screens from 3.5″ to 16″. Currently the Ram 12.3″ and the Dodge Charger Daytona 10″ and 16″ displays.",
      "Work recognized with the #1 J.D. Power IQS award, and contributed to three Motor Trend Truck of the Year wins.",
      "Built Python tooling (lxml, pandas) that automated testing and content workflows.",
      // TODO: confirm "25+" is the number you want shown.
      "Wrote the onboarding docs and processes that ramped 25+ engineers.",
    ],
  },
];

export type Credential = {
  name: string;
  issuer: string;
  year: string;
  note?: string;
};

export const education: Credential[] = [
  { name: "MS, Computer Engineering", issuer: "Wayne State University", year: "2015" },
  { name: "BS, Electrical Engineering", issuer: "Wayne State University", year: "2012" },
];

export const certifications: Credential[] = [
  { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2023" },
  { name: "Scaling Design Systems", issuer: "Dribbble", year: "2023" },
  { name: "Google UX Design", issuer: "Google", year: "2022" },
];

export const recognition: Credential[] = [
  {
    name: "AWS All Builders Welcome Grant",
    issuer: "Amazon Web Services",
    // TODO: match the year to the award date on your LinkedIn.
    year: "2023",
  },
];
