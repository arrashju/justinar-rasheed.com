// Canonical design tokens — the single source of truth for every color on
// the platform.
//
// Consumers:
//   apps/web/library/styled.js          (wraps every value in var(); 220+ importers)
//   apps/web/app/client-layout.js       (emits the :root variable block)
//   apps/web/app/layout.tsx             (viewport themeColor — raw value)
//   apps/web/app/manifest.ts            (PWA colors — raw values)
//   apps/mobile/lib/theme.ts            (RN StyleSheet tokens — raw values)
//
// CommonJS on purpose, matching shared/roleCatalog.js: web (webpack), mobile
// (Metro) and Jest all require() this without a transform, and Next's
// outputFileTracingRoot / Metro's watchFolders already cover the repo root.
//
// TWO LAYERS, and the distinction matters:
//
//   palette  — primitives. Literal color values. Never reference these from
//              new product code; they exist so semantic roles have something
//              to point at.
//   semantic — roles (surface, textSecondary, border, accent...). This is the
//              layer a future dark mode re-maps. New code should use these.
//
// WEB CONSUMPTION: web reads `webColors`, whose values are
// `var(--n2t-<name>, <raw>)` strings, resolved at runtime from the :root block
// that cssVariablesBlock() generates. The same static-interpolation-into-var()
// pipeline already ships for fonts (--font-open-sans), so this is proven.
//
// MOBILE + JS SINKS take RAW values (palette.x / semantic.x), never webColors:
// React Native has no CSS variables, and anything that parses colors in
// JavaScript — Google Maps overlays, chart libraries, <meta> tags, email HTML
// — cannot resolve var(). See AGENTS.md § Colors.

// ---------------------------------------------------------------------------
// 1. PRIMITIVES
// ---------------------------------------------------------------------------
// Every value here is byte-identical to what shipped before tokenization
// (apps/web/library/styled.js + apps/mobile/lib/theme.ts). The one former
// exception, styled.js's `hero: "#000"`, has since been folded into `ink`
// (color-dictionary decision 4: literal #000 text is the ramp's ink);
// `black` stays for mobile parity.

const palette = {
  // Brand
  danube: "#4A7EC9", // styled.js blue / danube
  hoverBlue: "#4479C7",
  darkblue: "#2859a1",
  // The brand blue taken down far enough to carry TEXT: 5.40:1 on white.
  // Drawn first for the bottom-nav selected tab; since the Aug 2026 contrast
  // pass it is also what `accentText`/`textInteractive` resolve to in light.
  // `danube` itself is 4.10:1 on white — under AA for ANY normal-size text:
  // WCAG's large-text discount starts at 24px (18.66px bold), not 16px, so
  // "fine for the 16px links" was never true. Same hue and saturation
  // (215.4deg, 54%), lightness only.
  danubeInk: "#366ab5",
  // The brand blue deepened to carry a SMALL WHITE LABEL: 5.00:1 under white
  // against `danube`'s 4.10. The light half of the `accentFill` split — dark
  // made the same move first (#3b73c4, from the other side); light kept the
  // legacy value until the Aug 2026 contrast pass. The hover presses one
  // step deeper, mirroring the dark pair — under a white label a lift only
  // costs the label.
  //
  // This pair is also the CTA gradient's two stops (`gradients.cta` below).
  // The gradient used to run `danube` -> a `ctaGradientEnd` primitive that
  // the contrast pass never reached, so the Continue button sat a visible
  // step lighter than the selected availability chip beside it, and its
  // white label was 3.78:1 on dark. One fill blue, one pair of values.
  danubeFill: "#3a6fbe",
  danubeFillHover: "#3568b8",
  // The pale tint the homepage hero band is drawn in. Art-directed rather
  // than derived from `danube`, but it is the same blue family, so when the
  // brand moved it moved with it by the same OFFSETS the other derived blues
  // took (+7pp saturation, -4pp lightness) rather than being re-picked by eye:
  //   #86b0ed hsl(216 74% 73%) -> #70a5f0 hsl(215 81% 69%)
  cornflower: "#70a5f0",
  // The brand blue held at the ILLUSTRATION LADDER'S OWN LIGHTNESS: same hue
  // and saturation as `danube`, hsl(215.5 54%), lifted to L 76.5% so its L* is
  // 75.9 -- identical to `borderHover`, the ladder's step 2. It therefore has
  // NO contrast advantage over the lines around it (1.92:1 on white, the same
  // as step 2) and differentiates on hue alone: chroma 64 against step 2's 19.
  danubeMist: "#a3bde3",

  // The blog's default article tile: a deep plate with two `danube` waves
  // curving across it, shown when an article has no featured image. Its own
  // primitive because it is art, not a surface — it is read as the picture
  // the card is missing, so it holds its own depth rather than tracking
  // `surface` (see the roles below for how it moves in dark).
  //
  // The plate is the brand blue held at its OWN LIGHTNESS — same hue and
  // saturation as `danube`, hsl(215.4 54%), at L 40% — the same move
  // `danubeInk` and `danubeMist` make. It was #425F8A, hsl(215.8 35% 40%),
  // until Sep 2026: a value sampled off the SVG asset, which was drawn
  // against the PRE-Aug-2026 brand and was the one blue in the tile that the
  // brand's +7pp saturation move did not sweep. (The waves are `danube`
  // itself, so they moved with it — leaving a washed plate under vibrant
  // waves, which reads as gray-blue rather than as art in the brand.)
  // Lightness is untouched, so the plate keeps the depth the role is drawn
  // around: 6.69:1 on a white card, against 6.49:1 before.
  articlePlate: "#2f5c9d",
  // The moment-well plate (semantic `wellTint`): a clear light blue on the
  // brand hue, under a white replica card. Not `danubeMist`, which is a
  // mark colour and reads grey-violet as a full plate.
  wellPlate: "#d6e4f7",

  // Accents
  twine: "#c19156",
  merino: "#f4d6b7",
  // The homepage demo recording's own ground, measured off the footage. Not a
  // ramp value: it describes the video, not the page, and does not theme.
  footageGround: "#1f252d",
  mulberry: "#C54B8C",
  // The homepage's section colors (see `homeBandLavender` below): a pale
  // lavender and a deep plum cut from mulberry's hue, and a pale and a deep
  // teal kept bluer than the success green.
  lavenderWhisper: "#f4eef7",
  // Near-white with a breath of lavender: where lavenderWhisper fades to.
  lavenderMist: "#faf7fb",
  plum: "#7b4a86",
  plumHover: "#6c3f77",
  tealWhisper: "#eaf4f2",
  // Near-white with a breath of blue: where tealWhisper fades to.
  tealMist: "#f4f9fa",
  deepTeal: "#2f6b66",
  deepTealHover: "#285c58",
  // The teal day tile under the pointer: one step darker than tealWhisper,
  // with no rim (owner, 2026-10-26: "I don't like the border highlight.
  // Maybe just make the available ones darker on hover"). Darkened the same
  // evening ("make it darker"), to the deepest step where deepTeal on it
  // still holds 4.5:1 (4.6:1).
  tealWhisperHover: "#cbe4df",
  lightMulberry: "#f38dc3",
  green: "#5BAB64",
  // Hover for a filled green button, the mirror of `hoverDanger`: darker on
  // light, and lighter on dark (see the dark block).
  hoverGreen: "#4f9a58",
  // The green deepened to carry a WHITE LABEL — `green` under white is
  // 2.82:1, a decoration ratio, not a label one. The success mirror of
  // `danubeFill`/`dangerFill`: 4.84:1 at rest, and the hover presses deeper,
  // never lifts.
  greenFill: "#3f7f48",
  greenFillHover: "#3a7743",
  // `green` and `twine` taken down far enough to carry TEXT and to sit under
  // a white LABEL — the same move `danubeInk` makes for the brand blue, and
  // for the same reason. Both primitives above are art colors picked against
  // a white page as fills; as type they are 2.82:1, which is under AA, and a
  // white label on them is the same 2.82:1 from the other side. Same hue and
  // saturation, lightness only:
  //   green #5BAB64 hsl(127 32% 51%) -> #43834a hsl(127 32% 39%)  4.58:1
  //   twine #c19156 hsl(33  46% 55%) -> #9a6e38 hsl(33  46% 41%)  4.51:1
  greenInk: "#43834a",
  greenInkHover: "#3c7642",
  twineInk: "#9a6e38",
  /* Twine as a MARK rather than as text. `twineInk` above came down to 4.51:1
     so it could carry words; that is too dark to still read as gold on a 10px
     stroke. Lightness comes back up and CHROMA goes up with it — hsl(33 75%
     47%) against twine's hsl(33 46% 55%) — landing 3.05:1 on white, over the
     3:1 WCAG asks of a graphical object, while staying amber. Plain `twine`
     (#c19156) cannot serve: it is 2.82:1 and fails that bar. */
  twineMark: "#d2811e",
  // Same 3.9-point L drop `greenInk` takes to `greenInkHover`.
  twineInkHover: "#8b6433",
  danger: "#dd0000",
  hoverDanger: "#bb0000",

  // Ink
  ink: "#1D262D", // styled.js black / ebony
  inkSoft: "#273140", // styled.js dark
  // The plant's pool of light: zero alpha in BOTH themes now -- the plant's
  // own cast shadow does the grounding. Dark carried a faint ink glow from
  // Oct 9 to Oct 12 2026; see the role's note.
  plantPoolTint: "rgba(232, 236, 241, 0)",

  // Cool-gray ramp. These carry a blue tinge on purpose so web and mobile
  // chrome read as one system; don't mix warm grays into this scale.
  coolGrayLightest: "#f5f6f8",
  coolGrayLight: "#eef0f4",
  neutral: "#eceff3",
  neutralBorder: "#e5e7eb",
  coolGrayBorder: "#cdd2da",
  graySlate: "#656e77", // the de facto secondary-text gray (108x web, 52x mobile)
  graySlateDeep: "#474e55", // graySlate walked down to 8.22:1 — markQuiet's ink

  // Plain grays — the de facto web scale, hoisted from raw literals.
  gray900: "#1c232b",
  gray850: "#272e36", // inverse surfaces: tooltips, dark editor toolbars
  gray800: "#2d343d",
  gray600: "#5f6771",
  gray500: "#6a727c",
  gray400: "#929aa4", // disabled text / empty star ratings
  grayScrollThumb: "#bac2cd",
  grayScrollThumbHover: "#a1a9b4",
  grayBorder: "#d8dee5", // the hairline before 2026-10-29; map casings, segment plates and chrome marks keep it
  // THE LIGHT HAIRLINE (owner, 2026-10-29: "borders in general in light mode
  // are too light"): 1.50:1 on white, Apple's #d2d2d7 weight at the ramp's
  // hue, one step over Airbnb's #DDDDDD (1.36). A white card on a white
  // card leaves the line as the only edge, which 1.36 could not carry.
  grayHairline: "#cdd4dc",
  grayFieldBorder: "#c8cfd8", // the field edge before 2026-10-29; the map's country line keeps it
  // The resting edge of a form control (2026-10-29): Airbnb's booking field
  // edge (#8C8C8C, 3.36:1) at the ramp's hue, 3.15:1 on white, so a white
  // field on a white card clears WCAG 1.4.11's 3:1 by its edge alone.
  grayFieldEdge: "#8a929c",
  // The section rule, the same value as `grayHairline` (2026-10-29). It was
  // Airbnb's #DDDDDD at our hue (owner, 2026-10-28, of the About sheet's
  // rules at #ebeef2: "might be too faint ... comparable to Airbnb").
  divider: "#cdd4dc",
  // Airbnb's navbar line (10% black, #e6e6e6 on white) at the ramp's hue.
  grayNavLine: "#e3e6ea",
  // One whisper below white -- see `surfaceQuiet` in `semantic` for the role.
  grayWhisper: "#f7f9fc",
  grayFillDark: "#dbe1e8",
  grayFill: "#e7eaef",
  graySunkenHover: "#e8e9ec", // one step DOWN from `neutral`, for hovering a sunken control
  grayFillLight: "#edf0f4",
  grayFillLighter: "#f4f5f7",
  grayDisabledFill: "#eaecf0", // a disabled input's ground
  grayDisabledFillStrong: "#dce3eb", // the disabled select/adornment
  grayBorderHover: "#b4bcc7", // an input hairline under the pointer
  /** The edge of an EMPTY interactive control -- the unchecked checkbox, the
   *  unselected radio. A step below grayBorderHover on purpose: a hover
   *  hairline may be quiet because the thing it outlines is already visible,
   *  but an empty control's edge is the only thing saying the control is
   *  there, so it carries WCAG 1.4.11's 3:1 rather than the hairline ladder's
   *  1.92:1. */
  grayControlBorder: "#858d98",
  grayToggleTrack: "#d9dde3", // the off track of a switch
  // A filled control that is deliberately NOT the primary action, carrying a
  // white label: the Basic plan's "Current plan" / "Switch to Basic" button.
  // Tinted into the ramp at the exact OKLCH lightness of the #909090/#a0a0a0
  // pair it replaces (hue 254, chroma 0.017) — see 04a-gray-convergence.md.
  // Deepened in the Aug 2026 contrast pass: the original #89919b held its
  // white label at 3.19:1 — a deliberate quiet-button choice, but a live
  // enabled control's label is normal text and the 4.5:1 floor applies. Rest
  // clears at 4.59:1; the hover now PRESSES (5.01:1) instead of lightening,
  // which had dropped the label to 2.61:1 mid-interaction.
  grayControlFill: "#6e7681",
  grayControlFillHover: "#68707b",

  // Chrome / canvas
  offWhite: "#fcfdfe", // styled.js white
  pageBg: "#fbfcfd", // html/body background
  canvas: "#ecedef", // default page wrapper behind cards
  grayClosedDayHover: "#dedfe1", // canvas 14 units down, on its hue: Airbnb's blocked-day hover step
  docsBg: "#f8f9fb",
  pricingBg: "#f8f9fa",
  // The marketing homepage's one ground. Light does not consume it: there the
  // page keeps its alternating bands, and each section still names its own
  // (`surface`, `surfaceSunken`, `mediaBand`). The role exists because DARK
  // collapses all of them into a single field -- see the dark value -- and a
  // role with a value in only one theme is not a role. This is the value a
  // light flatten would land on if it ever happens.
  homepageBg: "#ffffff",
  // Google's own land tone, held under the map container so the panel does
  // not flash a white (or, in dark, a near-black) slab before the tiles
  // arrive. Warm, and deliberately outside the cool ramp: it is matching
  // someone else's raster, not our chrome.
  mapLand: "#e5e3df",
  white: "#ffffff",
  black: "#000000",

  // Toasts (react-hot-toast config in client-layout.js).
  toastBg: "#1f2937",
  // The pill's chrome. Alphas, because they composite over the slab and the
  // page around it. The edge is white in BOTH themes — a toast is a dark slab
  // either way — but on dark it is the only thing separating the pill from
  // the page, since a black drop shadow over a near-black ground does almost
  // nothing. Both work harder there.
  toastEdge: "rgba(255, 255, 255, 0.1)",
  toastShadow: "rgba(0, 0, 0, 0.25)",
  // A control ON a toast: the close disc and the Undo button share one plate
  // (Figma Proposals #7, owner 2026-10-07). White alphas, like the edge;
  // dark keeps the same values.
  toastControl: "rgba(255, 255, 255, 0.2)",
  toastControlHover: "rgba(255, 255, 255, 0.3)",
  // The dark theme's lifted success green and danger red, as primitives, for
  // a mark that sits on a dark ground in BOTH themes (toastSuccessMark /
  // toastErrorMark). Dark keeps the same values.
  successLifted: "#6fbf77",
  dangerLifted: "#f0747a",

  // Alpha tokens. Kept as rgba() because they must composite over whatever
  // surface they sit on.
  /** Day-tile "not available" fill + text (Figma node 23694:32122). */
  /** The skeleton fill's primitive: semantic `skeleton` says why. */
  skeletonInk: "rgba(31, 39, 58, 0.08)",
  unavailableFill: "rgba(31, 39, 58, 0.1)",
  unavailableText: "rgba(28, 31, 47, 0.2)",
  /** Danger hairline — the rgba() spelling of #dd000033. A hex-alpha suffix
   *  cannot be concatenated onto a var() string, so callers that used
   *  `${theme.color.danger}33` use this instead. */
  dangerBorder: "rgba(221, 0, 0, 0.2)",
  /** The drag-select band (see the `textSelection` role). A wash, not a
   *  fill: selected text has to stay readable THROUGH it, which is why it
   *  keeps the rgba() spelling like its neighbours here. This is the literal
   *  that used to sit inline in design/profile's StyledTextField, kept to the
   *  digit so light mode does not move. */
  selectionWash: "rgba(82, 117, 170, 0.2)",

  // State overlays. Named tokens rather than channel variables on purpose:
  // the 2026-08-22 alpha audit found only ~7 brand tints and 3 recurring
  // black alphas, so a handful of names beats rgb(var(--x-rgb) / n%)
  // plumbing. Each is one dark-mode decision: black overlays invert to
  // white-alpha there, brand tints keep hue at higher alpha.
  scrim: "rgba(0, 0, 0, 0.4)", // modal/sheet backdrop (collapses .25/.35/.4/.5)
  // The same backdrop when it is ALSO frosted (web dark mode — see
  // `theme.backdropVeil`). Transparent here the way `edgeOnDark` is: light
  // backdrops do not frost, so the role has no light value and nothing reads
  // it outside a dark-scoped block.
  scrimFrosted: "transparent",
  // The drop shadow under a FLOATING panel — menu, popover, dropdown. On
  // light it is what separates the panel from the page, since the panel and
  // the page are both near-white; on dark black-on-near-black barely reads,
  // so it goes far deeper and the work shifts to `surfaceRaised` below.
  menuShadow: "rgba(0, 0, 0, 0.12)",
  // The edge of a floating panel that holds CARDS: none on light, where the
  // shadow alone floats it, so the popup is not a third box round the cards'
  // own hairlines (owner, Oct 29 2026, after Airbnb's floating panels); the
  // chrome hairline on dark, where a shadow barely reads on a near-black page.
  floatEdge: "transparent",
  // The drop shadow under a CARD — a bounded object resting on the surface
  // behind it, not a panel floating over the page. Unlike every other shadow
  // here it does NOT deepen on dark; see the dark value for why.
  cardShadow: "rgba(0, 0, 0, 0.1)",
  // The 1px contact ring under `cardShadow` in the `cardElevation` recipe
  // (library/styled): Airbnb's profile-card ring, measured. It is what gives
  // the card an edge where the halo is too soft to draw one. Same in both
  // themes; the halo is the half that deepens.
  cardRing: "rgba(0, 0, 0, 0.02)",
  // The quieter lift under a card that is present but not the one being
  // worked in -- the collapsed Who/Where cards in the search sheet, beside
  // the open one on the full `cardShadow`. Airbnb's collapsed search cards,
  // measured Sep 24 2026: two short 4% shadows and no ring.
  cardShadowLow: "rgba(0, 0, 0, 0.04)",
  // The open booking step's lift (theme.cardElevationStep): Airbnb's
  // checkout, measured -- a 2% ring over 4% and 10% shadows, the card
  // values exactly. Held as their own roles because the DARK side is not a
  // shadow at all; see there.
  stepRing: "rgba(0, 0, 0, 0.02)",
  stepShadowLow: "rgba(0, 0, 0, 0.04)",
  stepShadow: "rgba(0, 0, 0, 0.1)",
  // Resting hover on any control surface. Light is a black wash. Dark cannot
  // be white: overlaying #fff on a cool gray desaturates it, and the leftover
  // reads warm (the Who/Where search-pill hover). The wash is a cool gray at
  // the ramp's hue so compositing keeps chroma instead of bleaching it.
  hoverOverlay: "rgba(0, 0, 0, 0.05)",
  borderHairline: "rgba(0, 0, 0, 0.1)", // 1px alpha divider on unknown ground
  // The veil react-avatar-editor paints outside the circular crop. Light
  // keeps the shipped white wash. Dark inverts to a black wash — a white
  // veil on a dark modal is the bright slab the cropper used to flash.
  // Canvas-only: AvatarEditor takes [r, g, b, a], not a CSS color, so the
  // cropper parses this raw token rather than reading the var().
  cropMask: "rgba(255, 255, 255, 0.6)",

  /* The homepage grid's two vertical rails. A pair, not one value, because a
     rail crosses bands of different grounds and has to stay equally faint on
     each; the ground picks the rail, the way `dangerFill` and `dangerText`
     split by job rather than by theme.

     A wash at the ramp's hue (~214 deg, the temperature `divider` and the
     dark grays share), NOT black or white alpha -- the same reasoning as
     dark's `hoverOverlay`. A neutral-alpha line shifts the cool ground toward
     gray, and that hue break is what makes a hairline read as paint sitting ON
     the surface; a wash at the ground's own hue reads as the same material a
     step lighter or darker, which is the whole difference between "border" and
     "structure". Weight is deliberately under Stripe's own rails (measured:
     ~6.6 L* on their white, ~8 L* on their navy): ~5 L* here, ~5.7 on sunken,
     where the ground is closer to the line and needs a touch more. */
  gridRail: "rgba(52, 78, 112, 0.08)",
  // The HORIZONTAL counterpart to the rail -- the cut under the page chrome
  // and under the hero. A shade stronger than the vertical rail on purpose: a
  // rail runs the height of the page and only has to be found, a cut has to
  // be read at a glance as the boundary between two things.
  gridCut: "rgba(52, 78, 112, 0.1)",
  gridRailOnSunken: "rgba(52, 78, 112, 0.1)",
  /* The third flavor, for the footer's `brandBand` plate. A dark wash reads
     as a shadowed crease on a saturated blue, so this one inverts: a pale
     wash AT THE BAND'S OWN HUE (~215 deg, same family as the other two),
     sized to the same ~5 L* lift the others step down by. Not white -- white
     over the saturated blue bleaches it toward chalk, the same failure the
     dark theme's `hoverOverlay` comment describes. */
  gridRailOnBand: "rgba(219, 231, 247, 0.14)",
  /* The fourth flavor, for the hero's `heroBand`. Same inversion as the band
     rail and for the same reason -- `heroBand` is a saturated blue in light,
     where a dark wash reads as a crease -- but a heavier one: the hero's blue
     is far paler than `brandBand`'s, so the same 0.14 only buys ~3 L* against
     it. 0.2 puts it back on the ~5 L* step the other three hold. */
  gridRailOnHero: "rgba(219, 231, 247, 0.2)",
  // A dark-only edge. Light draws these edges as soft black-alpha shadows
  // (2-4%), which read as intended there but vanish on a dark ground; dark
  // swaps in a white hairline. Transparent here so light mode is untouched.
  edgeOnDark: "transparent",
  accentTint: "rgba(74, 126, 201, 0.1)", // brand badge/chip fill
  accentTintStrong: "rgba(74, 126, 201, 0.2)",
  accentHoverTint: "rgba(74, 126, 201, 0.08)", // brand-flavored hover fill
  // A brand-blue hairline: the 1px edge of the one card on a page that is
  // marked as the recommended choice. `accent` at 0.45 -- solid `accent` drew
  // a frame loud enough to compete with the button inside it.
  accentEdge: "rgba(74, 126, 201, 0.45)",
  // The recommended PLAN's edge in light: `danubeInk` at 0.65. Measured off
  // Perplexity's pricing page (2026-10-12): its Pro card draws its brand ink
  // at 0.65 against Free's 0.14 neutral, and that contrast is what makes the
  // card stand out on a white page. `accentEdge`'s 0.45 read as a faint
  // outline there.
  accentEdgeStrong: "rgba(54, 106, 181, 0.8)",
  // A disabled primary button. Tinted brand rather than neutral grey (the way
  // Stripe renders one), so the control still reads as the primary action.
  brandDisabledFill: "#a0b8dd",

  // Status banners — the tinted ground/edge/text trio an inline error or
  // success message is built from. Distinct from `danger`/`success`, which are
  // the saturated signal colors used for icons, borders and buttons.
  dangerTintFill: "#ffeded",
  dangerTintEdge: "#ffcdd2",
  // One Material step deeper than the original #d32f2f, which sat at 4.41:1
  // on the tint fill — the lone light banner pair under AA (success 4.56,
  // caution 4.96 both clear). This lands at 4.98:1.
  dangerTintText: "#c62828",
  successTintFill: "#e8f5e8",
  successTintEdge: "#c8e6c9",
  successTintText: "#2e7d32",
  cautionTintFill: "#fff3cd",
  cautionTintEdge: "#ffc107",
  cautionTintText: "#856404",

  // The angled wash behind the auth pages. Three stops of one decorative
  // gradient — they only ever appear together.
  authWashTop: "#ffffff",
  authWashBand: "#c3cfe2",
  authWashBase: "#f5f7fa",
  /**
   * Frosted bars — the sticky bottom CTAs that blur the page behind them.
   * These are SURFACES, not overlays: a fixed white alpha keeps them light
   * while the content above them themes, so they must move with `surface`.
   */
  surfaceFrosted: "rgba(255, 255, 255, 0.8)",
  surfaceFrostedStrong: "rgba(255, 255, 255, 0.9)",
  /**
   * The dark grade laid over the hero photograph. Transparent in light —
   * the photo ships already graded for a light page — and a dark veil in
   * dark mode, so a full-brightness photograph doesn't become the loudest
   * thing on an otherwise dark screen.
   */
  heroPhotoGrade: "rgba(0, 0, 0, 0)",
  /**
   * The light under the /for-providers hero (owner, 2026-10-23, after
   * Linear's and Fluently's heroes: "The glow can be at the bottom of the
   * hero"). Two radial pools of the brand blue rising from the hero's bottom
   * edge behind the booking window: `heroGlow` is the core, `heroGlowSpread`
   * the wide faint skirt that keeps the core from reading as a disc. The
   * brand blue (`danube`) at alpha, because a var() cannot take an alpha
   * suffix. Blue in light only: dark takes the ramp's neutral cool white
   * (see the dark block), as light mode carries the colour.
   */
  heroGlow: "rgba(74, 126, 201, 0.30)",
  heroGlowSpread: "rgba(74, 126, 201, 0.10)",
  /**
   * The photo viewer (lightbox). Its controls do not theme, but its canvas
   * does: light mode keeps a translucent dark surround and dark mode uses
   * opaque black so the page cannot ghost through.
   *
   * The viewer is not chrome, it is a VIEWING ENVIRONMENT — for as long as it
   * is open the photograph is the entire page, and a dark surround is what
   * lets a photograph keep its own tonal range. Follow the light theme here
   * and a bright surround drags every mid-tone down with it: the photo reads
   * flat and washed out, which is a worse light-mode result than the "wrong"
   * dark slab. Google Photos and Facebook both hold their viewers near-black
   * in a light UI for this reason.
   *
   * That is also why the glyph tokens below are fixed white rather than
   * `textOnAccent` or an inverse role: the viewing canvas stays black in both
   * themes even though its light-mode opacity differs.
   */
  viewerScrim: "rgba(0, 0, 0, 0.84)",
  /** The translucent 40px circle behind close + options. */
  viewerControlFill: "rgba(95, 103, 113, 0.5)",
  viewerControlFillHover: "rgba(95, 103, 113, 0.7)",
  /** Hover ground under a bare control (the prev/next arrows). */
  viewerControlWash: "rgba(255, 255, 255, 0.12)",
  viewerGlyph: "#ffffff",
  /** A control at rest, before the pointer reaches it. */
  viewerGlyphMuted: "rgba(255, 255, 255, 0.75)",
};

