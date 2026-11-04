import styled, { css } from "styled-components";
import theme from "library/styled";
import {
  CHOICE_LABEL,
  CHOICE_LINE_HEIGHT,
  CHOICE_WEIGHT,
} from "design/choiceRules";

/**
 * How every booking pick (a time chip, a day tile, the search card's More
 * tile) eases between rest, hover and chosen: one timing, so a day and a time
 * ink their edge at the same speed (owner, 2026-10-11: the tiles snapped
 * while the chips faded). Off when the OS asks for reduced motion.
 *
 * The curve is the house glide (PillTabs, PanelSlide, FilterPill), which is
 * Airbnb's on its time pills, measured Oct 20 2026: no delay, fast out of the
 * gate and settling. The press eases too: `transform` used to be missing from
 * the list, so the 0.97 press snapped in and out.
 */
const PICK_EASE = "cubic-bezier(0.2, 0, 0, 1)";

export const pickTransition = css`
  transition:
    border-color 0.2s ${PICK_EASE},
    box-shadow 0.2s ${PICK_EASE},
    background-color 0.2s ${PICK_EASE},
    color 0.2s ${PICK_EASE},
    transform 0.1s ${PICK_EASE};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/**
 * Outlined availability time chip — shared by the profile sticky sidebar,
 * the Consultation day list, and the phone booking sheet.
 *
 * Pass `$selected` for the chosen state. Grayscale on purpose (owner call,
 * Oct 10 2026): the resting chip is an ink label on the `pickEdge` edge
 * (owner, Oct 29 2026: a step over the card hairline it shared with a day
 * tile, which read weak) and the `surfaceRaised` fill, and it steps its
 * edge on hover (below). The chosen time is a RING, not a
 * fill (owner, Oct 14 2026): the day tile's fill already names the context,
 * and a second pale plate was the loudest thing on the dark booking card.
 * The edge goes to `textPrimary` and an inset 1px shadow thickens it to
 * 2px, so selecting never reflows the row. The only colour left on the card is its CTA.
 *
 * Hover is one quiet step of the edge, `pickEdge` to `pickEdgeHover`, the
 * same answer a text field gives the pointer (owner, Oct 20 2026). It used
 * to go straight to ink, which made a hovered time a 1px copy of the 2px
 * chosen one: two selections. Airbnb's time pills step the same way
 * (#DDD to #C1C1C1, measured Oct 20). The corner is the field's 8px and the
 * label the option size (design/choiceRules), so the chips read as part of
 * the card's form rather than a grid of their own.
 *
 * `$compact` is the shorter ZocDoc-style chip used in day lists; the default
 * size is the taller sticky-sidebar row.
 */
export const AvailabilitySlotChip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-color: ${(props) =>
    props.$selected ? theme.color.textPrimary : theme.color.pickEdge};
  box-shadow: ${(props) =>
    props.$selected ? `inset 0 0 0 1px ${theme.color.textPrimary}` : "none"};
  background: ${theme.color.surfaceRaised};
  color: ${theme.color.textPrimary};
  font-family: ${theme.font.body};
  font-size: ${CHOICE_LABEL}px;
  font-weight: ${CHOICE_WEIGHT};
  line-height: ${CHOICE_LINE_HEIGHT}px;
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  ${pickTransition}

  ${(props) =>
    props.$compact
      ? css`
          padding: 6.5px 4px;
          border-width: 1px;
        `
      : css`
          /* 12px + 21px line box + 2 × 1px border = the row's 47px height. */
          padding: 12px 4px;
          border-width: 1px;
        `}

  @media (hover: hover) {
    &:hover {
      border-color: ${(props) =>
        props.$selected ? theme.color.textPrimary : theme.color.pickEdgeHover};
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.color.textPrimary};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.97);
  }
`;

/** Equal-width chip grid for a row of availability times. */
export const AvailabilitySlotRow = styled.div`
  display: grid;
  ${(props) =>
    props.$compact
      ? css`
          grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
          gap: 6px;
        `
      : css`
          grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
          gap: 8px;
        `}
`;
