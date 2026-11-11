// Every word on the site lives in this file. Edit here, nothing else needs to change.
// Lines marked TODO are things to confirm or fill in before you share the link.

export const site = {
  name: "Justin Ar-Rasheed",
  title: "Design engineer · Cofounder of Need to Talk",
  // The cut-out on the homepage cover (components/Cover.tsx).
  portrait: { src: "/portrait.webp", alt: "Justin Ar-Rasheed", width: 994, height: 879 },
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
  // A link after the caption, to the live page the shot shows.
  link?: { href: string; label: string };
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
  // The case study opens on the console, the part providers work in; the profile already leads
  // the portfolio's Work card, so the case study moves the story on instead of repeating it.
  cover: {
    caption: "The provider\u2019s console, on the Calendar for one visit type: each day\u2019s hours and bookings, with the settings that apply every week beside it. Fictional provider and clients.",
    frame: "browser",
    shots: [
      shot("calendar-desktop", "jpg", 2880, 1520, "The Need to Talk console: a sidebar with Home, Sessions, Insights, About you, Booking pages, Articles, Integrations, a Psychotherapist role and a Consultation calendar; a November month with each weekday\u2019s hours and booking counts, two days off and weekends closed; and a Settings column with availability, the visit and guest reminders."),
    ],
  } as FigureContent,
  // The portfolio's Work card.
  card: {
    caption: "Deborah Spence\u2019s public profile and booking card on needtalk.com.",
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
      title: "Profiles people book from",
      body: "Every provider gets a public profile and booking page: their credentials, how they work, and their open times, booked directly.",
      figure: {
        caption: "Deborah Spence\u2019s public profile and booking card on needtalk.com.",
        link: { href: "https://www.needtalk.com/to/drauntie", label: "See her profile" },
        frame: "browser",
        shots: [
          shot("profile", "jpg", 2880, 2000, "The Need to Talk profile of Deborah Spence, psychotherapist, licensed in Michigan, Florida and Georgia, beside a booking card with a free consultation and open times."),
        ],
      },
    },
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
      // AWS's HIPAA-eligible list covers Cognito, AppSync, Lambda, DynamoDB and S3. Auth0 lists its
      // BAA as an Enterprise add-on (auth0.com/pricing), not on self-service plans.
      title: "Serverless on AWS, under one BAA",
      body: "Sign-in (Cognito), the API (AppSync and Lambda) and the data (DynamoDB and S3) all run on services AWS\u2019s business associate agreement covers. Everything bills per request, so a young marketplace costs almost nothing while it\u2019s quiet. Auth0 would have meant a second BAA, which it offers only as an Enterprise add-on.",
    },
    {
      title: "Persona over Stripe Identity",
      body: "As a business associate, the platform needs a BAA from the vendor that verifies providers\u2019 identities. Stripe doesn\u2019t sign BAAs; Persona does. That settled it, even with Stripe already handling payments.",
    },
    {
      // The $9,000 is a vendor's quote to us; the vendor doesn't publish pricing, so it isn't named.
      title: "Credential checks built on public registries",
      body: "NPI numbers are checked against the federal NPPES registry, licenses against state licensing boards, and exclusions against OIG\u2019s LEIE and SAM.gov, all automated in-house. The credentialing vendor we priced would have cost about $9,000 a year.",
    },
    {
      title: "Notifications carry no health information",
      body: "Email, SMS and push leave the system we control. Every notification says only that something happened, like \u201cYou have a new message\u201d, and the details wait behind sign-in.",
    },
    {
      title: "A design system the tests enforce",
      body: "Colors exist only as tokens, and ratchet tests fail any new hard-coded color, off-scale icon size, text weight or loose line height, so the system can\u2019t erode one file at a time.",
    },
  ] as Decision[],
};

export type Role = {
  company: string;
  formerly?: string;
  title: string;
  dates: string;
  points: Point[];
};