// ---------------------------------------------------------------------------
// 2. SEMANTIC ROLES
// ---------------------------------------------------------------------------
// Add a role here rather than reaching for a primitive twice. Keep it small:
// every role is a promise that dark mode will have an answer for it.

const semantic = {
  // Brand
  accent: palette.danube,
  accentHover: palette.hoverBlue,
  accentStrong: palette.darkblue,
  /**
   * The brand blue used as TEXT on the page — a section eyebrow, an FAQ
   * question, the "Expand all" control, the phone number in the contact card.
   *
   * Its own role because text and fills want opposite things from `accent` on
   * dark. `accent` is deliberately held near the light hex so the large
   * filled surfaces (the primary CTA, availability chips) still read as the
   * brand blue rather than a brighter one — but at that value, as unfilled
   * text on `surface`, it lands at 4.32:1 and reads dim beside the near-white
   * body copy around it — worst at the small sizes, the "Expand all" control
   * and the phone number, where there is the least of it on screen. Text has
   * no fill to give it presence, so it lifts a long way: 7.38:1 on `surface`.
   *
   * The split runs in BOTH themes since the Aug 2026 contrast pass: dark
   * lifts this to stay bright on a dark ground, light stands it down to
   * `danubeInk` (5.40:1) because 4.10:1 was never AA for normal-size text.
   * Opposite moves, one reason.
   */
  accentText: palette.danubeInk,
  /**
   * The brand blue marking the SUBJECT SOLID in an illustration figure -- one
   * diamond, one figure. See specs/illustration-system.
   *
   * A role of its own rather than a reuse of `accentText`, because it is the
   * one place in the app where the accent has to STOP EXISTING on dark. On
   * white, `danubeInk` is deep ink and a 1.5px edge of it reads as a drawn
   * line. On the dark card, `accentText` resolves to #89b1ec -- a LIGHT colour
   * -- and a thin light-on-dark line glows: the figures read as neon rather
   * than as objects. The perceptual job is opposite in the two themes, so the
   * value has to be too.
   *
   * IT CARRIES NO EXTRA CONTRAST, and that is the point. `danubeMist` sits at
   * L* 75.9 -- exactly `borderHover`, the ladder's step 2 -- and measures
   * 1.92:1 on the card, the same as step 2. The subject is not darker, heavier
   * or more opaque than its neighbours; it is simply the only chromatic thing
   * in a drawing of grays, and hue alone is enough to make it read.
   *
   * This went through danubeInk (5.40:1) and danube (4.10:1) first. Both stood
   * out by being DARKER, which on a whisper-weight drawing lands as a hard
   * blue edge -- the mark won the card instead of pointing within it. Value
   * contrast is the wrong channel here because the figure has almost none by
   * design.
   *
   * The cost, stated plainly: at 1.92:1 nothing in the figure clears the 3:1
   * WCAG 1.4.11 asks of a graphical object. That is acceptable only because
   * the svg is aria-hidden, the figure is decorative, and the card's heading
   * and body carry the meaning -- it must never become the sole carrier of
   * information.
   *
   * The divergence lives HERE, in the token layer, which is where a theme
   * difference belongs. components/illustrations still contains no
   * `[data-theme]` block, no media query and no useIsDark, and a test asserts
   * it.
   */
  illustrationSubject: palette.danubeMist,
  /**
   * The brand blue as a SMALL FILL CARRYING A WHITE LABEL — the hero's "Find
   * care" button, the carousel arrows. The third member of the accent family,
   * and it moves the OPPOSITE way from `accentText` on dark.
   *
   * White on `accent` is 3.75:1, which fails AA for a 13px label, and the way
   * out is to deepen the fill, not to lighten it — lightening buys the label
   * nothing and costs it. `accentText` lifts because the blue IS the text;
   * here the blue is the ground under it. One role could not serve both.
   *
   * The label wins over the button's own edge, because the two cannot both be
   * satisfied: white at 4.5:1 needs a luminance at or below 0.183, and 3:1
   * against the hero pill needs 0.197 or above. There is no such color. A
   * filled control with a legible white label is identifiable by the label,
   * so the text threshold is the one that binds.
   *
   * Both themes split since the Aug 2026 contrast pass: dark deepened first
   * (#3b73c4), and light now makes the same move to `danubeFill` (5.00:1
   * under white, against `danube`'s 4.10). `accent` itself keeps the brand
   * value for the large surfaces.
   */
  accentFill: palette.danubeFill,
  /**
   * Hover of `accentFill`. Both themes press one step deeper from their own
   * rest — a lift under a white label costs contrast, which is why
   * `accentFill` exists in the first place. `accentHover` stays `accent`'s
   * own hover; the two families no longer share a rest in either theme.
   */
  accentFillHover: palette.danubeFillHover,
  /**
   * The SOLID PRIMARY CONTROL — design/profile's Button, the modal footer's
   * action, the onboarding Next, the checked toggle. Its own role because
   * the two themes disagree about what "the strong button" is: light keeps
   * the brand blue (`accentFill`), dark goes to an off-white with the blue
   * cast of `textHeading` (owner call, Sep 18 2026 — Linear's and GitHub's
   * dark primaries make the same move: on a near-black plane the lightest
   * thing on screen is the loudest, and a saturated blue slab reads as a
   * badge, not a button). `accentFill` is untouched for everything that is
   * not a button — badges, the hero pill, storefront colour.
   */
  // The system primary is the INK in light, mirroring dark's pale primary
  // (owner, Oct 8 2026): "black means do it, blue means this is us". Blue
  // stays on links, today, focus, auth (AuthButton overrides to
  // accentFill) and signed-out marketing calls to action.
  primaryFill: palette.ink,
  primaryFillHover: palette.gray850,
  textOnPrimary: palette.white,
  /**
   * The label of a TEXT-ONLY CONTROL that is brand blue in light — an FAQ
   * question, the "Expand all" toggle, the phone number in the contact card.
   * The one member of the accent family that stops being a color on dark: it
   * goes to plain near-white body text there.
   *
   * The split is decoration versus control, not size or place. `accentText`
   * is the brand color being SHOWN — a keyword lifted out of a headline, a
   * feature glyph — and on a dark ground it lifts to stay recognizable as the
   * brand. These are just things you can click, and they arrive in columns:
   * five FAQ rows stacked under an "Expand all". A column of blue labels on a
   * dark page reads as a wall of links, and it competes with the keyword
   * accents, which are the ones actually saying "brand". Standing the
   * controls down to white leaves one blue on the page doing one job.
   *
   * In light this now stands down with `accentText` to `danubeInk` for the
   * same AA reason; the dark side goes further, to plain body text.
   */
  textInteractive: palette.danubeInk,
  /**
   * A LARGE brand-colored fill — the footer slab, a full-width band. Its own
   * role because big fills and small accents move in opposite directions in
   * dark mode: small accents lighten to hold their color against a dark
   * ground (simultaneous contrast), but a band that big at full saturation
   * becomes the loudest thing on the screen, so it desaturates and deepens
   * instead. Text on it is `textOnAccent` in both themes.
   */
  brandBand: palette.danube,
  /**
   * The homepage hero band. A PALE tint rather than `brandBand`'s full brand
   * blue, and the difference is the job, not a stray value: this band is a
   * GROUND — it carries the ink display headline, the subhead and the
   * search pill, with the hero photograph butted against it — where the
   * footer's `brandBand` is a slab carrying white text and nothing else.
   *
   * Painted `danube` it drops that headline from 6.09:1 to 3.74:1 and turns
   * the largest object above the fold into the loudest one. It stays its own
   * role because the hero is the one band with a photograph and a grade
   * beside it, so it may need to move alone later — as it does in dark, where
   * it goes to `surface` while `brandBand` goes to `surfaceSunken`.
   */
  heroBand: palette.cornflower,

  /**
   * The full-grid band a media exhibit sits in -- today the homepage demo
   * section. A whisper step off `surface` in the page's own hue family:
   * `grayWhisper`, the value `surfaceQuiet` reads, held as its own role
   * because the band answers to the exhibit and its dark half moves alone
   * (a bigger step there -- see the dark block).
   *
   * It was briefly the page's one warm ground (a twine whisper, #f9f1e4)
   * on the theory that cool footage pops off a warm ground. Measured, the
   * temperature did none of the work: the footage plate sits at 13.76:1 on
   * that cream and 13.68:1 here, so lightness was doing all of it -- and a
   * lone warm fill at 8% of the page was the only ground outside the single
   * hue family every other fill on the page belongs to, where the reference
   * pages keep grounds to one family. So it went back to the cool whisper.
   */
  mediaBand: palette.grayWhisper,

  /**
   * THE HOMEPAGE'S TWO SECTION COLORS (owner, 2026-10-25, picked from three
   * directions after the competitor atlas: therapy sites pair a soft green
   * or teal with a soft mulberry or plum, and "all these sites look so
   * beautiful"). This REVISES the Oct 13 two-palettes rule for these roles
   * only: a pale lavender (cut from `mulberry`, our one other hue) and a
   * pale teal may be section GROUNDS on '/', and their deep tones may fill
   * the one button each section carries. Blue stays the brand and the color
   * of every other action; `green` still means success, and the teal is
   * kept bluer than it so the two never read as one. Dark collapses section
   * grounds to `homepageBg` (homepage-v2/ground.ts), so the dark band values
   * are only for a caller that paints one outside that seam.
   */
  homeBandLavender: palette.lavenderWhisper,
  homeBandTeal: palette.tealWhisper,
  // The far ends of the fades that start at each band (owner, 2026-10-25,
  // after Rula): the two sections and the FAQ's open card run from the pale
  // tone at the top left to near-white at the bottom right, so they read lit
  // rather than flat.
  homeBandLavenderFade: palette.lavenderMist,
  homeBandTealFade: palette.tealMist,
  // Deep enough to carry a white label: 7.3:1 and 6.1:1.
  homeActionLavender: palette.plum,
  homeActionLavenderHover: palette.plumHover,
  homeActionTeal: palette.deepTeal,
  homeActionTealHover: palette.deepTealHover,

  /**
   * THE SEARCH RESULTS' DAY TILES (owner, 2026-10-26: the site should read as
   * an uplifting medical site, after the homepage's section colours). Light
   * only: a day with openings is a pale-teal tile with its count in the deep
   * teal, and a day with none is a faint neutral wash, so the two weeks still
   * read as one block (unboxed empty days lost the grid's shape). Dark keeps
   * the grayscale tiles it had: these resolve to the raised tile, its card
   * edge and the flat dead day. The profile's day grid on needtalk.com wears
   * them too (owner, same day: "make these consistent with the search page");
   * a branded booking page keeps the grayscale tile beside the provider's
   * colour. A picked day is still the ink fill (AGENTS.md, "Selection is
   * ink").
   */
  searchDayOpenFill: palette.tealWhisper,
  searchDayOpenEdge: palette.tealWhisper,
  // Hover darkens the fill and keeps the edge invisible on it: no ring.
  searchDayOpenFillHover: palette.tealWhisperHover,
  searchDayOpenEdgeHover: palette.tealWhisperHover,
  searchDayOpenText: palette.deepTeal,
  // The PICKED day inverts (owner, 2026-10-26: "make it darker and maybe
  // even think about inverting the text"): the deep teal with white words,
  // 6.2:1, so the day the booking card describes is unmistakable. Hover stays
  // the pale step with dark words, so a passing pointer never looks picked.
  searchDayPickedFill: palette.deepTeal,
  searchDayPickedFillHover: palette.deepTealHover,
  searchDayPickedText: palette.white,
  searchDayEmptyFill: palette.grayFillLighter,
  searchDayEmptyText: palette.gray500,

  /**
   * The plate under the media itself, INSIDE `mediaBand` -- and dark-only,
   * the `edgeOnDark` pattern applied to a fill. In light the footage is a
   * dark object on a pale band; it separates by itself, and any plate
   * between the two is a second frame doing nothing. In dark the footage and
   * the band are two close darks, so the plate steps in to lift the exhibit
   * off the page.
   */
  mediaPlate: "transparent",

  /**
   * THE GROUND BAKED INTO THE FOOTAGE, and the one role on the page that is
   * the SAME value in both themes -- because the mp4 is. The demo recording
   * is of the app in dark, and its second half pulls back behind the modal's
   * own dim scrim, which is a near-black several steps under the app ground
   * it sits on. On the dark band that scrim is one dark among darks; on the
   * pale light band it hardens into a black rectangle around the success
   * card -- an extra container the section never asked for and cannot remove
   * in CSS, because it is in the pixels.
   *
   * So light paints this behind the video and lets the video LIGHTEN onto it
   * (ProviderDemoSection): every pixel darker than the footage's own ground
   * comes up to it, the scrim closes back into the surface it was dimming,
   * and nothing above that value moves at all. That only lands if the value
   * IS the recording's ground -- measured at rgb(31,35,43), which the dark
   * band already carries -- so it is held here rather than aliased to
   * `mediaBand`, whose light half is the pale ground this problem starts on.
   */
  mediaFootageGround: palette.footageGround,

  /**
   * The edge of a CARD on the page — the plan cards, the feature tiles. Its
   * own role because a card's edge is doing more work on dark, where the card
   * and the page are two dark grays, than in light, where a white card on a
   * gray page is already separated. Light keeps the ordinary border value.
   */
  borderCard: palette.grayHairline,

  /**
   * A decorative CHROME MARK drawn on top of a card — the browser dots and the
   * phone notch on the homepage product replicas. Not a border: it is a filled
   * shape a few pixels across, read as a shape rather than as a line.
   *
   * Its own role because `borderCard` is a LINE value and these are shapes.
   * The role was cut when it was also a legibility problem — the replicas then
   * stood on `surfaceOnSunken`, where borderCard's dark value collapsed and
   * the dots all but vanished while staying perfectly legible in light. Those
   * replicas have since come down to `surfaceRaised`, so that particular gap
   * has closed; see the dark half for the current figures. Light keeps the
   * card-edge value unchanged either way — only dark ever moved.
   */
  chromeMark: palette.grayBorder,

  /**
   * A CARD resting on a SUNKEN SECTION rather than on the page — the homepage
   * feature tiles and plan cards, which sit on full-width `surfaceSunken`
   * bands. White in light, exactly like `surface`.
   *
   * Its own role because "sunken" inverts on dark: there `surfaceSunken` is
   * LIGHTER than `surface`, so a card painted `surface` on one of those bands
   * comes out DARKER than the thing it is supposed to be resting on, and the
   * 1px border ends up carrying the whole card by itself. This lifts the card
   * back above its band — dL* 5.5, within a hair of the 5.67 the white card
   * gets over its gray section in light.
   *
   * WHERE THE ROLE IS ACTUALLY IN FORCE, as of 2026-09-04: light only. The
   * homepage was its one production caller, and the dark side of that page no
   * longer has sunken sections at all — every section collapsed onto one
   * field, so the cards that used to lift off a band had nothing left to lift
   * off and were reading brighter than the same card does inside the app.
   * They take `surfaceRaised` on dark now and this role on light, where their
   * bands are real; the seam is `cardGround` in
   * apps/web/components/homepage-v2/ground.ts.
   *
   * IN THE APP since 2026-10-12: the chosen side of every SegmentedControl,
   * a plate raised on its `surfaceSunken` track (New / Existing patient,
   * /search's session type). The dark value is live UI from then on — it is
   * the one surface role lighter than `surfaceSunken` on dark, which is the
   * whole reason the control uses it (`surfaceRaised` is darker there).
   */
  surfaceOnSunken: palette.white,

  /**
   * A control that sits ON a brand band rather than on the page — today the
   * hero's search pill. White in light, exactly like `surface`; on dark it
   * lifts ABOVE `surface` instead, because the band under it is a mid blue
   * and a page-level card painted on top of it reads as a hole.
   */
  surfaceOnBand: palette.white,
  /**
   * Hover of a segment sitting ON `surfaceOnBand` — the Who/Where fields of
   * the hero search pill. Light is `surfaceHover`: the pill is white, so the
   * ordinary surface hover is the right step. Dark cannot borrow that; the
   * pill is already lifted past `surfaceHover`, so the hover has to climb
   * one more rung or it vanishes. Its own role rather than a white overlay:
   * overlaying white on a cool gray desaturates it, and the leftover reads
   * warm against the rest of the ramp.
   */
  surfaceOnBandHover: palette.coolGrayLight,
  /** Placeholder text on that control — `textMuted` lifted for the lighter
      pill it is printed on. Identical to `textMuted` in light. */
  textOnBandMuted: palette.gray600,

  /**
   * The plan cards on /pricing -- both tiers, and the founding note under
   * them -- are one fill: the ordinary card surface. Premium is told apart
   * by `planFeaturedEdge` (plus a `planFeaturedWash` in dark) and the
   * system's primary button, not by a fill of its own (owner, 2026-09-26).
   * It used to be a saturated navy slab with five pricing-only blues on it
   * (`planSlab*`), the same value in both themes; next to Claude's,
   * ChatGPT's and Perplexity's plan pages, none of which paint a whole card
   * in brand colour, it read as the loudest thing on the screen.
   */
  planCard: palette.white,
  /** The recommended plan's 1px edge. */
  planFeaturedEdge: palette.accentEdgeStrong,
  /** The recommended plan's wash, easing out from the card's top. NONE in
   *  light (owner, 2026-10-12): on a white page the edge alone marks it, as
   *  Perplexity's does, and the wash read as a tinted plate. Dark keeps it,
   *  where a 1px edge on a dark plate is too faint to carry the mark alone. */
  planFeaturedWash: "transparent",
  /** The recommended plan's HEADLINE lines (components/pricing/featureIcons
   *  HEADLINE_LINES) -- the label and its icon, which are one colour. In
   *  light they take the brand ink, as Perplexity's Pro card colours its two
   *  headline lines in its teal and leaves the rest muted (owner, 2026-10-12:
   *  Premium "needs to stand out as much as Perplexity's"). `danubeInk` is
   *  5.40:1 on white, AA at 15px. Dark keeps them neutral: there the wash
   *  carries the mark, and dark drops accents light keeps. */
  planFeaturedLineText: palette.danubeInk,
  planFeaturedLineIcon: palette.danubeInk,
  /** The chosen option in a small two-way switch that sits on a
   *  `surfaceSunken` track (/pricing's Monthly/Yearly). A quiet step off the
   *  track, as the plan pages it follows draw theirs: white on the grey track
   *  in light, a rung and a half lighter than the track in dark. Not
   *  `surfaceInverse`, which printed a white chip on a dark page (owner,
   *  2026-09-26: "too much white"), and not `surfaceRaised`, which is DARKER
   *  than the track in dark. */
  segmentSelected: palette.white,

  /**
   * The HOMEPAGE's plan cards — BOTH of them, Basic and Premium alike. A
   * separate family from `planCard` above, /pricing's plain plates: these
   * are drawn in the brand blue itself, a matched pair rather than a
   * highlight, and they do not survive dark.
   *
   * In light they are brand-blue slabs; what tells the plans apart is the
   * price and the copy, not the fill. In dark they stand down to `surface`,
   * the plate the rest of the page uses, for the reason every large brand
   * fill on this page stands down there: deepened far enough to be quiet the
   * blue stops reading as the brand, and lifted far enough to read as the
   * brand a card that size becomes the loudest object on the screen, with no
   * value in between. Two of them side by side only doubles that.
   *
   * Because the ground flips, nothing printed on the cards can pin a color
   * either — hence the four roles below rather than `textOnAccent`. Each
   * resolves in dark to the ordinary card value, so a plan card and a feature
   * tile cannot drift apart there.
   */
  planBrand: palette.danube,
  /** Their titles, descriptions and prices. */
  textOnPlanBrand: palette.white,
  /** Their fine print — the onboarding-fee line. White in light rather than a
   *  muted gray: `textSecondary` on the slab is 1.24:1, and nothing quieter
   *  than white clears that fill at 13px. */
  textOnPlanBrandMuted: palette.white,
  /** Their CTA: a white pill on the slab, which is the loudest thing a card
   *  this saturated can carry. It flips direction rather than value between
   *  themes — in dark the cards are plates, so the pill goes near-white with
   *  dark text. Near-white and not pure white, because at #ffffff a 45px pill
   *  on a dark page is a flashbulb. */
  planBrandAction: palette.white,
  textOnPlanBrandAction: palette.gray800,

  /**
   * The default article tile (blog featured-image placeholder). It stands in
   * for a photograph, so what it has to preserve across themes is its
   * SEPARATION from the card, not its exact value: in light the plate is the
   * dark object on a white card (6.69:1), and deepening it the way `brandBand`
   * does would leave it at 2.50:1 on the dark card — a murky rectangle where
   * a picture should be. So this one lifts instead, to 3.59:1 on `surface`,
   * and the waves lift with it to keep the internal step the art is drawn
   * around (1.84:1 dark, 1.63:1 light). Kept as its own pair rather than
   * `accent` because the wave has to stay a step above the plate, whatever
   * the accent does. Both plates carry the brand's saturation at their own
   * lightness — see `palette.articlePlate` for why they had to be re-derived.
   */
  articleTilePlate: palette.articlePlate,
  articleTileWave: palette.danube,

  // Text: THREE READABLE STEPS, then disabled (owner, 2026-10-16), as Airbnb
  // runs #222 / #6C6C6C / #8C8C8C. One dark for every heading and paragraph
  // (textPrimary), one secondary (textSecondary), the placeholder as the
  // tertiary, and textDisabled. textHeading, textBody and textMuted are
  // ALIASES of those steps until their call sites are renamed; never give
  // one its own value again.
  //
  // Secondary takes the darker of the two greys it merged, per theme: in
  // light gray600 (5.73:1 on white), because graySlate fell to 4.27:1 on
  // `surfaceSunkenHover` where gray600 holds 4.72:1.
  textPrimary: palette.ink,
  textHeading: palette.ink,
  textBody: palette.ink,
  textSecondary: palette.gray600,
  /**
   * A QUIET GRAPHICAL MARK — today the gate list's dotted pending ring, and
   * anything else that is a hairline drawing rather than a glyph.
   *
   * It exists because `textSecondary` does not hold its relationship across
   * the two themes and a drawing notices what text does not. Measured on
   * each theme's own ground: the row's label lands at 16.10:1 dark and
   * 15.43:1 light, the met check at 12.79 and 12.24 — both within 5% of
   * themselves. `textSecondary` goes 7.24:1 dark to 5.05:1 light, so the
   * ring kept 45% of its label's contrast in dark and only 33% in light.
   *
   * Two things make a ring feel that gap more than a sentence would. It is
   * nine round dots of a 2px stroke, so there is very little ink to carry
   * the contrast it has; and a thin DARK mark on a light ground reads
   * lighter than a thin LIGHT mark on a dark ground at equal ratio, because
   * the light one blooms into its surround. Light was losing on both.
   *
   * So dark keeps textSecondary's value exactly and light takes its own,
   * chosen to restore the ratio rather than to look right alone: #474e55 is
   * graySlate's hue and saturation walked down in lightness to 8.22:1,
   * which is 53% of the label. Owner picked it over the 6.94:1 value that
   * matched dark's 45% on the numbers -- the arithmetic gets a hairline into
   * the neighbourhood, the eye settles it (Sep 22 2026).
   *
   * Still clearly under the met check at 12.24:1, which is the ordering the
   * list depends on: the mark that says "done" outranks the one that says
   * "waiting". If this is ever reused, the test is that ratio, not the hex.
   */
  markQuiet: palette.graySlateDeep,
  /**
   * Label and edge of an outlined availability choice. Light uses the deeper
   * brand-blue ink so the control still reads blue while clearing normal-text
   * contrast. Dark remaps it to a lifted neutral so outlined choices do not
   * compete with the filled blue selection and Continue CTA.
   */
  outlinedControl: palette.danubeInk,
  /** Hover follows the same theme split: stronger blue in light, brighter
   *  neutral in dark. */
  outlinedControlHover: palette.darkblue,
  textMuted: palette.gray600, // = textSecondary (the ramp above)
  textPlaceholder: palette.gray500,
  textDisabled: palette.gray400,
  /** Text sitting ON a brand-colored control. Not a synonym for `surface`:
   *  in dark mode surfaces darken but text-on-accent stays light. */
  textOnAccent: palette.white,
  /**
   * A SMALL BRAND TILE INSIDE CONTENT — an app mark on a notification, the
   * kind of square an OS draws beside a title. Brand blue on light, where it
   * reads as identity against a white card; a raised NEUTRAL on dark, where
   * a saturated square at that size is a hole punched in the card rather
   * than a mark on it (owner, Sep 18 2026, against his own dark frames).
   *
   * Its own role and not `accentFill` precisely because it diverges: a brand
   * FILL keeps the saturated blue in dark (see the Aug 25 decision) and this
   * one does not. Ink on it is `textOnAccent`, white in both themes, which
   * is what makes the pair legible either way.
   */
  markFill: palette.danube,
  /** The glyph on `markFill`. White in both themes. It was the light brand
   *  blue in dark from Oct 2 to Oct 4 2026; once the moment well became a
   *  navy plate the colour lived there, and the owner put the glyph back to
   *  white. Its own role so the dark value can diverge again. */
  markInk: palette.white,
  /**
   * THE GROUND OF A MOMENT'S WELL -- a brand-blue plate the replica sits on,
   * the way claude.ai's Customize banners are a full saturated plate rather
   * than a tint over gray (owner, Oct 4 2026: a gray-blue glow read "sad").
   * A clear light blue in light, under a white replica card; a deep navy in
   * dark, under a surfaceRaised one. The modal well lifts it toward
   * `accentFill` at the top edge; it is never a text ground.
   */
  wellTint: palette.wellPlate,
  // The pool of light a plant stands in. Oct 9 2026 (owner, "make the
  // images work better on black") gave it a faint ink glow in dark so the
  // cast shadow had something to fall on; Oct 12 2026 (owner) took the glow
  // back out: dark wants the plant's shadow but not a light behind it. Empty
  // in both themes, and kept as a role rather than deleted so a pool can come
  // back as a token edit -- components/illustrations carries no theme branch
  // (illustrationInvariants).
  plantPool: palette.plantPoolTint,
  /**
   * Text on the PRIMARY CTA and the accent fills — the same value as
   * `textOnAccent` here and its own role only because a storefront may
   * override it.
   *
   * A storefront paints its own colour on `accentFill`, `accentFillHover`
   * and the CTA gradient's two stops, and the label on those has to be
   * DERIVED from that colour (a pale accent needs ink, not white). Before
   * this role the applier overrode `textOnAccent` itself, which followed
   * every OTHER strong fill too: on a light accent the error toast's label
   * on `dangerFill` went near-black, 2.75:1. So: whatever a storefront can
   * repaint carries `ctaLabel`; every other filled control keeps
   * `textOnAccent`, which nothing overrides.
   */
  ctaLabel: palette.white,
  /**
   * The keyboard focus ring on the primary CTA and the accent fills.
   *
   * `accentStrong` here, which is what those controls already used — its own
   * role for the same reason as `ctaLabel`: a storefront derives it from the
   * accent, and on dark it has to be LIFTED rather than darkened or a deep
   * accent's ring lands at 1.47:1 on the dark surface and is not a ring at
   * all.
   */
  focusRing: palette.darkblue,
  /**
   * The edge of a focused TEXT FIELD: ink, the same 2px weight as the ink
   * selection ring. Not `focusRing`, which stays blue for keyboard focus on
   * buttons, cards and controls: those can also be SELECTED, and selection is
   * a 2px ink ring, so an ink focus ring there would make the card you are on
   * and the card you picked look alike. A text field cannot be selected, so
   * its focus can be ink -- which is what leaves an onboarding step with no
   * stray blue on it (owner, Oct 12 2026, after Airbnb's setup flow).
   */
  fieldFocus: palette.ink,
  /**
   * The drag-select band (`::selection`), page-wide: one rule in the web
   * app's GlobalStyles, so body copy, headings and text fields all select in
   * the brand wash rather than the reader's OS accent.
   *
   * Its own role because it began as the last hardcoded colour in a text
   * field: a literal `rgba(82, 117, 170, 0.2)` sat in design/profile's
   * StyledTextField, then the only `::selection` rule in the app, and being a
   * literal it did not flip. On the dark card that wash composited to #212b39 against a #15181d
   * field -- 1.16:1, so selecting text in a dark field showed almost nothing.
   *
   * A wash, not a fill: the alpha is the point, since the typed value has to
   * stay readable THROUGH it. The light value is the old literal kept to the
   * digit so light mode is untouched; dark lifts to the accent at a heavier
   * 0.35 because the same alpha reads weaker against a dark ground (a 1.29
   * band in light needs 0.35 to land at 1.64 in dark). Text on the dark band
   * stays 9.13:1.
   */
  textSelection: palette.selectionWash,

  // Surfaces
  bg: palette.pageBg,
  canvas: palette.canvas,
  /**
   * The branded booking page's BLACK background (shared/storefrontStyle.js,
   * GROUNDS): pure black (owner, 2026-10-20). It was `canvas` on dark, the
   * app's near-black floor, which read as a very dark charcoal beside a
   * merchant's own black. Only ever painted on a dark page, so it is the
   * same in both themes; the page's brightest inks step down to `textBody`
   * on it (owner, 2026-10-04: no pure white against pure black).
   */
  storefrontBlack: palette.black,
  /**
   * The ink the Black background steps its brightest text down to: on pure
   * black the dark theme's #e8ecf1 is 17.7:1 and reads as white on black
   * (owner, 2026-10-04). It was `textBody`, until the three-step ramp
   * (2026-10-16) made `textBody` an alias of `textPrimary` and the step
   * quietly stopped happening. Light never paints it.
   */
  storefrontBlackInk: palette.ink,
  /**
   * The band a CARD STANDS ON, where the card meets the page directly and
   * nothing else separates them — the storefront/profile ground on a phone:
   * the strip above the card carrying the nav circles, and the strip below it.
   *
   * Its own role because the two themes want opposite ends of the ramp here
   * and no existing single token spans them. In light the band is a gray
   * UNDER a white card, which is `surfaceSunken` (#eceff3, ΔL* 5.67 under the
   * card). In dark that same token is LIGHTER than `surface`, so the band
   * rises above the card and the page reads inside-out — dark needs the floor,
   * `canvas` (#000).
   *
   * This is why 200d26e could not simply keep `neutral`: it fixed dark by
   * moving all five call sites onto `canvas`, and light came along for the
   * ride (#eceff3 -> #ecedef, ΔE2000 1.24) as acknowledged collateral rather
   * than as a decision. This role is that collateral undone, with dark's fix
   * kept intact.
   *
   * Deliberately NOT folded into `canvas`: the light page ground cannot carry
   * this value. `canvas` sits ΔE2000 1.24 from `surfaceSunken` already, and
   * every page that stands a `surfaceSunken` panel on a `canvas` ground —
   * /refer below 700px — is relying on that last scrap of
   * separation. Giving `canvas` this band's value collapses that pair to 0.00
   * outright; re-deriving it at the ground family's own chroma instead lands
   * between 0.62 and 1.02 while moving `canvas` itself by ΔE2000 <= 1.6, which
   * is under the threshold anyone would see. Either way those panels go with
   * it, which is why the band gets a role and the page ground keeps its value.
   */
  cardBand: palette.neutral,
  surface: palette.white,
  /**
   * The NAVIGATION RAIL's ground — the console's left column, and the sidebar
   * of any SettingsLayout. Identical to `surface` in light, and its own role
   * only because of dark, where the rail and the content column had been the
   * same near-black and the app therefore read as one undifferentiated field.
   *
   * On dark this goes to pure black, BELOW the content rather than above it.
   * That direction is the whole point and it is worth stating, because the
   * instinct is the opposite one: the way to make a dark app stop reading as
   * flat is not to lift the content — which only makes the page brighter —
   * but to drop the chrome away from it, so the content column reads as the
   * lit plane by comparison. Linear's app is built exactly this way: rail
   * #000000, page #0f0f0f, card #171717, measured off their own settings
   * screen. Our `surface` (#0d1013) already sits within four percent of their
   * page; the rail was the missing rung, not the ground.
   *
   * Pure black rather than a tinted near-black on purpose. Every other dark
   * surface carries the ramp's blue tint, but this is the ramp's FLOOR — a
   * hue at zero lightness is not a hue — and a tinted "almost black" beside
   * true black is the one place the tint reads as a colour cast instead of as
   * temperature. It also gives the rail somewhere to go that no card can
   * accidentally collide with.
   *
   * The seam is still the `divider` line on the sidebar's right edge, not the
   * fill step alone: the step is 1.10:1, which is presence, not a boundary.
   */
  surfaceRail: palette.white,
  /**
   * A full-width band one whisper below `surface` -- ~2 L* on both themes,
   * where `surfaceSunken` is a deliberate step (~5+). For a section that
   * needs to read as its own band without announcing itself: the reader
   * should register the change of ground only as rhythm, the way Stripe's
   * white-to-#f6f9fc bands work (that value measures the same ~2 L*). Not a
   * control ground -- nothing sits "on" this the way `surfaceOnSunken` sits
   * on `surfaceSunken`; cards on this band keep their `surface` fills.
   */
  surfaceQuiet: palette.grayWhisper,
  /**
   * One step ABOVE `surface` — a card sitting on chrome that is already
   * `surface`, such as the identity card at the top of the account dropdown.
   * Identical to `surface` in light, and its own role only because of dark,
   * where "lifted" cannot be said with a shadow: black over a near-black
   * ground is nothing, so the fill has to carry it. It carries it ALONE —
   * `cardShadow` stays flat across themes rather than deepening, so this step
   * is the only lift cue there and has to be sized to stand in for a shadow,
   * not merely to be visible. Sized in CIE L*, never in contrast ratio; the
   * dark value carries the measurements and the reasoning.
   *
   * NOT a menu's ground. A floating panel takes `surface`, the same fill as
   * the bar or card it opens from — see `menuSurface` in library/styled.js.
   */
  surfaceRaised: palette.white,
  /** Quiet/sunken panel and control ground: skeleton base, secondary-button
   *  fill, chips. This is where the raw #eceff3/#f5f5f5/#f3f4f6 family maps. */
  surfaceSunken: palette.neutral,
  /** The no-photo avatar's disc and its initial (owner, 2026-10-16;
   *  specs/profile/display/feature.md). In light these are `surfaceSunken`
   *  and `textSecondary`, unchanged (4.97:1). They are roles of their own
   *  because dark has to step off them: see the dark values. */
  avatarPlate: palette.neutral,
  avatarInitial: palette.gray600,
  /** THE ONE SKELETON FILL (owner, 2026-10-11: "our skeleton across the app
   *  needs to be the same color for the same backgrounds. Shouldn't be an
   *  exception"). An ink ALPHA, not a gray, so it is the same step off
   *  whatever it stands on -- the page, a raised card, a sheet -- without a
   *  per-ground variant. It used to be `surfaceSunken`, which on dark is
   *  LIGHTER than the cards a skeleton stands in for, so the Calendar's 35
   *  placeholder tiles pulsed brighter than the month that replaced them.
   *  Every placeholder bone reads it through components/shared/SkeletonStyles
   *  (CustomSkeleton, `skeletonStyles`, the `loading` mixin); never fill a
   *  bone with a surface role. */
  skeleton: palette.skeletonInk,
  /** Resting hover fill on menus, rows, and chips (#eaeaea/#f3f4f6 family). */
  surfaceHover: palette.coolGrayLight,
  /**
   * A BUTTON's hover on a plain surface: the hairline (ghost) and outlined
   * recipes. A wash, ΔL* ~3 off white (#f5f6f8) where `surfaceHover` is
   * 5.25 -- owner, 2026-10-13, on "Maybe later": the row fill "only works
   * in things like selecting items from a list like Menu or Bottom sheet
   * with options, not buttons". A row's hover marks which item you are on;
   * a button's only says it is live, and wants less. The button's press and
   * open state keep `surfaceHover`, a step past this. Dark is unchanged.
   */
  controlHover: palette.coolGrayLightest,
  /**
   * The Calendar's drag preview: the days a press-and-drag will pick, before
   * it is released (Airbnb's #f7f7f7, owner 2026-10-06: "more subtle like
   * Airbnb"; then "doesn't have to be that blue"). The least-tinted near-white
   * the ramp has (blue lift 2, where grayWhisper's is 5), so it reads as gray.
   */
  pickPreview: palette.pricingBg,
  /** The preview's END, the day under the pointer: one step darker so the
   *  reader sees where the stretch stops (Airbnb's), and barely tinted too. */
  pickPreviewEnd: palette.graySunkenHover,
  /**
   * The SELECTED row's plate in a sidebar — the settings nav's "you are here".
   *
   * Identical to `surfaceHover` in LIGHT, which is what every settings sidebar
   * already renders, so this theme does not move. It exists for DARK, where
   * reusing the hover fill was measurably twice as loud as the light plate it
   * was supposed to mirror: `surface` -> this is ΔL* 5.25 in light, where
   * `surface` -> `surfaceHover` in dark ran to ΔL* 10.19, because a fill tuned
   * to read as a hover ON a dark card is far too much as a resting state UNDER
   * one. The dark value below is sized to the light step, not copied from the
   * hover.
   *
   * Stated in TOKEN NAMES rather than hexes on purpose: the dark grounds were
   * deepened on 2026-09-03 and both of those values were re-derived with them,
   * so a hex copied here would have gone stale while the argument did not. The
   * argument is a ratio and it survived — dark's hover is still close to twice
   * the light plate's step, and the dark plate is still sized to the light
   * one. Its re-derivation, with the numbers as they stand, is on
   * `surfaceSelected` in the dark block.
   *
   * A resting plate and a hover fill are different jobs and only coincided by
   * accident: hover is momentary and wants presence, selection is permanent
   * and wants to be findable without being loud.
   *
   * TWO CONSUMERS, ONE TREATMENT. The provider console's rail row uses this
   * too, as of 2026-09-06. It briefly had an accent pair of its own — a 7%
   * `danube` plate under a `danubeInk` label — which made it the only sidebar
   * in the app that coloured its current row; both tokens are gone and the
   * rail is a settings sidebar again (app/dashboard/page.js, RailItem). So
   * nothing about selection is theme-conditional any more: the current row is
   * this plate plus `font-weight: 600`, in both themes, everywhere.
   */
  surfaceSelected: palette.coolGrayLight,
  /**
   * Hover for a control already sitting on `surfaceSunken`. Not the same as
   * `surfaceHover`, which is LIGHTER than surfaceSunken — using it on a sunken
   * control inverts the hover direction, making the control appear to lift on
   * hover in light mode and flash near-white in dark.
   */
  surfaceSunkenHover: palette.graySunkenHover,
  /**
   * A disabled control's ground. Its own role because it inverts: in light it
   * sits BELOW the surface (greyer than white), and in dark it must also sit
   * below the surface rather than above it — reusing surfaceSunken there makes
   * a disabled field read as brighter, i.e. more prominent than a live one.
   */
  surfaceDisabled: palette.grayDisabledFill,
  surfaceDisabledStrong: palette.grayDisabledFillStrong,
  /**
   * The ground behind a Google Map, showing only until the tiles paint. It
   * tracks the map's own color scheme rather than ours, so it stays a
   * separate role from every other surface: this is the one place where the
   * right answer is whatever Google renders, not whatever our page does.
   */
  mapCanvas: palette.mapLand,
  /** Inverse chrome: tooltips, dark toolbars. Pairs with textOnInverse. */
  surfaceInverse: palette.gray850,
  textOnInverse: palette.white,

  /**
   * The plate a THIRD-PARTY BRAND MARK stands on: the Zoom / Google / Teams
   * tile at the head of an integration sheet.
   *
   * It is deliberately the one surface that does NOT flip with the theme.
   * Every one of these marks is drawn by its owner for a light ground — a
   * white camera knocked out of Zoom's blue, Google's four colours — and on
   * our dark `surface` they lose their own edges. Both references we took
   * this sheet from keep a near-white plate under the mark in dark mode for
   * the same reason. `surfaceInverse` gets this right on dark by accident
   * and wrong on light (it would put a charcoal plate under the mark on a
   * white page), so it is not the role for this.
   *
   * Not for our own marks, which follow the theme like everything else.
   */
  brandPlate: palette.grayFill,

  // Lines
  /** The app's real 1px hairline. (The 2026-08-22 grey audit: #dddddd is the
   *  border 69/78 times; #eceff3 — this role's previous value — is a
   *  background 73/84 times, so it moved to surfaceSunken.) */
  border: palette.grayHairline,
  /**
   * The resting edge of something you TAP TO PICK: a time chip, a priced
   * option card, a ChoiceCard (owner, 2026-10-29). Between the hairline and
   * a field: 1.92:1, because like a field its edge is what says "you can
   * choose this", but it is a button, not a box you type in. The pick wears
   * the ink ring; hover is `pickEdgeHover`, one step on.
   */
  pickEdge: palette.grayBorderHover,
  /** A pickable edge under the pointer: the field edge's weight, 3.15:1. */
  pickEdgeHover: palette.grayFieldEdge,
  /** The navbar's bottom line on every page (components/layouts/header.js):
   *  1px at Airbnb's strength -- their 10% black (#e6e6e6 on white) at our
   *  ramp's hue here, a tinted solid on dark (owner, 2026-10-03, "1px
   *  everywhere"; dark's 8% white `border` all but vanished, 2px of the
   *  border grey read too strong). Figma variable navLine. */
  navLine: palette.grayNavLine,
  /**
   * The resting edge of a FORM CONTROL -- a text field, a select, the box a
   * segmented control draws around its options. One step heavier than
   * `border` because those two lines are doing different jobs: `border` sits
   * between two things that are already visible, while this line is the only
   * thing saying "you can type/choose here", and at hairline weight a field
   * on `surface` reads as a label rather than an input. A full step lighter
   * than `controlOutline`, which has to carry a whole button on its own.
   *
   * Every field edge takes this role, so they stay the same weight as each
   * other -- a control that hand-rolls its own gray is the bug this replaces.
   * Hover is `fieldBorderHover`, a step past this; the hairlines' own
   * `borderHover` is now lighter than a resting field in light.
   */
  fieldBorder: palette.grayFieldEdge,
  /** A field's edge under the pointer: 4.87:1 in light, between the resting
   *  edge (3.15) and the ink focus edge. */
  fieldBorderHover: palette.gray500,
  /**
   * The same hairline under the pointer. A field's resting border is `border`
   * and its hover is this — one step more present, which on light means
   * DARKER and on dark means LIGHTER. Fields used to hover to a literal
   * #bbb/#aaa, i.e. to a pale ring on a dark ground.
   */
  borderHover: palette.grayBorderHover,
  /**
   * The edge of an EMPTY interactive control: the unchecked checkbox, the
   * unselected radio.
   *
   * Its own role because neither neighbour fits. `border` and `borderHover`
   * are HAIRLINES -- they outline something already visible, so they are free
   * to sit at 1.35:1 and 1.92:1. An empty control has nothing else announcing
   * it, so its edge is "visual information required to identify a user
   * interface component" and owes 3:1 (WCAG 1.4.11). This clears it in both
   * themes (3.35:1 light, 3.55:1 dark).
   *
   * Neutral, not accent. The checkbox used to sit on `accentText` at rest,
   * which inverted the state change on dark -- 8.10:1 unchecked against the
   * checked `accentFill`'s 3.76:1, so ticking a box made it LESS visible --
   * and made the checkbox disagree with the radio, which was already neutral.
   * Rest is neutral so that checking it is a lift.
   */
  controlBorder: palette.grayControlBorder,
  borderMuted: palette.neutralBorder,
  divider: palette.divider,

  /**
   * A pale neutral track: the inside of a usage bar. It was the switch's off
   * track until the switch moved to `switchTrack` (below) and kept its name.
   */
  controlTrack: palette.grayToggleTrack,

  /**
   * Switch (web `ToggleSwitch`, mobile `DashboardToggleSwitch`). The TRACK
   * carries the state -- `switchTrack` off, `accentFill` on -- and the knob is
   * `switchKnob` in both states, white in both themes like the iOS and
   * Material switches. Off is a mid neutral rather than a pale one because
   * the off track is the only thing identifying the control, so it owes 3:1
   * (WCAG 1.4.11): the same values as `controlBorder`, 3.35:1 on `surface` in
   * light, 3.55:1 on the card in dark. On dark it stays BELOW `accentFill`
   * (3.76:1) so that switching on is a lift, the inversion `controlBorder`
   * was fixed for. Its own role and not `controlBorder` because it is a fill.
   */
  switchTrack: palette.grayControlBorder,
  switchKnob: palette.white,

  /**
   * A FILLED control that is deliberately not the primary action — a neutral
   * slab with a white label, the way the Basic plan's button reads next to
   * Premium's blue one. Not `surfaceSunken`: that is a ground for dark text,
   * and this one carries `textOnAccent`, so it is sized against white rather
   * than against the card. In dark it inverts direction like every other
   * filled control — it sits ABOVE the card instead of below the page — and
   * holds the same 3.19:1 against the card that the light pair holds against
   * white.
   */
  controlNeutral: palette.grayControlFill,
  controlNeutralHover: palette.grayControlFillHover,

  /**
   * The face of a control that has to read as physically RAISED off the
   * ground it sits on — the search filter pills. Two stops because the
   * lighting is what sells it: the face is top-lit, and a flat fill of the
   * same value reads as a patch rather than a button.
   *
   * It cannot borrow `surface`, and that is the whole reason it exists. On
   * light, `surface` (white) already sits above `surfaceSunken`, so a pill on
   * a sunken bar could take it; on dark the two invert on purpose —
   * `surfaceSunken` is LIGHTER than `surface` there — and the same borrow
   * drops the pill through the bar it is meant to stand on. The dark values
   * are the mirror of the light pair in contrast terms (face-to-bar 1.17:1 in
   * both themes), not a mirror of the hexes.
   */
  controlRaised: palette.white,
  controlRaisedShade: palette.coolGrayLightest,

  /**
   * The face of a circular control standing on `cardBand` — the two circles in
   * the profile's mobile navbar, which sit on the band rather than on a card.
   *
   * Its own role because the band lands at opposite ends of the ramp in the
   * two themes, so no single existing fill clears it in both. Light: white on
   * `#eceff3`, ΔL* 5.67. Dark: `#191f24` on the `#000` floor, ΔL* 11.37 —
   * `surface` would be only 4.5 there, which is enough for a full-bleed card
   * but not for a 40px disc, and that is precisely how the disc came to
   * vanish on a dark phone (d29986f). The mirror of that mistake is borrowing
   * `surfaceSunken` on light, where it IS the band: ΔL* 0.60, the state that
   * shipped 2026-09-10 to 09-13.
   *
   * The press has less room than the rest fill and cannot be given more: white
   * is the ceiling in light, so it travels DOWN toward the band (3.14 off
   * rest, 2.53 still clear of the band — the whole gap is only 5.67, and this
   * splits it) while dark travels UP away from the floor (6.28 / 17.66). If
   * the band or the rest fill ever moves, this press is the first thing that
   * stops reading.
   */
  controlOnCardBand: palette.white,
  controlOnCardBandHover: palette.coolGrayLightest,

  /**
   * The face of a circular control standing on the RAIL. Its one user, the
   * rail's back disc (AppShell's `RailBack`), became a row on 2026-10-12, so
   * nothing reads this today; kept for the next rail control. Sibling of the pair above,
   * and its own role for the same reason: the rail is a different plane from
   * the content column, so the navbar's own fill does not carry across.
   *
   * ON LIGHT THE TWO PLANES ARE THE SAME. `surfaceRail` and `surface` are both
   * `#ffffff` here, so the navbar's fill IS the right fill, and this simply
   * takes it: `#eceff3` on white, ΔL* 5.67, identical to the discs top-right.
   * The value is duplicated rather than aliased so the dark side can differ
   * without dragging light along.
   *
   * On DARK they are not the same, which is the whole reason this exists —
   * see the dark value.
   */
  controlOnRail: palette.neutral,
  controlOnRailHover: palette.graySunkenHover,

  /**
   * The face of a circular control standing on a RAISED card
   * (`surfaceRaised`) -- the owner's edit pencil in the profile's booking
   * card corner. Sibling of the two pairs above, for the same reason: on dark
   * `surfaceSunken` is only ΔL* 1.58 off `surfaceRaised` (#21252c on
   * #1e2228), so the plain IconButton's disc vanished into the card and left
   * a floating glyph (owner, 2026-10-04).
   *
   * Light is the plain IconButton exactly: the raised card is `#ffffff` there,
   * so `#eceff3` holds the navbar's ΔL* 5.67. Duplicated rather than aliased
   * so dark can differ -- see the dark value.
   */
  /**
   * A back arrow's disc: one step QUIETER than the header's pills and the
   * icon buttons (`surfaceSunken`), the way Airbnb's back disc (#f7f7f7)
   * sits under its List pill (#f2f2f2) -- the way out is always there and
   * never asks for attention (owner, 2026-10-06). Light is the ramp's
   * whisper; dark is the raised card's step, because the whisper's own dark
   * value (`surfaceQuiet`) is 1.04:1 on the plane and the disc would vanish.
   * Hover still lands on `surfaceSunkenHover`, so the press reads the same.
   */
  controlQuiet: palette.grayWhisper,
  controlOnRaised: palette.neutral,
  controlOnRaisedHover: palette.graySunkenHover,
  /**
   * The chosen side of a SegmentedControl: a plate on its track, which is the
   * ground's neutral fill (`controlOnRaised` on a raised card, else
   * `surfaceSunken`). Light is white on a hairline, exactly what the control
   * drew before this role. Dark lifts it well clear of BOTH tracks (owner,
   * 2026-10-13, beside Claude's Yours | Discover: "we need more contrast"):
   * `surfaceOnSunken` was the same hex as `controlOnRaised`, so on the open
   * booking step the plate sat on a track of its own colour.
   */
  segmentPlate: palette.white,
  segmentPlateEdge: palette.grayBorder,
  // The same plate on a FLOATING card (the Calendar's phone dock), whose
  // track is `controlOnFloating`, a step above the raised one. Declared by
  // theme.floatingGround the way the neutral fill is. Light is unchanged.
  segmentPlateOnFloating: palette.white,
  segmentPlateEdgeOnFloating: palette.grayBorder,
  /**
   * A card FLOATING over the page's own cards: the Calendar's phone dock
   * (the open switch, the Hours / Where / Booked rows, a row grown into its
   * editor) over the List's day rows and the Month's tiles, which are
   * `surfaceRaised` too. On dark both were #1e2228 with the same hairline, so
   * only a black shadow on a near-black page told them apart (owner,
   * 2026-10-08, beside Airbnb's phone calendar, whose floating cards are the
   * strongest thing on screen: "too difficult to distinguish"). Light is the
   * raised card exactly: white over white rows already parts on the shadow.
   * Its neutral control is a step up again, through the ground's own
   * properties (theme.floatingGround), so a button on it never sinks.
   */
  surfaceFloating: palette.white,
  controlOnFloating: palette.neutral,
  controlOnFloatingHover: palette.graySunkenHover,
  /**
   * A BARE button's hover on the floating plane -- the dock's date pill and
   * its x. Light is `controlHover`'s wash (the plane is white). Dark cannot
   * borrow `surfaceHover`, which there is the floating plane's own value, so
   * the pill's hover did nothing; it takes `controlOnFloating`'s rung.
   */
  surfaceFloatingHover: palette.coolGrayLightest,
  /**
   * The hover plate of a BARE control standing on `canvas` -- the preview
   * column's Expand and Close (components/shared/BarIconButton). The bar's
   * own plate is `surfaceHover`, sized for white, and on canvas it is a hair
   * LIGHTER than the ground (#eef0f4 on #ecedef), so the plate vanished
   * (owner, 2026-10-08). This takes the same step down from canvas that
   * surfaceHover takes down from white, ~ΔL* 5.
   */
  controlOnCanvasHover: palette.grayFillDark,
  /**
   * A FILLED neutral button standing on `canvas` -- the console's Session
   * info column, which takes the preview's canvas ground for contrast with
   * the pane (owner, 2026-10-16). The sunken pill (#eceff3) is a hair off
   * canvas (#ecedef) and vanished there. Rest is the bare control's hover
   * plate above, the same ~ΔL* 5 step down from canvas that surfaceSunken
   * takes from white; hover is the next step down the ramp.
   */
  controlOnCanvas: palette.grayFillDark,
  controlOnCanvasFillHover: palette.coolGrayBorder,

  /**
   * The edge of an OUTLINED button — one that carries no fill of its own, so
   * the line is the entire control. A full step heavier than `border` on
   * purpose: a hairline is a divider between two things that are both already
   * visible, whereas this is the only mark saying a button is there at all,
   * and at hairline weight the button disappears into whatever it sits on.
   *
   * The dark value is set by contrast against the face it outlines (2.85:1,
   * the same ratio the light pair has had since this button was drawn), which
   * lands it at the lightest line in the dark theme — deliberately, since
   * every other line there is a divider and this one is a control.
   */
  controlOutline: palette.gray400,

  /**
   * A bottom-nav tab at rest — its icon and its 10px label together. Light is
   * `textMuted` unchanged; the role exists because dark cannot keep that step.
   * A muted gray is a fine SECONDARY line inside a card, where the eye is
   * already parked. The tab bar is the opposite: permanent chrome pinned to
   * the bottom edge, read in passing, drawn as 1.5px strokes and 10px text.
   * At that size the light-on-dark version of the muted step goes soft
   * (#8a939c on `surface` is 5.2:1, under the 5.7:1 the light pair has), so
   * on dark the resting tab climbs one rung up the text ramp to the
   * `textSecondary` value instead. The SELECTED tab is `navSelected` in both
   * themes — it is told apart by hue and weight, not by out-shouting this.
   */
  navInactive: palette.gray600,

  /**
   * The SELECTED bottom-nav tab — icon and 10px label together. Its own role
   * rather than `accent` or `accentText` because the tab bar is chrome, not a
   * citation: `accent` is 4.10:1 on `surface` (4.32 on dark) and fails AA at
   * 10px, and `accentText` is the link blue. This sits between them, same
   * hue, ~5.4:1 light and ~5.9:1 dark. Weight and hue still do the
   * telling-apart; this only makes it legible without reading as a row of
   * links.
   */
  navSelected: palette.danubeInk,

  // Scrollbars — one repeated recipe copy-pasted across ~12 files today.
  scrollbarThumb: palette.grayScrollThumb,
  scrollbarThumbHover: palette.grayScrollThumbHover,

  // Status
  danger: palette.danger,
  dangerHover: palette.hoverDanger,
  /** Filled destructive controls carrying textOnAccent. Kept separate from
   *  the danger signal color because dark mode has to deepen the fill enough
   *  for a small white button label to remain legible. */
  dangerFill: palette.danger,
  dangerFillHover: palette.hoverDanger,
  success: palette.green,
  successHover: palette.hoverGreen,
  /** Filled positive controls carrying textOnAccent — the success mirror of
   *  `dangerFill`. `success` is the signal color: it lifts on dark to stay
   *  legible as a glyph or text, which is exactly the wrong move under a
   *  white label, so the fill deepens instead in both themes. */
  successFill: palette.greenFill,
  successFillHover: palette.greenFillHover,
  caution: palette.twineInk,
  cautionHover: palette.twineInkHover,
  cautionFill: palette.twineInk,
  /**
   * Caution as a MARK — a ring stroke, a chart series, an icon: something you
   * look AT rather than read, and that carries no label of its own.
   *
   * It exists because `caution` and `cautionFill` are both sized for TEXT.
   * `twine` was darkened from #c19156 to #9a6e38 on 2026-08-25 precisely so it
   * could carry text at 4.51:1 — the right call for a word, and the reason the
   * profile-completion ring turned brown, because a 10px stroke inherited a
   * token tuned for 14px type.
   *
   * The obvious fix — putting the old #c19156 back for marks — does not work:
   * it is 2.82:1 on white, under the 3:1 WCAG asks of a graphical object. Amber
   * on white cannot be both bright and compliant at that chroma. So the
   * lightness comes down and the CHROMA goes up to buy the hue back: hsl(33
   * 75% 47%) = #d2811e, 3.05:1, which reads gold rather than brown.
   *
   * Dark needs no such trick — the ground is dark, so `twine` there (#d4a97a)
   * is already 7.53:1 and correctly amber.
   */
  cautionMark: palette.twineMark,
  cautionFillHover: palette.twineInkHover,

  /**
   * Filled rating stars. Light keeps the mulberry the review surfaces have
   * always used; on dark the pink read as a colored accent rather than a
   * rating, so the glyph goes near-white and lets the shape carry the
   * meaning. Empty stars are the same color at 0.3 opacity.
   */
  ratingStar: palette.mulberry,
  /**
   * A filled rating star on chrome — the score next to a name, a booking
   * row, the picker in the review modal. Gray in light (the `#4a4a4a` that
   * shipped as body text). White in dark: `textBody` carries the ramp's
   * violet tint there, and `theme.color.white` cannot be used because it
   * remaps to the surface.
   */
  ratingFill: palette.gray800,
  /**
   * The review-feed star. Mulberry in light (Figma node 17032:19921, distinct
   * from the chrome gray above). White in dark for the same reason — lifted
   * mulberry (`#dd7fae`) is what made every review row look pink.
   */
  ratingAccent: palette.mulberry,

  /**
   * A toast's status MARK (Figma "Design system · Notices", Toast · stays in
   * its panel, owner 2026-10-16: "neutral pill with a status icon"). Every
   * toast is the one `toastBg` slab; a 20px CircleCheck or CircleAlert in
   * these says which kind it is, and a plain notice has none. The solid blue
   * and red pills they replace were the only toasts among the 15 apps
   * benchmarked that filled the pill with the status.
   *
   * ONE VALUE IN BOTH THEMES, deliberately: the slab is dark in both, so both
   * take the dark theme's status lift. `danger` (#dd0000) is 2.9:1 on the
   * slab and fails WCAG 1.4.11; these clear 3:1 on either theme's `toastBg`.
   * darkTokens repeats them unchanged.
   */
  toastSuccessMark: palette.successLifted,
  toastErrorMark: palette.dangerLifted,

  // Inline status banners
  dangerSurface: palette.dangerTintFill,
  dangerSurfaceBorder: palette.dangerTintEdge,
  dangerSurfaceText: palette.dangerTintText,
  successSurface: palette.successTintFill,
  successSurfaceBorder: palette.successTintEdge,
  successSurfaceText: palette.successTintText,
  cautionSurface: palette.cautionTintFill,
  cautionSurfaceBorder: palette.cautionTintEdge,
  cautionSurfaceText: palette.cautionTintText,
  /**
   * A day nobody can book -- closed or past -- on the Calendar's tiles and
   * List rows: shown, not offered. Light is the page floor, gray under
   * white tiles. Dark is its own value (below), lifted off the floor
   * toward the pane: at the floor itself the closed weekends and past
   * days read as black holes in the grid (owner, 2026-10-09).
   */
  dayClosedSurface: palette.canvas,
  /**
   * A past day, which nobody can book or change: flat, and faded apart
   * from a closed day, which wears the open tile's edge and shadow (owner,
   * 2026-10-09). On light it is a step paler than the closed day's gray,
   * toward the white pane; on dark the closed day is a step deeper.
   */
  dayPastSurface: palette.grayFillLighter,
  /**
   * The Week's closed time (slice 37): every hour outside a day's hours,
   * a whisper under the white open hours, so the grid shows when clients
   * can book without its gray taking the page (owner, 2026-10-26: "leave
   * the free time a certain color ... and unavailable time another"). The
   * past day's step, not the Month's closed gray, which covered 60% of a
   * week. Dark: a step under the pane, like the past day.
   */
  weekClosedSurface: palette.grayFillLighter,
  /**
   * Its hover: the fill DARKER on light, LIGHTER on dark, the inverse of
   * light by the same step in L* (owner, 2026-10-13; see the dark block).
   * On light it is Airbnb's step
   * (owner, 2026-10-13: "we should do like Airbnb"; measured on its
   * multicalendar, a blocked day goes #ebebeb -> #dddddd, 14 units), which
   * supersedes the Oct 9 whisper ("needs to be a lot more subtle"), now that
   * an open day's hover is the closed day's own gray and the closed day
   * needs a step of its own past it.
   */
  dayClosedSurfaceHover: palette.grayClosedDayHover,
  /**
   * An OPEN day under the pointer. On light it is the closed day's own
   * gray (owner, 2026-10-13: "hover color should be same as blocked day
   * color"), as Airbnb's is: measured on its multicalendar, an open day's
   * hover (#ebebeb) IS its blocked day's fill, so the grid shows two fills
   * rather than a third near-identical gray. Dark lifts it by the same
   * step instead (below): a closed day sits below the pane there, and
   * sinking a raised tile to it would read as a hole opening under the
   * pointer.
   */
  dayOpenSurfaceHover: palette.canvas,
  /**
   * The ONE BUTTON on a caution banner (components/shared/CautionBanner):
   * off-white under ink in BOTH themes, Stripe's "Add information" on its
   * amber strip (owner call, Sep 23 2026). Its own role because neither
   * button surface does it: `primaryFill` is brand blue in light, and the
   * neutral `surfaceSunken` goes dark grey in dark, where it sank into the
   * amber panel. Light is the plain white plane; dark borrows the dark
   * primary's off-white, so it reads as the same strong control there.
   */
  cautionActionFill: palette.white,
  cautionActionFillHover: palette.coolGrayLight,
  textOnCautionAction: palette.ink,

  // Controls
  accentDisabled: palette.brandDisabledFill,

  /**
   * The flat ground behind the web sign-in pages, under the dotted map. A
   * step lighter than `canvas` in light: the map's land dots cover most of
   * the screen and pulled the page's tone down to grey on `canvas` (owner,
   * Oct 6 2026), and the lighter ground gives the dots more to read
   * against. Its own role, not a new `canvas`: every page standing a
   * `surfaceSunken` panel on `canvas` relies on the gap between the two (see
   * `cardBand`). Dark is the floor, as `canvas` is there.
   */
  authGround: palette.coolGrayLightest,
  // The sign-in card's footer band ("New to Need to Talk? Sign up"). Light
  // is the sunken fill it always had; dark is one step up from the card.
  authCardFoot: palette.neutral,
  // The card's rim and its top catch-light: dark-only, like `edgeOnDark`
  // (see the dark values for why they are quieter than it).
  authCardEdge: "transparent",
  authCardEdgeTop: "transparent",
  authCardFootEdge: "transparent",

  // The angled wash behind the auth pages (mobile only since Oct 1 2026)
  authBackdropFrom: palette.authWashTop,
  authBackdropMid: palette.authWashBand,
  authBackdropTo: palette.authWashBase,
};

