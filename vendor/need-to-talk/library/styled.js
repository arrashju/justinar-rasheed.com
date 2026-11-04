// Shim for Need to Talk's `library/styled` theme: only the parts the vendored
// booking picker reads (color roles, the body font, the radius scale), built
// from the same token file the product builds them from.
const { semantic, webColors, radius } = require("../shared/designTokens");

module.exports = {
  color: Object.fromEntries(Object.keys(semantic).map((role) => [role, webColors[role]])),
  font: { body: "var(--font-open-sans)", heading: "var(--font-open-sans)" },
  radius: Object.fromEntries(Object.entries(radius).map(([step, px]) => [step, `${px}px`])),
};