// A bullet is plain text, or text with links to the sources that back it.
export type Point = string | (string | { text: string; href: string })[];

export const experience: Role[] = [
  {
    company: "Stellantis",
    formerly: "FCA",
    title: "Senior Software Engineer / UX Engineer",
    dates: "2014 – present",
    points: [
      // Justin, Nov 11 2026: 19 shipped displays across KL, JL, JT, WD, WK, DT, HDCC, K8 (incl.
      // PHEV) and LB. The 3.5″ and 7″ screens were Ram in 2021; on Ram he now works only on the 12.3″ cluster.
      "Shipped production display UI on 19 displays across 9 vehicle programs, on screens from 3.5″ to 16″. Currently the Dodge Charger Daytona\u2019s 10″ and 16″ displays and Ram\u2019s 12.3″ cluster, including the new 2027 Ram 1500 Rumble Bee.",
      // Each figure links to the publisher's own page. J.D. Power's brand charts: Ram 18th in 2022
      // (186 PP100), 2nd in 2023 (141), 1st in 2024 (148). The cluster launched before the 2023
      // study (Justin). Side by side, not "because": IQS covers the whole vehicle.
      [
        "Built the graphics software for Ram\u2019s all-new 12.3″ digital cluster. The year it launched, Ram climbed from ",
        { text: "18th", href: "https://www.jdpower.com/business/press-releases/2022-us-initial-quality-study-iqs" },
        " to ",
        { text: "2nd", href: "https://www.jdpower.com/business/press-releases/2023-us-initial-quality-study-iqs" },
        " in J.D. Power\u2019s Initial Quality Study, then ranked ",
        { text: "first in 2024", href: "https://www.jdpower.com/business/press-releases/2024-us-initial-quality-study-iqs" },
        ".",
      ],
      // Justin built the TRX's new display and head-up display (MY2021). In the 2021 study Ram
      // ranked 1st overall (128 PP100) and Dodge 2nd (139); he also worked on the MY21 Durango.
      [
        "Built the new display and head-up display for the 2021 Ram 1500 TRX, ",
        { text: "MotorTrend\u2019s Truck of the Year", href: "https://www.motortrend.com/events/ram-1500-trx-2021-truck-of-the-year" },
        ". That year J.D. Power ranked ",
        { text: "Ram first", href: "https://www.jdpower.com/business/press-releases/2021-us-initial-quality-study-iqs" },
        " for initial quality, and Dodge, whose Durango I also worked on, second.",
      ],
      // From his LinkedIn projects. TODO: confirm the 12.3″ cluster is in the 2025 Ram 1500.
      // Top Gear's US Car Awards 2027 went to the TRX SRT trim, not the Rumble Bee; added on
      // Justin's say-so (Nov 10 2026). TODO: confirm the TRX SRT ships the 12.3″ cluster.
      // He also worked on the 2020 Ram Heavy Duty (Justin, Nov 10 2026), less closely than the
      // 2021 TRX, which is why that one has its own bullet and this one is a list item.
      [
        "Other programs I worked on won awards too: the 2019 Jeep Wrangler, ",
        { text: "MotorTrend’s SUV of the Year", href: "https://www.motortrend.com/events/jeep-wrangler-2019-suv-of-the-year" },
        "; the 2020 Ram Heavy Duty, ",
        { text: "MotorTrend’s Truck of the Year", href: "https://www.motortrend.com/news/ram-heavy-duty-pickup-2020-truck-of-the-year" },
        "; the 2025 Ram 1500, ",
        { text: "MotorTrend’s Truck of the Year", href: "https://www.motortrend.com/news/ram-1500-2025-truck-of-the-year" },
        "; and the 2027 Ram 1500 TRX SRT, ",
        { text: "Top Gear’s US Truck of the Year", href: "https://www.topgear.com/car-news/usa/best-cars-america-welcome-topgearcoms-us-car-awards-2027" },
        ".",
      ],
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
  { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2023 – 2026" },
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