// `danger`, `divider` and `canvas` intentionally exist in BOTH objects with
// identical values (a primitive that is also its own role). Everything that
// enumerates tokens must therefore work off the merged object so each name
// appears exactly once.
const allTokens = { ...palette, ...semantic };

// ---------------------------------------------------------------------------
// 2b. DARK VALUES
// ---------------------------------------------------------------------------
// The dark theme is these overrides on top of the light block — every name
// absent here keeps its light value, which is exactly how a heading once went
// missing (`inkSoft` is a TEXT color despite the name), so the parity test in
// apps/web/__tests__ asserts full coverage.
//
// Both primitives and roles are re-mapped. That is deliberate: the burn-down
// migrated call sites onto whichever name read most honestly at the time, so
// `white` and `surface` both have to darken for a card to darken.
//
// These values are tuned against the light theme by CONTRAST, not by mirroring
// hexes — the reasoning for each group is kept inline because it is the part
// that is expensive to rediscover.

/**
 * DARK HAS TWO GROUNDS, AND A RAIL BETWEEN THEM (three constants since 2026-09-17).
 *
 * Everything on a dark screen stands on one of exactly two planes, and every
 * token that paints a large area below resolves to one of these two constants
 * rather than to a hex of its own. That is the whole point of naming them:
 * they were separate hexes that happened to agree, which is not a system --
 * it is a coincidence waiting to drift. Change one here and every surface
 * that belongs to that plane moves with it.
 *
 *   FLOOR   what is OUTSIDE the containers: the page behind a layout of
 *           cards (the storefront, the profile, pricing), and html/body. It
 *           was pure black until 2026-09-17, when the owner retired black
 *           from the backgrounds: beside the lifted cards it read as a hole,
 *           not a ground ("you see how different the backgrounds are? maybe
 *           we shouldn't use black anymore"). It is now L* 4.5 at the brand
 *           hue -- the homepage's own ground, so the marketing pages and the
 *           page-behind-cards share one deep value -- and a card stands 3.6
 *           L* above it, which is Perplexity's page-to-card step (#171615 to
 *           #1e1d1c, 3.5). It is still the plane you take DOWN to create
 *           separation, never the one you lift; it just no longer goes to 0.
 *
 *   PLANE   the containers themselves, and the chrome that reads as part of
 *           them: cards, the navbar, the footer, the console's content
 *           column. 1.101:1 above the floor, which is where Linear's own
 *           cards sit against their page (#171717 on #0f0f0f, 1.069:1).
 *
 * A card does not get a third value for being on a busier page, and the rail
 * does not get its own black. If a surface needs to sit between these two,
 * that is `surfaceQuiet`/`surfaceRaised`, and it is a card ON a plane rather
 * than a plane of its own.
 *
 * LIGHT IS NOT YET SYMMETRIC WITH THIS. There the rail is #ffffff -- the
 * plane, not the floor -- while `canvas` is #ecedef. Making light obey the
 * same two-ground rule means the sidebar goes grey there, which is a visible
 * change to a theme currently being used as the reference, so it is
 * deliberately not folded in here.
 *
 * 2026-09-17: A THIRD CONSTANT, AND WHY IT IS NOT A THIRD GROUND. The rail
 * stopped being the floor. Measured that day in a signed-in browser, the chat
 * apps the owner named as the reference run their chrome a small step UNDER
 * their content, not at black: Claude's sidebar is #111111 (L* 5.1) under a
 * #151515 main pane (6.8); ChatGPT alone is black on black. Ours was a black
 * rail under a 4.5 L* page -- the same ORDER as everyone, but the deepest
 * console in the set, and the owner read the app as too dark. RAIL now holds
 * Claude's geometry, dL* 1.7 under PLANE. FLOOR keeps its job (the page
 * behind a layout of cards, where the step up to a card has to be a card's
 * worth, not a sidebar's) and later the same day left black for L* 4.5. The
 * rail and the floor never meet on one screen, so the two-ground rule above
 * still describes every screen; it just names the chrome's rung separately.
 */
