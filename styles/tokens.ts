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
  // The light behind the cover portrait, after Need to Talk's hero: a core pool over a
  // wide faint skirt, so it never reads as a disc. The accent in light...
  glow: "rgba(44, 85, 201, 0.16)",
  glowSpread: "rgba(44, 85, 201, 0.05)",
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
  // ...and a neutral cool white in dark: a coloured pool on near-black reads as a stain,
  // where white reads as studio backlight.
  glow: "rgba(175, 197, 230, 0.16)",
  glowSpread: "rgba(175, 197, 230, 0.05)",
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
};

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
