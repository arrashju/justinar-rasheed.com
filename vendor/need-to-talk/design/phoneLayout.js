/**
 * The phone-layout switch (owner, 2026-10-18: the marketing pages' phone
 * cards play at every width, desktop included).
 *
 * A phone card draws the app's own parts at the phone's 430px, scaled into a
 * bezel. Those parts pick their phone look from the WINDOW's width
 * (`@media (max-width: …)`), so on a desktop page they would draw their
 * desktop look inside the phone. The card's screen carries
 * `data-phone-layout`, and a part whose look differs by width writes that
 * rule through these helpers, so it takes its phone look inside a card at
 * any window width and nothing changes anywhere else.
 *
 *   ${upTo(theme.breakpoints.mobile)`padding: 0 16px;`}
 *     -> the rule under 949px, and inside a phone card at any width
 *
 *   ${atLeast("1281px")`flex-direction: row;`}
 *     -> the rule from 1281px, never inside a phone card
 *
 * Only parts a card actually draws need them; the rest of the app keeps its
 * plain media queries. Which parts those are was MEASURED: every element of
 * each card's screen, in each scene of its loop, compared at 390px against
 * 760px and 1440px, until nothing differed. A part that starts drawing in a
 * card later needs the same check. `__tests__/phoneLayout.test.js` pins the
 * helpers.
 */

import { css } from "styled-components";

export const PHONE_LAYOUT_ATTRIBUTE = "data-phone-layout";

/* Inside a phone card's screen. In :where(), so the rule weighs what the
   media query it stands beside weighs (one class): a part's own later
   override, which beat the media query, still beats this. Without it the
   Profile card's 44px Show more took the Button's 45. The `*` (no weight
   either) keeps the selector from starting with a pseudo-class, which
   stylis glues onto the component's class (`.x:where(…)`). */
export const IN_PHONE_LAYOUT = `*:where([${PHONE_LAYOUT_ATTRIBUTE}])`;

/* The selector for "this element, inside a phone card", for a rule a
   helper below can't express. The `&` LEADS, inside :is(), never
   `${IN_PHONE_LAYOUT} &`: written after something, styled-components points
   `&` at the component's shared class rather than this instance's, and every
   instance takes the last one's values (the first month heading took
   November's 24px margin). */
export const inPhoneLayout = `&:is(${IN_PHONE_LAYOUT} *)`;

const px = (width) => (typeof width === "number" ? `${width}px` : width);

/** The rule at `width` and under, and inside a phone card at any width. */
export const upTo =
  (width) =>
  (...rule) => css`
    @media (max-width: ${px(width)}) {
      ${css(...rule)}
    }

    ${inPhoneLayout} {
      ${css(...rule)}
    }
  `;

/** The rule at `width` and over, never inside a phone card. */
export const atLeast =
  (width) =>
  (...rule) => css`
    @media (min-width: ${px(width)}) {
      &:not(${IN_PHONE_LAYOUT} *) {
        ${css(...rule)}
      }
    }
  `;