const DARK_FLOOR = "#0d0f13";
const DARK_RAIL = "#111418";
const DARK_PLANE = "#15181d";

/**
 * DARK'S HAIRLINE, and the reason it is one value rather than three.
 *
 * `border`, `borderHairline` and `divider` had drifted into three different
 * answers to the same question -- where does one surface stop. By 2026-09-04
 * they were rgba(255,255,255,0.08), rgba(255,255,255,0.14) and #22272c, which
 * is not a ladder: `divider`, the token whose whole job is to be the QUIETEST
 * line in the system, measured 1.30:1 on a card where `border` measured 1.208,
 * so the quiet one was the loud one. Nobody chose that; it is what happens when
 * three tokens are tuned in three different sittings.
 *
 * Now there is one hairline and one step below it, and both are alphas so a
 * single value stays correct on the floor, on a card, and on any plane added
 * later -- a solid hex cannot, because its contrast against each is different
 * by construction. Change this and every chrome line in dark moves together:
 * the nav's underline, the rail's seam, a card's outline, a table rule.
 *
 * What deliberately does NOT resolve here: `borderCard` (#3b434a) and
 * `fieldBorder` (#414952). Those are CONTROL edges, not chrome -- the ring on
 * an icon button, the boundary that says "type here" -- and they are louder on
 * purpose, because a control has to be found rather than merely bounded.
 */
