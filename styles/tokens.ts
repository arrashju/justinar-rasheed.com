// The only place a colour, size or duration is written down.
// Colours are CSS variables so light and dark follow the system setting with no script.

const light = {
  bg: "#fcfcfc",
  ink: "#111113",
  secondary: "#5c5c64",
  tertiary: "#6e6e77",
  border: "#e6e6e9",
  surface: "#f3f3f5",
  accent: "#2c55c9",
  selection: "rgba(44, 85, 201, 0.14)",
  // The cover name's fade, top to bottom: felt more than seen.
  nameTop: "#111113",
  nameBottom: "#38383f",
};

const dark: typeof light = {
  bg: "#0e0e10",
  ink: "#ececef",
  secondary: "#a3a3ab",
  tertiary: "#8a8a93",
  border: "#25252a",
  surface: "#17171a",
  accent: "#8faaff",
  selection: "rgba(143, 170, 255, 0.22)",
  nameTop: "#f2f2f4",
  nameBottom: "#cacad1",
};

const toVars = (palette: typeof light) =>
  Object.entries(palette)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n");

// Raw values, for places that read a colour in JavaScript (theme-color, the share image).
export const palette = { light, dark };

export const colorVars = { light: toVars(light), dark: toVars(dark) };

export const color = Object.fromEntries(
  Object.keys(light).map((key) => [key, `var(--${key})`]),
) as Record<keyof typeof light, string>;

// A short scale. Bigger type gets tighter leading and tracking.
export const type = {
  small: "font-size: 14px; line-height: 1.5;",
  body: "font-size: 16px; line-height: 1.65;",
  lede: "font-size: 18px; line-height: 1.55; letter-spacing: -0.005em;",
  title: "font-size: 20px; line-height: 1.3; letter-spacing: -0.012em;",
  display: "font-size: 32px; line-height: 1.15; letter-spacing: -0.025em;",
  // A page's own name (the portfolio, the case study): the top of the page's hierarchy.
  headline: "font-size: 40px; line-height: 1.1; letter-spacing: -0.03em;",
  // The cover's name, sized by the component (it scales with the window). Need to Talk's
  // hero rung is 1.1 / -0.04em; two short stacked lines read as one block set tighter.
  hero: "line-height: 0.95; letter-spacing: -0.045em;",
};

// Corners, one scale picked by what the part is (Need to Talk's, trimmed to what we use).
export const radius = { xs: "4px", sm: "8px", md: "12px", lg: "16px", pill: "999px" };

export const weight = { regular: 400, medium: 500, semibold: 600 };

// Spacing in 4px steps.
export const space = (n: number) => `${n * 4}px`;

export const layout = {
  column: "640px",
  label: "128px",
  wide: "760px",
  gutter: "20px",
};

export const media = {
  wide: "@media (min-width: 760px)",
  motion: "@media (prefers-reduced-motion: no-preference)",
};

export const ease = "cubic-bezier(0.2, 0, 0, 1)";
export const duration = { fast: "150ms", base: "240ms" };