const DARK_HAIRLINE = "rgba(255, 255, 255, 0.08)";
const DARK_HAIRLINE_QUIET = "rgba(255, 255, 255, 0.05)";
// The profile navbar's line on dark: a solid at the ramp's hue, ~1.23:1 on
// DARK_PLANE -- Airbnb's own weight (#ebebeb on white is ~1.2:1). The 8%
// white `border` vanished there; the solid #31363c read too strong.
const DARK_NAV_LINE = "#262a30";
// The drag-select wash, named once like the hairlines above because the
// primitive and the role that points at it must not drift apart.
const DARK_SELECTION_WASH = "rgba(84, 133, 204, 0.35)";
// The empty-control edge. Named once for the same reason as the hairlines:
// the primitive and the role that points at it must not drift apart.
const DARK_CONTROL_BORDER = "#67707d";

const darkTokens = {
  // ── 2026-09-17 (third pass): THE FLOOR IS NO LONGER BLACK ─────────────
  //
  // With the cards lifted to Perplexity's lightness, the black page behind
  // them on the storefront read as a hole rather than a ground -- the owner
  // saw it beside Perplexity's single continuous tone and retired black from
  // the backgrounds. DARK_FLOOR is now #0d0f13 (L* 4.5, hue 258): the value
  // the homepage already stood on, so `homepageBg` simply IS the floor again
  // and one deep ground serves the marketing pages, the profile, the
  // storefront, pricing and html/body. A card (`surface`, L* 8.1) stands 3.6
  // L* above it -- Perplexity's own page-to-card step -- and the edge and
  // shadow carry the rest, as they were cut to. The rail (6.2) sits between
  // the two and never shares a screen with the floor. Nothing else moved.
  // The Claude-lightness ladder (plane 7.0) cannot take this floor: its card
  // step would fall to 2.5 L*, under the 3 L* the card-on-band rule pins.
  //
  // ── 2026-09-17 (second pass): ANOTHER 1.2 L*, TO PERPLEXITY'S LIGHTNESS ──
  //
  // Seen beside the Claude-matched lift below, the owner chose Perplexity's
  // dark as the reference for LIGHTNESS -- and then ruled on hue: "Need to
  // Talk needs a slight blue tinge, not totally grayscale; don't use
  // Perplexity's tinge", and "the blue tinge needs to be the same color as
  // the brand". So this pass moves every ground and card rung up another
  // 1.2 L* (page L* 8.4, rail 6.5; the console averages where Perplexity's
  // does, with the chrome still below the content) at the brand's hue, 258,
  // on the chroma ramp the lift already used. A warm build was made, looked
  // at, and archived (refs/archive/dark-ground-warm). Inks, borders, floor,
  // homepage: as in the lift note below. textMuted's 4.5:1 ceiling (L* 23.5)
  // still clears the palest rung.
  //
  // ── 2026-09-17: THE APP CAME UP 2.5 L*, AND THE RAIL LEFT THE FLOOR ───
  //
  // The owner's call, against a measurement: "the actual app should be more
  // like Claude, ChatGPT, Perplexity". Sampled the same day, signed in:
  //   Claude      sidebar #111111 (L* 5.1)   main #151515 (6.8)   composer #20201f
  //   Perplexity  chrome  #1e1d1c            page #171615 (7.3)
  //   ChatGPT     #000000 everywhere, elevated #212121
  //   ours        rail    #000000 (0.0)      page #0d1013 (4.5)
  // The page was already inside that set; the console was not, because a
  // black rail under a 4.5 page averaged half of Claude's screen luminance.
  //
  // What moved, and by how much:
  //   1. PLANE 4.5 -> 7.0 L* (#12161a), Claude's main pane. RAIL 0 -> 5.3
  //      (#0f1215), Claude's sidebar: dL* 1.7 under the plane, chrome still
  //      below content. FLOOR stayed #000000 in this pass (a card on the
  //      storefront stood 7 L* above its page); the third pass, above,
  //      lifted it to L* 4.5.
  //   2. EVERY RUNG ABOVE THE PLANE +2.5 L*, uniformly, so no relationship
  //      argued below changed: quiet, raised, sunken, hover, selected,
  //      onSunken, onBand and their hovers all kept their spacing.
  //   3. THE CEILING MOVED WITH THE INK. The 09-03 rule is "no fill lighter
  //      than where textMuted hits 4.5:1". At #8a939c that was L* 17.8 and the
  //      lifted top rungs would have breached it, so textMuted came up one
  //      rung to #98a1aa (ceiling L* 23.5; palest rung 21.9) and
  //      textPlaceholder took its old value. Grounds up, inks up; the 09-03
  //      answer was grounds down, and both keep the same floors.
  //   4. THE HOMEPAGE DID NOT MOVE. `homepageBg` keeps its L* 4.5 by value;
  //      the owner said it is right at Linear's darkness.
  //   5. THE HUE IS THE BRAND'S. Owner's rule the same day: "the blue tinge
  //      needs to be the same color as the Need to Talk brand" -- so every
  //      dark neutral (grounds, rungs, inks, borders, the tinted hairlines)
  //      sits at OKLCH hue 258, which is exactly where all five brand blues
  //      sit (#4A7EC9, #3b73c4, #89b1ec...). They had drifted between 242 and
  //      257 over successive sittings. Each token kept its own L* and chroma;
  //      only the hue moved, by one or two RGB units. Light's ramp stays at
  //      255 (see 04a): three degrees nobody can see, left alone. Values
  //      shared with light on purpose (footageGround) were not rotated.
  //
  // Any hex or ratio quoted in a comment below that predates this note is
  // stale by about 2.5 L* / one rung; the arguments stand. Light is untouched.
  //
  // ── 2026-09-03: THE DARK GROUNDS AND CARDS WERE DEEPENED ──────────────
  //
  // Every ground and card fill below moved down, and the borders moved UP.
  // The trigger was a measurement, not a preference: on the previous palest
  // card ground (`surfaceOnSunken`, #323b47) `textMuted` sat at 3.64:1 --
  // under the 4.5:1 body floor -- and `textDisabled` at 2.46:1, under 3:1.
  // The PAGE ground was never the problem; #1c2127 gave textPrimary 13.63
  // and textSecondary 6.60, both ahead of their light-theme twins. It was
  // the cards. Each one spent 2-4 points of contrast, and the palest spent
  // enough to put three ink roles under the floor on every card in the app.
  //
  // The derivation, so it can be repeated rather than guessed at:
  //   1. CEILING. No card fill may be lighter than #262c36, the value at
  //      which `textMuted` still clears 4.5:1. Everything below is inside it.
  //   2. ORDER PRESERVED. The rungs keep the sequence they had (quiet <
  //      raised < sunken < hover < onSunken < sunkenHover); only the spacing
  //      compresses, from 1.04 to 1.35 against the ground.
  //   3. FILLS DOWN, LINES UP. Because the fills now cluster near the
  //      ground, separating a card is the EDGE's job, not the fill's --
  //      which is why `borderCard` and `border` got lighter while every
  //      surface got darker. Reach for the line, not for a lighter plate.
  //
  // WHAT THIS MEANS FOR THE COMMENTS BELOW. The reasoning in them stands --
  // it is all about relationships, and every relationship was preserved --
  // but any RATIO OR HEX quoted inline was measured against the pre-deepening
  // values and is now stale as a number. Trust the argument, re-measure the
  // figure. Light is untouched.
  // 2026-09-17: the floor is L* 4.5 now, not black -- see the third-pass note
  // at the top of this block. The reasoning below about WHICH plane these
  // roles resolve to stands; "black" in it is stale as a value.
  //
  // The page itself is OUTSIDE the containers, so it is the floor. This is
  // what the profile and storefront stand on: nothing there paints a ground of
  // its own (the profile's wrapper is transparent by design, so the cards can
  // keep their rounded corners), which is why those pages were a single flat
  // field -- html was painting DARK_PLANE and the cards were painting
  // DARK_PLANE on top of it. The homepage is unaffected: every full-width
  // section there paints `homepageBg` itself, so html never shows through.
  bg: DARK_FLOOR,
  pageBg: DARK_FLOOR,
  // THE PAGE GROUND CARDS SIT ON, and on dark it goes to the floor.
  //
  // In light this token is a real step under `surface` -- #ecedef beneath a
  // #ffffff card -- which is what lets a page of cards read as cards. On dark
  // it had collapsed onto `surface`: `bg`, `pageBg`, `canvas`, `homepageBg`
  // and `surface` were ALL #0d1013, so a card was the same hex as the page
  // behind it and the only thing separating them was a line. That is why the
  // borders started reading as harsh -- they were carrying a job the fill had
  // stopped doing.
  //
  // Black rather than a lifted card, for the same reason as `surfaceRail`:
  // dropping the ground buys the separation without making the page brighter.
  // The resulting step is 1.101:1 under `surface`, which is where Linear's own
  // cards sit (#171717 on #0f0f0f, 1.069:1) -- and a pixel histogram of their
  // settings screen finds no border-coloured value at all, so that fill step
  // is the whole boundary there. Ours keeps its edge, and the edge can now be
  // quieter because it is no longer alone.
  //
  // `homepageBg` deliberately does NOT follow. The homepage's one-ground
  // treatment (commit b62b9d6a6) is settled and out of scope.
  canvas: DARK_FLOOR,
  // The band under the storefront card IS the floor on dark — the whole point
  // of 200d26e. Light is the half that differs (see the role's note); holding
  // it as its own name is what lets light keep its gray without pulling the
  // dark band back up above the card.
  cardBand: DARK_FLOOR,
  surface: DARK_PLANE,
  white: DARK_PLANE,
  offWhite: DARK_PLANE,
  // The rail sits BELOW the content column, never on it: the separation is
  // bought by keeping the chrome down, not by lifting the content. Until
  // 2026-09-17 that meant the floor itself (#000, 1.10:1 under the old plane,
  // Linear's geometry). It now holds Claude's: DARK_RAIL is dL* 1.7 under
  // DARK_PLANE, the step their sidebar takes under their main pane (#111111
  // under #151515), and the `divider` line on the sidebar's edge draws the
  // rest of the boundary. See the 2026-09-17 note at the top of this block.
  surfaceRail: DARK_RAIL,
  // Surfaces need a BIGGER step on dark than the mirror of light gives you --
  // the opposite of what lines need. A secondary button one notch off its card
  // is obvious on white and nearly invisible on #1c2127, so the sunken step and
  // its hover are both widened here.
  surfaceSunken: "#21252c",
  neutral: "#21252c",
  // The no-photo avatar (owner, 2026-10-16, "option C"). On `surfaceSunken`
  // the dark disc was 1.04:1 against a raised card (#1e2228), so it vanished
  // and the letter floated -- the Sessions cards on /for-providers. The plate
  // steps up to the card-edge value instead (1.33:1 on surfaceRaised, 1.48 on
  // surface, 1.28 on surfaceSunken), and the letter brightens to hold its
  // contrast on the lighter disc: 6.61:1 here, where `textSecondary` would
  // drop to 4.89. Light keeps its pair.
  avatarPlate: "#31373f",
  avatarInitial: "#b9c1cc",
  // The whisper band does NOT take the widened-step rule above: its whole job
  // is to sit just off `surface`, so it keeps the same ~2 L* it has in light
  // (#1c2127 L* 12.5 -> this at 14.4), lifted along the ramp's hue.
  // (`mediaBand` used to alias this and no longer does -- see it below.)
  surfaceQuiet: "#181c21",
  grayWhisper: "#181c21",
  // A card on chrome that is already `surface`. ΔL* 5.64 above it.
  //
  // Half of a pair — see `cardShadow`, which pools the halo below. Elevation
  // is the SPAN between the two (here 10.04), so never tune this one alone.
  //
  // SIZE IT IN L*, NOT IN CONTRAST RATIO — then look at it on a screen. WCAG
  // ratio is a legibility threshold, not a perceptual scale, and near black it
  // badly understates how small a step feels. L* is perceptually uniform but
  // calibrated for surface colors against a white reference, not near-black
  // emissive patches; down here discrimination falls off faster than its cube
  // root predicts. Both metrics err the SAME way, toward too subtle.
  //
  // Dark needs a bigger step than light for the same felt lift. Airbnb,
  // measured 2026-08-22, does this too — their own ramp:
  //   page -> card:    light ΔL* 2.77   dark ΔL* 4.70   (1.7x)
  //   card -> nested:  light ΔL* 1.74   dark ΔL* 2.48   (1.4x)
  //
  // CEILING: `surfaceHover` (#2e3742, L* 22.68) must stay readable ON this
  // card, and `surfaceSunken` (#272f38) must not collide with it. That caps
  // the fill near ΔL* 6 — at 4.70 the hover clears by 5.49, at 6.95 it is down
  // to 3.24 and the card has passed surfaceSunken. Another reason the halo is
  // not optional: the fill has nowhere left to go.
  //
  // HUE (owner, 2026-10-20: "does the sidebar look a little green?", of the
  // booking card on /to/): #1d2228 sat at OKLCH hue 253°, the one neutral
  // off the ramp's 256°-264°, so beside the page (#15181d, 261°) it read a
  // touch teal -- and a display's colour handling pushed the two further
  // apart (measured 243° against 275°). #1e2228 is the same lightness and
  // chroma at the page's hue: one unit of red. The roles below that share
  // this plate's value moved with it.
  surfaceRaised: "#1e2228",
  // Between the tile (surfaceRaised #1e2228) and its hover (#262b33): on
  // dark a lighter fill is the lift, so the preview steps UP, never down.
  pickPreview: "#21252c",
  pickPreviewEnd: "#262b33",
  surfaceHover: "#262b33",
  // Dark's button hover was never at issue: the same rung as a row's.
  controlHover: "#262b33",
  coolGrayLight: "#262b33",
  // Sized to LIGHT's plate step, not to the hover: light is ΔL* 5.25
  // (#ffffff L* 100 -> #eef0f4 L* 94.75) and this is ΔL* 5.9 above `surface`,
  // against `surfaceHover`'s ΔL* 9.4. Contrast agrees — 1.125:1 here against
  // light's 1.141:1, where the hover sits at 1.343:1.
  //
  // It lands between `surfaceRaised` and `surfaceSunken`, which is tight, and
  // is fine because the three never share a ground: raised is a card floating
  // over `surface`, sunken is a control inset INTO a card, and this is a row
  // plate on the sidebar's own `surface`. Nothing draws two of them adjacent.
  //
  // RE-DERIVED at the 2026-09-03 deepening (see the note at the top of this
  // block). The plate was first cut as #252c34 against the old #1c2127
  // ground, where it held ΔL* 5.17 / 1.148:1 -- on the deepened ground that
  // same hex is `surfaceSunkenHover`, ΔL* 13 and 1.35:1, i.e. the plate would
  // read as a hovered control, which is exactly what the console's decision
  // 14 ("dark was twice as loud") cut it down from. The argument stayed, the
  // number moved.
  //
  // RE-DERIVED AGAIN on 2026-09-04, when `surfaceRail` took the sidebar to
  // pure black. Every consumer of this token lives in that column, so their
  // ground moved out from under them: #181d22 held
  // ΔL* 5.93 on the old #0d1013 rail and ΔL* 10.47 on #000 -- twice the step
  // it was cut for, without the hex changing.
  //
  // WHAT IT IS SIZED TO, and the correction that got here. The first pass at
  // this re-derivation matched the LIGHT RAIL's plate as it then stood -- the
  // 7% accent tint, ΔL* 3.27 -- and it was visibly too faint, because that
  // tint was only ever carrying half the signal: light's current row also
  // turned BLUE, so plate and label split the work between them. Dark's label
  // is a neutral near-white and looks like every other label, so its plate
  // carries the whole thing alone and cannot be sized to light's share.
  //
  // The accent pair was retired on 2026-09-06 and light's rail now wears this
  // token's own light half (ΔL* 5.25), so the two themes are finally sized to
  // comparable steps -- but the number below did not move for it, because it
  // never was light's share. It is THIS token's own step, the one it was cut
  // and validated at before the ground moved: ΔL* 5.93. Held against black
  // that is #101317, ΔL* 5.76. Only the ground changed; the plate's weight is
  // restored, not re-argued.
  //
  // RE-HELD 2026-09-17 against DARK_RAIL (#0f1215, L* 5.3): #1a1e23, dL* 5.8.
  // Same step, third ground. It now sits above the content plane (7.0), which
  // is also how Claude's selected sidebar row relates to their main pane.
  surfaceSelected: "#1c1f25",
  // Hovering a sunken control goes UP in dark, same as it goes down in light.
  surfaceSunkenHover: "#2d333b",
  graySunkenHover: "#2d333b",
  grayClosedDayHover: "#14171d", // the dark closed day's hover (dayClosedSurfaceHover below)
  coolGrayLightest: "#272c34",
  textHeading: "#e8ecf1", // = textPrimary (the three-step ramp, 2026-10-16)
  gray900: "#f0f4f8",
  textPrimary: "#e8ecf1",
  ink: "#e8ecf1",
  textBody: "#e8ecf1", // = textPrimary (the three-step ramp, 2026-10-16)
  gray800: "#d6dbe3",
  // The branded page's Black is pure black in the theme it paints (semantic
  // storefrontBlack).
  storefrontBlack: "#000000",
  // = gray800, the body grey before the three-step ramp: 15.1:1 on pure black.
  storefrontBlackInk: "#d6dbe3",
  textSecondary: "#9da6b4",
  // The quiet mark needs no correction here -- dark is the theme whose
  // ratio light was measured against. Same value as textSecondary, and a
  // separate role so light can diverge without moving any text.
  markQuiet: "#9da6b4",
  graySlate: "#9da6b4",
  graySlateDeep: "#9da6b4",
  outlinedControl: "#b6bec9",
  outlinedControlHover: "#d6dbe3",
  // 2026-09-17: lifted one rung with the grounds (was #8a939c). The card
  // ladder's ceiling is where THIS ink hits 4.5:1; at #98a1aa that is L* 23.5,
  // which is what lets the lifted top rungs stand without breaching it.
  // 6.94:1 on `surface`, 4.73:1 on the palest rung (`surfaceOnBandHover`).
  // 2026-10-16: = textSecondary (the three-step ramp). In dark secondary
  // keeps ITS value, the lighter of the two, so every ratio above only
  // rises and the ladder's ceiling still holds.
  textMuted: "#9da6b4",
  gray600: "#9aa1ab",
  // The tab bar reads at 10px through 1.5px strokes; see `navInactive`.
  // 6.6:1 on `surface`, a rung above what `textMuted` gives it there.
  navInactive: "#9da6b4",
  // The selected tab, lifted instead of deepened — 5.9:1 on `surface`,
  // between the fill blue (4.32) and `accentText` (7.38). Same hue, sat
  // 62% (between fill 54 and text 72), L 66%. The first dark value
  // (#628fd0, 4.9:1) still read dim beside the new link blue.
  navSelected: "#739ede",
  danubeInk: "#739ede",
  // The bottom rung that is still TEXT — captions like a trait's "Work
  // location" line, chart tick labels, an input's placeholder. Sized against
  // `surface`, where the light pair sits at 4.87:1 on white; the first dark
  // value mirrored the light hex's darkness instead and landed at 4.04:1,
  // under AA for the 14px captions this role actually carries. Read as a step
  // off `textMuted` it had also overshot — ΔL* 7.33 below it where light is
  // 4.44 below, so the ramp pinched at exactly the rung with the least
  // headroom. This restores light's step (ΔL* 4.2) and clears AA at 4.50:1.
  // 2026-09-17: took textMuted's old value when the grounds lifted -- #7f8892
  // fell to 4.3:1 on the new `surface`. Now 5.83:1 there and 5.02:1 on
  // `surfaceSunken`, where inputs actually paint it; still dL* 5.3 under
  // textMuted, so a placeholder stays a step quieter than a caption.
  textPlaceholder: "#8c939d",
  gray500: "#8c939d",
  // Inactive text — a disabled control's label, a past date in a picker. It is
  // EXEMPT from AA (WCAG 1.4.3 excludes inactive components) and stays well
  // under it on purpose; the job is to read as unavailable, not as quiet.
  //
  // SIZED IN L*, NOT IN RATIO — the same rule `surfaceRaised` is sized by, and
  // for the same reason: near black the ratio understates how small a step
  // feels. The first dark value matched light on ratio (2.77 vs 2.85) and was
  // still visibly dimmer, because on L* it was 6.5 points shallower — ΔL* 30.24
  // above `surface` where light sits 36.74 below white. This restores light's
  // step (ΔL* 36.69, 3.51:1) and leaves the rung order intact: `textPlaceholder`
  // is ΔL* 43.79, so inactive still reads as inactive next to a caption.
  textDisabled: "#6f7580",
  gray400: "#6f7580",
  // MATCHED BY CONTRAST AGAINST THE LIGHTEST GROUND A LINE ACTUALLY LANDS ON,
  // which is `surfaceRaised` (#242b33), not `surface`.
  //
  // The first pass matched these against `surface` and they came back too
  // faint on screen — the booking cards, the provider/practice cards, the
  // section separators and every field edge. Two reasons, and they compound:
  //
  //   1. WRONG REFERENCE GROUND. In light, a card IS the lightest ground
  //      (white), so pinning a ratio to `surface` and pinning it to the card
  //      are the same act. In dark they are not: a card is `surfaceRaised`,
  //      a full ΔL* 4.70 above `surface`. A line tuned against `surface` loses
  //      that whole step once it is drawn on a card — `border` fell from its
  //      intended 1.36 to 1.20 there, and `divider` from 1.16 to 1.03, which
  //      is a separator that has stopped separating.
  //   2. NEAR BLACK, BOTH METRICS UNDERSTATE. The same caveat already written
  //      above `surfaceRaised` for fills applies to lines: contrast ratio is a
  //      legibility threshold and L* is calibrated against a white reference,
  //      and down here discrimination falls off faster than either predicts.
  //      Erring toward the larger step is the safer direction.
  //
  // So each role now hits its light-theme ratio against #242b33. On `surface`
  // and on the page these read one step stronger than their light twins, which
  // is the point — the earlier "lines read HARDER on dark" note had it exactly
  // backwards for hairlines this close to black.
  //
  // Ratios on #242b33 / #1c2127, against the light value on white:
  //   divider     1.17 / 1.32   (light #cdd4dc on white: 1.50 since
  //               2026-10-29; dark kept at its quiet hairline, owner)
  //   borderMuted 1.24 / 1.41   (light #e5e7eb: 1.24)
  //   border      1.36 / 1.54   (light #cdd4dc: 1.50)
  //   fieldBorder 1.57 / 1.77   (light #8a929c: 3.15 since 2026-10-29)
  //   borderHover 1.91 / 2.17   (light #b4bcc7: 1.92)
  // THE GENERAL-PURPOSE EDGE, and on dark it is an ALPHA, not a hex.
  //
  // Re-cut 2026-09-04, after `canvas` gave cards a real fill step for the
  // first time on dark. The solid #30363b was sized for a card that was the
  // SAME hex as its page -- with no fill step, the line was the entire
  // boundary and had to shout to be one. It measured 1.56:1 against the card
  // and 1.716:1 against the page, and it read as harsh because it was doing
  // two jobs. Now the fill carries separation (1.101:1, where Linear's cards
  // sit) and the line only has to define, so it comes down to 1.208:1 on the
  // card and 1.14:1 on the ground.
  //
  // ALPHA rather than a hex is the actual fix, and it is what the references
  // use: GitHub's dark edge is #ffffff26, Linear's is rgba(255,255,255,0.03).
  // One border token now lands on two different planes -- a card at #0d1013
  // and the page at #000000 -- and a solid hex cannot be correct on both at
  // once, because its contrast against each is different by construction. An
  // alpha composites, so the SAME token holds the same apparent weight on
  // whatever it is drawn over, including planes added later.
  //
  // NOT ZERO. Dropping every border to transparent is one token away and is
  // tempting -- Linear genuinely has no border-coloured value anywhere in a
  // histogram of their settings screen. But this token has 190 call sites and
  // they are not all cards: it is also table rules, chip edges and section
  // divisions, where there is no fill step underneath to take over. Inputs are
  // safe either way -- they carry `fieldBorder` (#414952), brighter on purpose,
  // because an input's boundary is what says "type here".
  border: DARK_HAIRLINE,
  navLine: DARK_NAV_LINE,
  grayNavLine: DARK_NAV_LINE,
  grayBorder: "#31363c",
  // Sits between `border` and `borderHover` on the same ramp, as it does in
  // light. Every field edge takes this role, so the inputs, selects and text
  // areas move together rather than one at a time.
  // 2026-09-17: softened from #424852, which measured 1.93:1 on the lifted
  // plane, to 1.65:1 -- Perplexity's search-box weight (Claude's composer
  // ring is 1.35). Still a clear step above the chrome hairline (1.24), and
  // the sunken fill and placeholder carry the rest of "type here". It was
  // already under WCAG 1.4.11's 3:1 for a boundary that is a control's only
  // indicator; here the fill and the label are indicators too.
  fieldBorder: "#383e47",
  grayFieldBorder: "#383e47",
  grayFieldEdge: "#383e47",
  grayHairline: "#31363c",
  // Dark keeps its field edge (softened 2026-09-17), so hover stays where it was.
  fieldBorderHover: "#49525d",
  borderHover: "#49525d",
  // The empty-control edge, lifted off the dark card to the same 3:1 footing
  // it has in light (3.55:1 here). It does NOT follow the hairline ladder --
  // see the light block for why an empty control owes more than a hairline.
  controlBorder: DARK_CONTROL_BORDER,
  grayControlBorder: DARK_CONTROL_BORDER,
  grayBorderHover: "#49525d",
  borderMuted: "#292d35",
  neutralBorder: "#292d35",
  // RE-CUT 2026-09-04, because the deepening moved every rung on this ramp
  // except this one. At #2f363d it measured L* 22.230 against `border`'s
  // 22.240 -- 0.010 apart, and 1.4319:1 vs 1.4323:1 on a `surfaceRaised`
  // card, so the faintest line in the system and the strongest were the same
  // line. It also sat ABOVE `borderMuted` (L* 18.724), inverting the order
  // the table above states.
  // #22272c is L* 15.345: 1.164:1 on `surfaceRaised` against the 1.17 the
  // table specifies, 1.267:1 on `surface`, and back below `borderMuted` where
  // the ramp says it belongs.
  divider: DARK_HAIRLINE_QUIET,
  coolGrayBorder: "#31363c",
  grayFill: "#2b313b",
  grayFillDark: "#3a424c",
  grayFillLight: "#242932",
  grayFillLighter: "#20262d",
  // A pale track (a usage bar's inside) sits ABOVE the surface on dark rather
  // than sinking into it, so it still reads as a control.
  // Disabled sits BELOW the surface in both themes, so on dark it goes
  // darker than the card, not lighter.
  surfaceDisabled: "#181c23",
  grayDisabledFill: "#181c23",
  surfaceDisabledStrong: "#141920",
  grayDisabledFillStrong: "#141920",
  grayToggleTrack: "#3a424c",
  controlTrack: "#3a424c",
  switchTrack: DARK_CONTROL_BORDER,
  // Explicit: `palette.white` is re-mapped to the plane on dark, and the
  // knob stays white in both themes.
  switchKnob: "#ffffff",
  // A neutral filled button, sized against the CARD it sits on rather than
  // the page: 3.19:1 on `surface`, the same step the light pair has against
  // white. It climbs above the card here where in light it sinks below it —
  // a filled control has to stay a control in both directions.
  grayControlFill: "#686f78",
  controlNeutral: "#686f78",
  // Hover deepens like every other filled control under a white label — the
  // earlier lift to #777e87 dropped the label to 4.10:1 mid-hover.
  grayControlFillHover: "#5f666f",
  controlNeutralHover: "#5f666f",
  // A raised control climbs ABOVE the bar it stands on, and on dark that bar
  // is `surfaceSunken` (#272f38) — lighter than `surface`, not darker. Set by
  // contrast rather than by mirroring the hex: white-on-#eceff3 is 1.17:1 and
  // #2f3944-on-#272f38 is 1.17:1, so the pill sits the same distance off its
  // bar in both themes instead of looking pasted on in one of them.
  controlRaised: "#303944",
  controlRaisedShade: "#2e3642",
  // A disc on `cardBand`, which on dark is the `#000` floor. These are
  // `surfaceSunken` and `surfaceSunkenHover` exactly — the fills d29986f put
  // on these two buttons and the reason they read here at all (ΔL* 11.37 off
  // the floor, against 4.5 for `surface`). Held as their own names so the
  // LIGHT side, where the same borrow collapses, can differ from them.
  controlOnCardBand: "#1a1e25",
  controlOnCardBandHover: "#262b34",
  // A disc on the RAIL, which on dark is `surfaceRail` (#111418) — a darker
  // plane than the content column's `surface` (#15181d). Borrowing the
  // navbar's own `surfaceSunken` therefore does NOT reproduce the navbar's
  // appearance: measured live, the identical #21252c reads ΔL* 8.37 here
  // against 6.42 there, ~30% louder, and the owner saw it as such
  // (2026-09-22) — a rail exit should be as quiet against the rail as those
  // discs are against the page.
  //
  // #1e2228 lands ΔL* 6.95, which is the navbar's relationship on this plane.
  // It coincides with `surfaceRaised`'s value and is held separately anyway:
  // that token answers to cards, and on LIGHT it is `#ffffff`, i.e. invisible
  // on a white rail — the exact bug this role exists to prevent.
  //
  // The hover keeps the house step for a control on an alternate plane: the
  // pair above travels +6.27 rest→hover and the navbar +6.41, so this takes
  // +6.53 along the same ramp.
  controlOnRail: "#1e2228",
  controlOnRailHover: "#293038",
  // A disc on `surfaceRaised` (#1e2228, L* 13.07). Sized to the navbar's
  // relationship, #21252c on `surface`: ΔL* 6.42 at rest, +6.41 on hover.
  // #2a3038 lands +6.53 off the card and #373e48 +6.34 off that. The same hex
  // as `surfaceOnSunken`, held separately because that one answers to a card
  // on a sunken band.
  controlQuiet: "#1e2228",
  controlOnRaised: "#2a3038",
  controlOnRaisedHover: "#373e48",
  // Claude's Yours | Discover, sampled 2026-10-13: track +6.5 L* over its
  // ground, plate +9.8 over the track, a +9 edge on the plate. On the raised
  // card's track (#2a3038, L* 19.6) this plate is +9.1 and the edge +8.6;
  // on the page's track (#21252c) the plate is +14. The edge is LIGHTER than
  // the plate, as Claude's is -- `borderCard` (#31373f) is darker than it and
  // would draw a dark ring round the chosen side.
  segmentPlate: "#3d4450",
  segmentPlateEdge: "#4c5461",
  // On the floating dock the track is #343a42 (L* 24.2), which the plate
  // above cleared by only +4.5 (owner, 2026-10-13: "will this toggle get
  // fixed also?"). This keeps the house step there: plate +10.4, edge +7.4.
  segmentPlateOnFloating: "#4a525e",
  segmentPlateEdgeOnFloating: "#5b6471",
  // The floating plane: ΔL* 4.68 over the cards it floats across (#1e2228),
  // the step Linear and GitHub take between planes on dark (~4), and inside
  // the ceiling above (surfaceSunken and surfaceHover stay distinct from it).
  // Its control keeps the house disc step: +6.42 at rest, +6.4 on hover.
  surfaceFloating: "#262c34",
  controlOnFloating: "#343a42",
  controlOnFloatingHover: "#404751",
  // controlOnFloating's rung: `surfaceHover` (#262b33) is the plane itself.
  surfaceFloatingHover: "#343a42",
  // On the floor (#0d0f13, L* 4.5): +8.5, the plane's own hover relationship
  // (#262b33 on #15181d, +9.1) carried down a plane.
  controlOnCanvasHover: "#1e2228",
  // Filled, on the floor: rest at the bare control's hover (+8.5), hover at
  // surfaceHover's value (+12.6) -- the plane's own rung, carried down one.
  controlOnCanvas: "#1e2228",
  controlOnCanvasFillHover: "#262b33",
  // 2.85:1 against `surface`, matching what #929aa4 has against white. It
  // reads close to `textDisabled` in isolation, exactly as the light value
  // does against `gray400` — an outline is not text, and what keeps the
  // button from reading disabled is the weight of its LABEL, which is
  // `textBody` in both themes.
  //
  // 2026-09-17: #5e6776 measured 3.12:1 on the lifted plane and was the
  // loudest line in the app -- neither Claude nor Perplexity draws any line
  // above 1.65, and GitHub's dark secondary-button border is 1.92. Now 2.0:1,
  // GitHub's weight; the label carries the button, as the note above says.
  // This puts the outline under WCAG 1.4.11's 3:1 for a boundary-only
  // control; the owner's call (Sep 17), on the same reasoning as the filled
  // marks: hierarchy over the ratio.
  controlOutline: "#434a56",
  // The brand blue is lifted only slightly on dark. The first draft raised it
  // too far, which on a dark ground read as a brighter blue than the brand
  // rather than the same blue: the large filled surfaces are what give it
  // away. (The availability chips and the primary CTA, which first showed
  // it, have since moved to `accentFill` below.)
  accent: "#5485cc",
  danube: "#5485cc",
  // Blue TEXT lifts well past the fill blue — see the role's note. 7.38:1 on
  // `surface`, 8.12:1 on `bg`, against the fill blue's 4.32:1.
  //
  // Lightness alone did not get there. Held at the fill blue's saturation the
  // value that reads bright enough beside `textPrimary` (13.63:1) is pale
  // enough to lose its hue — at hsl(215.5 54% 74%) it is a blue-gray, not the
  // brand. So saturation climbs WITH lightness, 54% -> 72% at L 73%, which is
  // the usual dark-mode move: a light ground washes chroma out of a color, and
  // the color has to put it back to stay recognizable.
  accentText: "#89b1ec",
  // The mist blue's dark analogue: same hue and saturation, held at the DARK
  // ladder's step-2 lightness (L* 36.1, matching `borderHover` there) so the
  // primitive keeps its meaning -- "the brand blue at the ladder's own value"
  // -- in both themes. Nothing consumes it on dark today, because the one role
  // that uses it drops its hue there; it exists so the primitive is coherent
  // rather than light-only.
  danubeMist: "#2b5591",
  // ...and the illustration subject goes the other way and drops its hue
  // entirely. The ink ladder already separates cleanly on dark, so the figure
  // needs no help there; a light blue edge on a near-black card only reads as
  // neon. Same value as `textDisabled`, which is what the rung held before the
  // accent existed.
  illustrationSubject: "#6f7580",
  // ...and the fill blue under a white label goes the OTHER way, down to
  // hsl(215.5 54% 50%) — same hue and saturation as `accent`, four points
  // darker. That is what takes a 13px white label from 3.75:1 to 4.73:1.
  // The button still separates from `surface` at 3.42:1; on the hero pill it
  // is 2.70:1, which the role's note explains is unavoidable and why the
  // label is the threshold that was chosen.
  accentFill: "#3b73c4",
  // The strong button on dark is off-white with a blue cast (`textHeading`),
  // hovering one step down, under ink. 15.6:1 label contrast; separates from
  // `surface` by the whole range. See the role's note in the light block.
  // Not the near-white of `textHeading`: that was "too harsh" on the first
  // pass (owner, Sep 18 2026). Perplexity's dark primary measures #d7d5d3,
  // L* 85, and this is the same lightness in the app's cool cast — it is
  // `textBody`. Hover one step down. Disabled is the button's ordinary 50%
  // opacity; Perplexity's grey disabled fill measures as exactly that.
  primaryFill: "#d6dbe3",
  primaryFillHover: "#c9d0da",
  textOnPrimary: "#1d262d",
  // The light-side fill primitives take the dark fill pair's values, so a
  // legacy call site reading the primitive and a role call site resolve the
  // same in dark.
  danubeFill: "#3b73c4",
  danubeFillHover: "#396fbe",
  // ...and a text-only CONTROL stops being blue here entirely — see the
  // role's note. This is `textPrimary`, so an FAQ question reads the same
  // white as the answer that opens under it, with size and weight carrying
  // the hierarchy instead of color. 13.63:1 on `surface`.
  textInteractive: "#e8ecf1",
  // Hover of a filled blue control with a white label. Light's `hoverBlue` is
  // 1.57 L points darker than `danube`; dark used to invert that and lift,
  // which dropped white from 4.73:1 to 3.33:1 on the fill button and read as
  // a flash. Same hue and saturation as the rest they hover, same 1.57-point
  // deepen as light, so the hover is a press, not a lighten.
  //   accent / danube  #5485cc  →  #4e81ca
  //   accentFill       #3b73c4  →  #396fbe
  accentHover: "#4e81ca",
  hoverBlue: "#4e81ca",
  accentFillHover: "#396fbe",
  accentStrong: "#6e9ad8",
  darkblue: "#6e9ad8",
  // On dark, the large brand fills stand down to surfaces — this one to
  // `surfaceSunken`, the hero to `surface`. Deepening the brand blue enough
  // to be quiet on a dark page took it to a slate that no longer read as the
  // brand, and lifting it enough to read as the brand made a full-width band
  // the loudest thing on the screen; there is no value between. The brand
  // blue stays the LIGHT bands, where it works, and on dark the color lives
  // in the accents and the photograph instead.
  brandBand: "#1a1e25",
  // On dark the hero band is not a band at all — the fold is `homepageBg`, the
  // same field every section below it stands on, so the photograph beside it
  // is the only thing carrying color above the fold. This value survives for
  // light, where the hero is a pale tint under ink display text rather than a
  // fill; on dark it is superseded at the call site (HeroSection's panel takes
  // `sectionGround`, like every other section). The old #1c2127 spelling is
  // kept rather than deleted so the role still resolves for any consumer that
  // reads it directly.
  heroBand: "#0d0f13",
  cornflower: "#0d0f13",
  // One step brighter than `border` and one below `borderHover` (1.90:1 on
  // `surface`, against 1.56 and 2.40). At the plain border value a card on a
  // dark page barely has an edge; at the hover value the edge is louder than
  // the card. Every card on a page shares this one, so they cannot disagree.
  //
  // 2026-09-17: softened from #3d424b, which measured 1.90:1 on the homepage
  // ground and 1.59 on the card fill -- the loudest quiet line left after the
  // field and outline cuts, and the owner called it too harsh. The argument
  // above was made when cards sat on black; on the L* 4.5 floor a card fill
  // already stands 3.6 L* above its ground, so the edge has less to carry.
  // Now 1.60:1 on the floor, 1.33 on the fill, 1.49 on `surface` -- the
  // register of Perplexity's search box and Claude's composer ring. Ramp on
  // `surface`: border 1.24 < borderCard 1.49 < fieldBorder 1.65 <
  // controlOutline 2.0 < borderHover 2.24. Card edges now sit UNDER field
  // edges, which is the hairline note's own logic: a control is louder than
  // a boundary because it has to be found, not merely bounded.
  borderCard: "#31373f",
  // The same two steps as light, measured on the dark booking card
  // (surfaceRaised): 2.01:1 at rest, 3.14:1 under the pointer (owner,
  // 2026-10-29: "Dark mode times look weak also"; the card edge they wore
  // was 1.33:1 there).
  pickEdge: "#49525d",
  pickEdgeHover: "#666f7b",
  // Chrome marks sit on a CARD, not on the page. The role was cut when that
  // card was `surfaceOnSunken`, where `borderCard` measured only 1.48:1 and a
  // dot that reads fine in light disappeared on dark; this bought back the
  // separation `borderCard` gets against `surface`, so the marks carried the
  // same weight in both themes.
  //
  // The marks have since moved ground. The homepage's replicas came down to
  // `surfaceRaised` on 2026-09-04 (see cardGround in
  // apps/web/components/homepage-v2/ground.ts) so the dots, the phone notch
  // and the exhibit's dot now sit on the app's own card fill, where
  // `borderCard` would clear 1.74:1 and this lands 2.77:1. The emergency the
  // role was cut for is over; the role is not, because these are filled shapes
  // a few pixels across rather than lines, and a line value tuned for an edge
  // is not a shape value.
  //
  // The two have not measured equal since the 2026-09-03 deepening, and the
  // direction is worth knowing: the pairing was cut when both sat near 1.75:1,
  // and the mark now runs AHEAD of the card edge (2.77:1 against
  // `borderCard`'s 1.90:1 on `surface`) rather than level with it. Ahead is
  // the safe side — it was the disappearing dot that started this — so the
  // value stands; if a future pass closes the gap, close it by measuring a dot
  // on a screen, not by matching the digits. Light does not move; it is still
  // the card edge.
  //
  // Saturation is 25%, set by eye between two rejected ends. At the border
  // family's 20-23% the mark is less chromatic than the blue-gray card behind
  // it and reads warm by contrast — faintly brown, even though its own hue is
  // already 212deg. At the surfaces' own 30% it stops reading as gray at all
  // and turns visibly blue. 25% is the point where it is neutral against the
  // card without becoming a color.
  chromeMark: "#566070",
  // The search pill on the hero band. At `surface` it read as a hole punched
  // through the band rather than a control lying on it, so it lifts two steps
  // — past `surfaceRaised`, past `surfaceSunken` — and keeps the 1.268:1 it
  // held off the band before the grounds were deepened, which is what gives
  // the pill its edge. Re-derived against the new band rather than shifted:
  // ratio is not linear in L* down here. `textPrimary` on it is 12.66:1.
  surfaceOnBand: "#292e36",
  // Next step up the ramp — the same hex as `surfaceSunkenHover`. Light's
  // hover is `surfaceHover` because the pill is white; here the pill is
  // already sitting at that altitude, so the hover reuses the sunken-hover
  // rung rather than a white overlay (which is what turned it warm).
  // No longer an alias of `surfaceSunkenHover`: with the pill re-derived
  // upward, the shared value fell below it and the hover would have pressed
  // instead of lifting. Its own step now, 1.13x the pill.
  surfaceOnBandHover: "#303640",
  // A card on a sunken band, lifted back above the band it lies on — see the
  // role's note for why `surface` put it underneath. dL* 5.5 over
  // `surfaceSunken`, which is light's card-over-section step (5.67) almost
  // exactly. It deliberately stops short of `surfaceSunkenHover` (#36404c):
  // a resting card must not be brighter than a hovered one.
  surfaceOnSunken: "#2a3038",
  // `textMuted` (#8a939c) is set against `surface`, and on the lifted pill it
  // drops to 4.10:1 — a placeholder is quiet, not illegible. This takes it
  // back to 5.88:1, the same register muted text holds everywhere else.
  textOnBandMuted: "#a9b0bb",
  // The plan cards: `surfaceRaised`'s value, the plate a card is on this
  // plane.
  planCard: "#1e2228",
  accentEdge: "rgba(84, 133, 204, 0.5)",
  // Dark's plan edge stays at `accentEdge` (planFeaturedEdge below): the
  // wash carries the mark there, so the strong edge has no dark job.
  accentEdgeStrong: "rgba(84, 133, 204, 0.5)",
  planFeaturedEdge: "rgba(84, 133, 204, 0.5)",
  planFeaturedWash: "rgba(84, 133, 204, 0.18)",
  // Neutral in dark: `textBody` and `textSecondary`, as every other line.
  planFeaturedLineText: "#d6dbe3",
  planFeaturedLineIcon: "#9da6b4",
  // A rung and a half above the #21252c track, so a chosen option reads as a
  // chip, not a light. It was one rung (#2d333b, `surfaceSunkenHover`), which
  // the owner found too faint to pick out (2026-09-30: "lighten a little").
  segmentSelected: "#353c46",
  // The homepage's plan cards stand down to ordinary plates here — see the
  // role's note. Every value below is the one the rest of the page already
  // resolves to, so a plan card and a feature tile are the same object:
  //   planBrand             = surfaceOnSunken, the card-on-a-band value, not
  //                           `surface`: these cards lie on a sunken band
  //   textOnPlanBrand       = textHeading
  //   textOnPlanBrandMuted  = textSecondary
  //   textOnPlanBrandAction = surface, i.e. the page value the pill reads
  //                           against at 15.4:1
  planBrand: "#222830",
  textOnPlanBrand: "#f0f4f8",
  // `textSecondary` (#9aa7b3) is set against `surface`, and the card is no
  // longer `surface` — on the lifted value it falls to 4.62:1, which clears
  // AA for 13px by four hundredths. This is the same correction, and the same
  // value, that `textOnBandMuted` makes for muted text on the lifted pill.
  textOnPlanBrandMuted: "#a9b0bb",
  planBrandAction: "#f9f9f9",
  textOnPlanBrandAction: "#1c2127",
  // The article tile lifts rather than deepens — see the role's note. The
  // dark plate takes the brand saturation at its own lightness, the same
  // re-derivation the light primitive got: #4e6f9f hsl(215.6 34% 46.5%) ->
  // hsl(215.4 54% 46.5%). 3.59:1 against `surface` clears the 3:1 floor for
  // a graphical object (the 3.16:1 this note used to quote was measured
  // against the #1c2127 dark card, before dark went to one ground); the wave
  // stays `accentStrong` on dark, one step above it.
  articlePlate: "#376bb7",
  // Unused in dark: the `wellTint` override names its own navy. Kept equal
  // to it so the primitive does not lie if something reads it directly.
  wellPlate: "#14305a",
  articleTilePlate: "#376bb7",
  articleTileWave: "#6e9ad8",
  // The hero photograph is graded for a light page; in dark a veil brings
  // its exposure down toward the rest of the screen.
  heroPhotoGrade: "rgba(6, 10, 16, 0.3)",
  // NEUTRAL in dark, not blue (owner, 2026-10-23): the ramp's own cool
  // white, the hue `hoverOverlay` uses, as Linear lights its window. On the
  // near-black ground blue read as a coloured pool beside the window's blue
  // Book; this reads as light, and the restraint belongs to dark (light
  // mode carries the colour). Half light's strength: a little goes a long
  // way here.
  heroGlow: "rgba(175, 197, 230, 0.16)",
  heroGlowSpread: "rgba(175, 197, 230, 0.05)",
  // Cool wash, not white. rgb(174, 198, 230) is hue ~254° — the ramp's own
  // temperature — so a 12% overlay on `surface` / `surfaceOnBand` lifts
  // chroma instead of bleaching it toward a warm gray.
  hoverOverlay: "rgba(175, 197, 230, 0.12)",
  borderHairline: DARK_HAIRLINE,
  // The rails keep the light block's rule -- a wash at the ramp's hue, never
  // neutral alpha -- and borrow `hoverOverlay`'s base for the same reason it
  // is not white: white over these cool grays desaturates, and a desaturated
  // hairline on a chromatic ground is exactly the painted-on look the rail
  // must not have. (Stripe's own dark rail does the same: #182659 on #0d1738,
  // a lift along the navy, not toward white.) The split survives inversion:
  // `surfaceSunken` is LIGHTER than `surface` on dark, so the sunken rail
  // needs more of itself, not less, to hold the same ~5 L* step.
  gridRail: "rgba(175, 197, 230, 0.06)",
  // Sized against Linear, which is the reference for this treatment: their
  // header cut is rgba(255,255,255,0.08) on a #08090a page, landing at
  // 1.180:1. Ours resolves to 1.218:1 on `surface` -- the same line, at the
  // same weight, one notch up because our ground is not as deep as theirs.
  // The HUE is ours, not theirs. Linear can use neutral white because #08090a
  // is effectively achromatic; over our cool grays white desaturates, which
  // is the painted-on look the rail comment below spends a paragraph
  // avoiding. Same luminance, ramp hue -- the difference is not visible, and
  // the rule stays intact. The navbar cut had been the RAIL value (1.103:1),
  // which is calibrated to be found rather than read, and vanished under a
  // dark bar.
  gridCut: "rgba(175, 197, 230, 0.11)",
  // Was 0.08 -- the extra alpha paid for `surfaceSunken` being LIGHTER than
  // `surface` on dark, so a sunken band needed more rail to hold the same
  // step. The homepage has no sunken band on dark any more (`homepageBg` is
  // the only ground), so the two rails now cross the same field and any split
  // between them would render as rails of two different weights on one page.
  // The role stays named: the grounds part ways again in light.
  gridRailOnSunken: "rgba(175, 197, 230, 0.06)",
  // On dark, `brandBand` stands down to the same plate as `surfaceSunken`
  // (see its comment above), so the band rail is the sunken rail.
  gridRailOnBand: "rgba(175, 197, 230, 0.08)",
  // On dark `heroBand` IS `surface` -- the same #1c2127 -- so the hero rail is
  // the plain rail. It is still its own name because the two grounds part ways
  // in light, where the hero goes saturated blue and surface stays white.
  gridRailOnHero: "rgba(175, 197, 230, 0.06)",
  edgeOnDark: "rgba(255, 255, 255, 0.14)",
  // Frosted sticky bars: a surface, so it darkens with the theme rather than
  // staying a white slab over dark content.
  // 2026-09-17: re-based on the lifted DARK_PLANE (#12161a); these are that
  // plane with alpha and must move with it, or a frosted bar reads as the old,
  // deeper ground hovering over the new one.
  // 2026-09-30: owner call -- on dark the bars are near-opaque, not glass. At
  // 0.85 the page read through the bar (text ghosting behind "Consultation");
  // the blur stays declared but has almost nothing left to show.
  surfaceFrosted: "rgba(21, 24, 29, 0.96)",
  surfaceFrostedStrong: "rgba(21, 24, 29, 0.98)",
  // Day-tile "not available" state. THE FILL SINKS, as the Calendar's closed
  // day does (owner, 2026-10-11: "should the date row unavailable days be
  // blacked out like the ones on the scheduler?"). It was a 6% WHITE alpha,
  // which lifted a dead day above the pane -- the same direction as an open
  // tile -- so "No openings" read as a raised, bookable card that was merely
  // dim. A black alpha a 6% one would vanish, but at 28% it lands on the
  // Calendar's dayClosedSurface over the pane (#0f1115 vs #0f1216) and stays
  // the same step down on a raised search card. The text keeps its white
  // alpha: on the sunken ground it needs light to stay legible.
  unavailableFill: "rgba(0, 0, 0, 0.28)",
  unavailableText: "rgba(255, 255, 255, 0.35)",
  scrollbarThumb: "#4c545f",
  grayScrollThumb: "#4c545f",
  scrollbarThumbHover: "#5c646f",
  grayScrollThumbHover: "#5c646f",
  // Sampled from a dark-scheme Google map, not derived from our ramp — its
  // only job is to be indistinguishable from the tiles that land on top of it.
  mapLand: "#16263d",
  mapCanvas: "#16263d",
  surfaceInverse: "#e8ecf1",
  gray850: "#e8ecf1",
  // Stays light on dark on purpose: a brand mark is drawn for a light ground.
  brandPlate: "#d7d5d3",
  textOnInverse: "#20252e",
  // Lifted from #e5484d in the Aug 2026 contrast pass: as TEXT that value
  // sat at 3.65:1 on `surfaceRaised` — under AA on exactly the ground error
  // captions land on. This clears every ground a caption sits on (4.83 on
  // the raised card, 5.77 on `surface`, 4.83 on `surfaceSunken`), and the
  // lift is safe because every filled destructive control reads
  // `dangerFill`, never this.
  danger: "#f0747a",
  dangerHover: "#f58f93",
  hoverDanger: "#f58f93",
  // Filled destructive controls deepen on hover so their white label never
  // loses contrast. The signal red above may lift because it is used as a
  // glyph/text color; a filled button has the opposite constraint.
  dangerFill: "#b43c42",
  dangerFillHover: "#a33338",
  dangerBorder: "rgba(229, 72, 77, 0.35)",
  success: "#6fbf77",
  green: "#6fbf77",
  successHover: "#7fcb87",
  hoverGreen: "#7fcb87",
  // The success fills mirror `dangerFill`: deepened past the signal green so
  // the white label holds (5.39:1, hover 6.08:1), where the lifted signal
  // value gives it 2.24:1.
  successFill: "#3a7743",
  greenFill: "#3a7743",
  successFillHover: "#356e3e",
  greenFillHover: "#356e3e",
  // The Ink pair lifts with the signal green: on dark it carries text/glyphs,
  // never a white label.
  greenInk: "#6fbf77",
  greenInkHover: "#7fcb87",
  caution: "#d4a97a",
  twineInk: "#d4a97a",
  cautionHover: "#d6ad80",
  twineInkHover: "#d6ad80",
  cautionFill: "#9a6932",
  // See the light half. On a dark ground the bright tan IS the legible one, so
  // the mark role and the text role coincide here — spelled out rather than
  // aliased so the divergence in light reads as deliberate.
  cautionMark: "#d4a97a",
  cautionFillHover: "#946430",
  // Status banners invert: on light the ground is a pale tint of the signal
  // color and the text is the deep version; on dark the ground is the deep
  // one and the text lightens, or the banner would glow.
  dangerTintFill: "#2a1a1c",
  dangerSurface: "#2a1a1c",
  dangerTintEdge: "#5a2b30",
  dangerSurfaceBorder: "#5a2b30",
  dangerTintText: "#ef6a6e",
  dangerSurfaceText: "#ef6a6e",
  successTintFill: "#16261a",
  successSurface: "#16261a",
  successTintEdge: "#2f5236",
  successSurfaceBorder: "#2f5236",
  successTintText: "#6fbf77",
  successSurfaceText: "#6fbf77",
  cautionTintFill: "#2a2213",
  cautionSurface: "#2a2213",
  cautionTintEdge: "#6b5220",
  cautionSurfaceBorder: "#6b5220",
  cautionTintText: "#e0b86a",
  cautionSurfaceText: "#e0b86a",
  // A past day sits halfway from the floor (L* 4.3) to the pane (L* 8.1):
  // below the pane, so it recedes, but no longer a hole. A closed day is
  // a step deeper (L* 5.3).
  //
  // HOVER IS LIGHT'S INVERSE (owner, 2026-10-13: "lighten both slightly
  // ... the inverse of light"). Light darkens both days under the pointer,
  // so dark lightens both, by HALF light's steps in L*: an open day 3.0
  // (light's white -> canvas is 6.3), a closed one 2.3 (light's canvas ->
  // grayClosedDayHover is 4.9). Light's full steps were tried first and
  // read too loud on dark ("needs to be more subtle"). It replaces the
  // Oct 9 split, where an open day lifted and a closed one sank to the
  // floor, so one grid answered the pointer in two directions. The closed
  // day's hover (L* 7.7) stays under the pane (8.1), so it never crosses
  // its ground.
  dayPastSurface: "#111419",
  weekClosedSurface: "#111419",
  dayClosedSurface: "#0f1216",
  dayClosedSurfaceHover: "#14171d",
  dayOpenSurfaceHover: "#232830",
  // The dark primary's off-white and hover, under its ink (see the light
  // block's note on the role).
  cautionActionFill: "#d6dbe3",
  cautionActionFillHover: "#c9d0da",
  textOnCautionAction: "#1d262d",
  // A disabled primary keeps reading as brand, deepened rather than lightened
  // so it sits below the live button instead of glowing above it. It stays on
  // the saturated brand hue (see dark-blue-stays-saturated): desaturating it
  // made the pressed sign-in button read as muddy slate next to the live
  // fill beside it.
  brandDisabledFill: "#2b5794",
  accentDisabled: "#2b5794",
  authGround: DARK_FLOOR,
  // One step above the card (DARK_PLANE), as Cal.com's footer sits ~7 L
  // over its card. `surfaceSunken` (#21252c) was a step and a half and,
  // inset 4px, drew a box inside the box.
  authCardFoot: "#1e2228",
  // Floor, card, footer and rim each one small step up (owner, Oct 20
  // 2026, beside Cal.com's sign-in), so the rim reads as the card's edge
  // catching light rather than an outline drawn around it. `edgeOnDark` at
  // 0.14 made the rim the brightest thing on the card. The rim is the chrome
  // hairline; the top adds a touch more, as if lit from above.
  authCardEdge: DARK_HAIRLINE,
  authCardEdgeTop: "rgba(255, 255, 255, 0.04)",
  // The footer's rim is quieter because its fill is lighter: 0.03 over
  // authCardFoot lands on the same value as authCardEdge over the card, so
  // the rim runs round the corner at one brightness, and the footer's top
  // is the hairline between the two.
  authCardFootEdge: "rgba(255, 255, 255, 0.03)",
  // The auth wash, same shape in dark: a near-black page with one deepened
  // blue-grey band across the angle.
  authWashTop: "#161b21",
  authBackdropFrom: "#161b21",
  authWashBand: "#2b3542",
  authBackdropMid: "#2b3542",
  authWashBase: "#1b2028",
  authBackdropTo: "#1b2028",
  // The skeleton on dark: a tinted-white alpha sized to the dark CARD's
  // step off the plane (surfaceRaised #1e2228 over #15181d), so a placeholder
  // weighs what the thing it stands in for weighs, and still shows on a card.
  skeletonInk: "rgba(219, 231, 247, 0.045)",
  skeleton: "rgba(219, 231, 247, 0.045)",

  // `theme.color.dark`. A TEXT color despite the name — it carries section
  // headings across account, settings and the profile editor, so leaving it
  // near-black made every one of those headings vanish.
  inkSoft: "#c4ccd6",
  plantPoolTint: "rgba(232, 236, 241, 0)",
  // Kept for mobile parity; web's `hero` reads `ink` now, not this.
  black: "#e8ecf1",
  // Stays white: text on a brand-colored control does not darken with the
  // surface underneath it.
  textOnAccent: "#ffffff",
  // The app-mark tile stands DOWN in dark where a brand fill stands firm: a
  // saturated square at that size is a hole punched in the card (Sep 18). It
  // is a raised neutral, one step above surfaceRaised. That neutral with a
  // white glyph read as no colour at all, so the glyph carried the brand
  // blue (`accentText`'s value) for two days. A blue-TINTED tile (#233044)
  // was tried the same day and rejected: the tint read pinkish beside the
  // blue glyph. Oct 4 2026: the well behind the card became a navy plate
  // (`wellTint`), so the colour lives there now and the glyph goes back to
  // white (owner). Literal white: `palette.white` INVERTS in dark.
  markFill: "#2f3540",
  markInk: "#ffffff",
  // The well plate (see the light block): deep navy, hue ~258 with the
  // brand, chroma held -- a navy mixed from gray read slate.
  wellTint: "#14305a",
  // No glow behind the plant in dark either (owner, Oct 12 2026).
  plantPool: "rgba(232, 236, 241, 0)",
  // Same value, same reason (see the light block): its own role only so a
  // storefront can override the CTA's label without following every other
  // filled control.
  ctaLabel: "#ffffff",
  // The lifted `accentStrong` — the system's own dark answer for a small
  // accent, and the reason a storefront's ring must lift on dark too.
  focusRing: "#6e9ad8",
  // `textPrimary` on dark, so it matches the dark selection ring.
  fieldFocus: "#e8ecf1",
  // The drag-select band, lifted to the dark `accent` and carried at a
  // heavier alpha. The light literal this replaced composited to #212b39 on
  // the dark field -- a 1.16:1 band nobody could see. At 0.35 the band is
  // 1.64:1 against the field (light's own band is 1.29:1, and a wash reads
  // weaker on a dark ground), while the typed value on top stays 9.13:1.
  textSelection: DARK_SELECTION_WASH,
  selectionWash: DARK_SELECTION_WASH,

  // Status accents. Lightened just enough to hold contrast on a dark ground
  // while staying recognizably the same hue — these encode meaning
  // (caution / critical) and must not drift into each other.
  twine: "#d4a97a",
  // The mark and the text role coincide on a dark ground: the bright tan IS
  // the legible one there (7.53:1), so no chroma trick is needed.
  twineMark: "#d4a97a",
  mulberry: "#dd7fae",
  // The homepage's section colors on dark: the grounds a faint tint of the
  // field, the deep tones lifted a step so they hold their hue.
  lavenderWhisper: "#1b171e",
  lavenderMist: "#1b171e",
  plum: "#8a5a96",
  plumHover: "#7b4f87",
  tealWhisper: "#141c1b",
  tealMist: "#141c1b",
  deepTeal: "#33766f",
  deepTealHover: "#2d6862",
  // Rating stars drop the hue on dark — see the `ratingStar` role.
  ratingStar: "#e8ecf1",
  // Filled rating stars. White rather than lifted mulberry or cool-gray
  // body text: the lifted pink is what made every review row look like a
  // status mark. Not `white` — that token remaps to the surface.
  ratingFill: "#ffffff",
  ratingAccent: "#ffffff",
  lightMulberry: "#e79ac9",
  merino: "#4a3b28", // a pale tint used as a FILL, so it inverts rather than lightens
  // The band is gray in both themes now (see the light role). On dark it is
  // a step sized for dark: `surfaceRaised`'s value (L* 8.9, ΔL* 4.4 off
  // `surface`), held literally because the band answers to the exhibit and may
  // move alone. Not `surfaceQuiet`'s ~2 L*: measured, that is 1.04:1 against
  // the page, under the felt threshold near black (see `surfaceRaised`), so
  // 6.5% of the page was painted at a step nobody could see -- and there is no
  // horizontal rule to carry the edge instead (grid.ts: the change of ground
  // IS the separation). The plate above still clears this by 6.9 L*.
  mediaBand: "#161a1e",
  // The homepage's section colors (see the light roles). Grounds as a faint
  // tint of the dark field; the action fills lifted a step so they hold
  // their hue on a near-black page, still under a white label.
  homeBandLavender: "#1b171e",
  homeBandTeal: "#141c1b",
  homeBandLavenderFade: "#1b171e",
  homeBandTealFade: "#141c1b",
  homeActionLavender: "#8a5a96",
  homeActionLavenderHover: "#7b4f87",
  homeActionTeal: "#33766f",
  homeActionTealHover: "#2d6862",
  // One step off dark's tealWhisper; no dark surface uses it today (dark's
  // day tiles are grayscale, below).
  tealWhisperHover: "#1a2422",
  // The search day tiles keep dark's grayscale (see the light block): the
  // raised tile and its card edge, and the flat dead day.
  searchDayOpenFill: "#1e2228",
  searchDayOpenEdge: "#31373f",
  // Hover lifts the fill one step (a darker fill would sink into the dark
  // card) and keeps the resting edge: no hover ring, as in light.
  searchDayOpenFillHover: "#2b3139",
  searchDayOpenEdgeHover: "#31373f",
  searchDayOpenText: "#e8ecf1",
  // Inverted like light's: dark's pale primary with ink words, the picked
  // day's look before Oct 26.
  searchDayPickedFill: "#d6dbe3",
  searchDayPickedFillHover: "#c9d0da",
  searchDayPickedText: "#1d262d",
  searchDayEmptyFill: "rgba(0, 0, 0, 0.28)",
  searchDayEmptyText: "rgba(255, 255, 255, 0.35)",
  // GRAY, LIKE THE BAND. The plate's JOB is a clear step off the band, so the
  // exhibit floats above the section instead of merging with it. It was
  // umber for a day, the light band's warm idea carried into dark, where it
  // became the one warm object on a cool charcoal screen and at plate size
  // read as a foreign panel rather than a ground; the light band has since
  // gone cool as well (see `mediaBand`), so the pigment is gone on both sides.
  // THE VALUE IS CHOSEN BY WEIGHT, NOT BY LADDER POSITION. It replaced an
  // umber plate at the same presence, only the hue leaving: the umber sat at
  // L* 26.0 and this was cut at L* 24.5, both over a band at L* 14.6, so the
  // weight was held to within 1.5 L* and the pigment was the only thing that
  // left. Those are the PRE-DEEPENING numbers; both the plate and the band
  // came down on 2026-09-03 (see the note at the top of this block). As they
  // stand the plate is L* 15.8 over a band at L* 8.9, clearing it by 6.9 --
  // still well above the ~4.6 step the next sentence rejects.
  // `surfaceSunken` (L* 11.4) was the obvious alias and is the wrong number
  // here -- it sits only ~2.5 above the band, so it very nearly merges with
  // the section along its top edge and the exhibit stops reading as an object
  // resting on the page. Held literally rather than aliased to `surfaceOnSunken`, which
  // shares the value today for unrelated reasons (chrome marks): the plate
  // answers to the exhibit, and the two are free to move apart.
  mediaPlate: "#222830",
  // Unchanged from light ON PURPOSE: it describes the recording, not the
  // page, and the recording does not theme. Restated rather than left to
  // inherit so the pair reads as deliberate at the next token audit.
  footageGround: "#1f252d",
  mediaFootageGround: "#1f252d",

  // Chrome
  docsBg: "#1a1d23",
  // The RAIL, one step under the plane and one over the homepage's floor
  // (owner, 2026-09-26: "a little darker to match the homepage, but just a
  // tad"). The same night it went floor -> plane: /pricing had been painting
  // the floor (#0d0f13) over this under a browser bar painted `surface`, and
  // read darker than any other page. Measured then, no plan page it follows
  // goes that deep or uses a gradient on its ground: Claude #151515 (cards
  // #20201f), Perplexity #181614, ChatGPT #212121. The rail sits between:
  // ~1.7 L* under the plane, the step Claude's sidebar takes under its main
  // pane, with planCard (#1e2228) still a clear step above it.
  pricingBg: DARK_RAIL,
  // THE HOMEPAGE'S SINGLE DARK GROUND. It was `surface` from the 2026-09-03
  // deepening until 2026-09-17, when the app's grounds came up 2.5 L* and this
  // one deliberately stayed: the owner's call was that the homepage is right
  // at Linear's darkness and the APP was what read too dark. So it is the old
  // plane by value -- L* 4.5, dL* 2.5 under `surface` -- and the one dark
  // ground on the platform that did not move. Its cards still take the shared
  // ladder, so they stand 2.5 L* higher on it than they did; that is the trade
  // for keeping one ladder.
  //
  // Why one ground is enough: light's homepage separates its sections by
  // CHANGING GROUND, which means three bands that all have to stay legible
  // against each other. Dark drops that mechanism (see ./grid.ts) and
  // separates by rhythm instead, so the page is a single field and its depth
  // is carried entirely by what STANDS on the field -- the `surfaceRaised` and
  // `surfaceSunken` card fills, and the border ramp that draws their edges.
  //
  // That is also why this is not a floor moving out from under a fixed ladder.
  // The deepening took every ground and card fill down together and lifted the
  // borders to compensate (fills down, lines up -- see the note at the top of
  // this block); the ramp is sized in L* against the surfaces, so the rungs
  // could not have moved one at a time.
  homepageBg: DARK_FLOOR,
  // Toasts. In light the pill is an INVERSE slab — near-black on a white page
  // — and that contrast is what makes it read as floating. Dark has no
  // inverse to reach for, so the separation has to come from elevation
  // instead: the neutral fill sits a step above even a hovered sunken control
  // (#36404c), and the edge and shadow below carry the rest. At #2a323b it
  // landed mid-ramp and read as a panel that had lost its border.
  toastBg: "#3a424e",
  // One value in both themes: the slab is dark in both (see the light role).
  successLifted: "#6fbf77",
  dangerLifted: "#f0747a",
  toastSuccessMark: "#6fbf77",
  toastErrorMark: "#f0747a",
  toastEdge: "rgba(255, 255, 255, 0.16)",
  toastShadow: "rgba(0, 0, 0, 0.55)",
  toastControl: "rgba(255, 255, 255, 0.2)",
  toastControlHover: "rgba(255, 255, 255, 0.3)",

  // Overlays. The UNFROSTED scrim goes DEEPER on dark: 40% black over a light
  // page is a clear veil, but over a dark one it barely registers. This is
  // what mobile takes, and what web falls back to wherever a backdrop cannot
  // frost (inline styles, browsers without backdrop-filter).
  scrim: "rgba(0, 0, 0, 0.6)",
  // Frosted, it does NOT have to climb to 60% — the blur carries part of the
  // separation, so the dim only has to be a dim. 50% with a 4px blur is
  // measured off Perplexity's own dialog overlay (Sep 17 2026: their element
  // is `fixed inset-0 bg-black/50` plus `backdrop-filter: blur(4px)`), which
  // is the reference this recipe was asked for. The surprise there is which
  // number does the work: at 4px the frost only softens, and it is the 50%
  // that puts the page behind glass. Move them together or not at all.
  scrimFrosted: "rgba(0, 0, 0, 0.5)",
  // Deep enough to still darken the ground under a panel that is itself
  // lighter than the page. It is the secondary cue here, not the primary one.
  menuShadow: "rgba(0, 0, 0, 0.55)",
  floatEdge: DARK_HAIRLINE,
  // Deepens on dark, like every other shadow here. A card's halo is HALF of
  // its elevation on dark — `surfaceRaised` lifts the fill above the menu and
  // this pools a shadow below it, and the card reads because it is bracketed
  // from both sides.
  //
  // A draft flattened this to its light 0.1 on the theory that black over
  // near-black does nothing. That is true of a shadow cast on the PAGE, and
  // false here: the card fill is lighter than the menu it sits on, so the
  // halo has something to contrast against. Flattening it did not calm the
  // card down, it made the card disappear, and no fill value could recover it.
  //
  // Not menuShadow's 0.55 either — that pairing is what read as over-raised.
  // At 0.32 the halo sits ΔL* 5.34 below the menu; with the fill ΔL* 4.70
  // above it, the total span is 10.04 against the over-raised draft's 13.87.
  cardShadow: "rgba(0, 0, 0, 0.32)",
  // Unchanged from light, on purpose: this is the value the identity card
  // shipped on dark before the recipe was shared, and the halo above is the
  // half of the pair that was tuned for this theme.
  cardRing: "rgba(0, 0, 0, 0.02)",
  // Deepens by cardShadow's own ratio (0.1 -> 0.32, x3.2), so the step
  // between a resting card and the open one holds on dark.
  cardShadowLow: "rgba(0, 0, 0, 0.13)",
  // The open step's lift on dark stays a SHADOW, as in light (owner,
  // 2026-10-13: a white halo read as a glow -- "I don't like the bright
  // shadow"). Every step sits on the page's own fill, so the shadow falls
  // on the page itself, and no black ring can draw an edge there -- a 45%
  // one vanished ("what happened to the border?"). The ring is the other
  // steps' hairline instead (`border`, 8% white), so every step has the
  // same quiet edge and the open one adds the shadow, as in light. The two
  // shadows take the card values' dark depth (cardShadowLow, cardShadow).
  stepRing: DARK_HAIRLINE,
  stepShadowLow: "rgba(0, 0, 0, 0.13)",
  stepShadow: "rgba(0, 0, 0, 0.32)",
  accentTint: "rgba(84, 133, 204, 0.18)",
  accentTintStrong: "rgba(84, 133, 204, 0.3)",
  accentHoverTint: "rgba(84, 133, 204, 0.14)",
  // Inverts the crop veil: white wash in light, black wash here, so the
  // editor matches the modal instead of lighting a white slab on a dark page.
  cropMask: "rgba(0, 0, 0, 0.6)",

  // The controls stay fixed, but the canvas becomes opaque black in dark mode
  // so underlying dark cards and text cannot ghost through as muddy shapes.
  viewerScrim: "#000000",
  viewerControlFill: "rgba(95, 103, 113, 0.5)",
  viewerControlFillHover: "rgba(95, 103, 113, 0.7)",
  viewerControlWash: "rgba(255, 255, 255, 0.12)",
  viewerGlyph: "#ffffff",
  viewerGlyphMuted: "rgba(255, 255, 255, 0.75)",
};

/** Every token as it resolves in dark: the light set with the overrides on top. */
const allDarkTokens = { ...allTokens, ...darkTokens };

// ---------------------------------------------------------------------------
// 3. GRADIENTS
// ---------------------------------------------------------------------------
// Stops only, never a CSS string: web composes `linear-gradient(...)`, mobile
// feeds expo-linear-gradient. Geometry (angle, locations) stays platform-side.
//
// The CTA is a small fill under a white label, so its stops are the
// `accentFill` pair — the blue the selected availability chip paints — and
// not `accent`/`danube`. The two used to differ (see `danubeFill`), and a
// Continue button one step lighter than the chip above it read as two blues.
// Roles rather than primitives so a storefront's accent, which overrides
// `--n2t-accent-fill(-hover)` in place, repaints the button with them.
const gradients = {
  cta: { from: semantic.accentFill, to: semantic.accentFillHover },
};

// ---------------------------------------------------------------------------
// 3b. CORNER RADIUS
// ---------------------------------------------------------------------------
// One scale for both apps (owner, Oct 29 2026, after a benchmark of Airbnb,
// Apple, Stripe, Zocdoc and Linear and the Material 3 / Atlassian / Polaris
// scales: specs/radius/feature.md). A part takes the step for what it IS,
// never a number of its own, and the step rises with the part's size:
//
//   xs 4      checkbox, tag, progress bar, skeleton line
//   sm 8      field, button, time chip, menu, tooltip, thumbnail
//   md 12     day tile, choice card, banner, secondary 48px button, row panel
//   lg 16     card, section, panel
//   xl 24     dialog, sheet (top corners), large photo
//   display 32  marketing only (the homepage table columns, Oct 25)
//   pill      the booking call to action and chips; never a system Button
//
// A circle (avatar, round icon button) stays `50%`. Nested corners are
// concentric: inner = outer - padding, floored at the inner part's own step.
// Pixels, not a CSS string: web appends px (library/styled `theme.radius`),
// mobile reads the numbers.
const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  display: 32,
  pill: 999,
};

// ---------------------------------------------------------------------------
// 4. WEB CSS-VARIABLE EMISSION
// ---------------------------------------------------------------------------

const CSS_PREFIX = "--n2t-";

/** `coolGrayLightest` -> `cool-gray-lightest`; `gray900` -> `gray900`. */
const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** The CSS custom-property name for a token, e.g. `--n2t-cool-gray-lightest`. */
const cssVarName = (name) => `${CSS_PREFIX}${kebab(name)}`;

/**
 * `var(--n2t-x, <raw>)` — always with the raw value as a fallback, so a page
 * that somehow renders without the :root block degrades to today's exact
 * colors rather than to transparent.
 */
const webVar = (name) => `var(${cssVarName(name)}, ${allTokens[name]})`;

/** Every token as a var() string. This is what apps/web/library/styled.js reads. */
const webColors = Object.keys(allTokens).reduce((acc, name) => {
  acc[name] = webVar(name);
  return acc;
}, {});

/**
 * The `:root` declaration block, generated — never hand-write a `--n2t-*`
 * declaration anywhere else. Injected at the top of GlobalStyles in
 * apps/web/app/client-layout.js.
 *
 * The dark theme is the companion block below, keyed off an attribute rather
 * than a media query so an explicit user choice can outrank the OS.
 */
const cssVariablesBlock = (selector = ":root") => {
  const declarations = Object.keys(allTokens)
    .map((name) => `  ${cssVarName(name)}: ${allTokens[name]};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
};

/**
 * The dark block: only the names that differ, so light stays the base layer
 * and any token added without a dark value is visibly (and testably) missing
 * rather than silently inheriting a near-black text color.
 *
 * `color-scheme` comes along for the ride — it is what turns native scrollbars,
 * form controls and the browser's own canvas dark, none of which our variables
 * can reach.
 */
const darkVariablesBlock = (selector = ':root[data-theme="dark"]') => {
  const declarations = Object.keys(darkTokens)
    .map((name) => `  ${cssVarName(name)}: ${darkTokens[name]};`)
    .join("\n");
  return `${selector} {\n  color-scheme: dark;\n${declarations}\n}`;
};

module.exports = {
  palette,
  semantic,
  allTokens,
  darkTokens,
  allDarkTokens,
  gradients,
  radius,
  webColors,
  webVar,
  cssVarName,
  cssVariablesBlock,
  darkVariablesBlock,
  CSS_PREFIX,
};
