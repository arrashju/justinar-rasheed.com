// Shared availability calendar for the search results list and the profile
// "Availability" section. Both pages render the same day cells; the only
// difference is how much horizontal room they hand it, so the component
// measures its own container rather than the viewport and picks a layout
// from that (see utils/availabilityLayout for the tier rules).
//
// The cell is the profile grid's: weekday and date stacked, then the slot
// count and its unit ("openings"), emphasis alternating between the two.
//
// Callers own the data: build a `days` array and pass it in. This component
// owns measurement, merging, labelling and rendering only.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import moment from "moment-timezone";
import theme from "library/styled";
import { upTo } from "design/phoneLayout";
import { pickTransition } from "components/shared/AvailabilitySlotChip";
import { CustomSkeleton } from "components/shared/CustomSkeleton";
import {
  CELL_HEIGHT,
  COMPACT_CELL_HEIGHT,
  COMPACT_MAX_WIDTH,
  COLUMNS,
  COLUMN_GAP,
  FIT_MIN_CELL_WIDTH,
  MAX_CELL_WIDTH,
  MAX_STRIP_CELLS,
  ROW_GAP,
  cellDateLabel,
  cellSlotsParts,
  cellWeekdayLabel,
  fitLayout,
  layoutTier,
  mergeUnavailableRuns,
  unbookableDays,
} from "utils/availabilityLayout";

/** 13 days + a trailing cell fills the 7x2 grid exactly. */
export const DEFAULT_DAY_COUNT = 13;

/**
 * The search card looks four weeks ahead, so a wide card has days to fill
 * its fitted row once empty runs merge (13 days merged to as few as five
 * tiles). The profile's grid keeps DEFAULT_DAY_COUNT.
 */
export const SEARCH_DAY_COUNT = 28;

/* A cell's side padding and border. The fitted tile's floor is set on its
   label column (FIT_MIN_CELL_WIDTH less these), so a label wider than the
   floor -- "Oct 30 - Nov 17" -- widens its tile instead of clipping. */
const CELL_PAD_X = 7;
const CELL_BORDER = 1;
const FIT_MIN_LABEL_WIDTH = FIT_MIN_CELL_WIDTH - 2 * (CELL_PAD_X + CELL_BORDER);

/** Thumb never shrinks below this, however long the strip gets. */
const MIN_THUMB_PERCENT = 12;

/**
 * Tracks an element's content-box width via ResizeObserver.
 * Returns [ref, width]; width is null until first measurement.
 *
 * The seed is the content box too (less padding), matching what the observer
 * reports: the search card pads its scroller with the phone's gutter.
 */
function useMeasuredWidth() {
  const [width, setWidth] = useState(null);
  const observerRef = useRef(null);

  const ref = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;

    // Seed synchronously so the first paint after mount is already correct.
    const style = window.getComputedStyle(node);
    setWidth(
      node.getBoundingClientRect().width -
        (parseFloat(style.paddingLeft) || 0) -
        (parseFloat(style.paddingRight) || 0),
    );

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const next = entry.contentRect?.width;
      if (typeof next === "number") setWidth(next);
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(
    () => () => {
      if (observerRef.current) observerRef.current.disconnect();
    },
    [],
  );

  return [ref, width];
}

const AvailabilityCalendar = ({
  days = [],
  today,
  loading = false,
  layout = "auto",
  placeholderCount,
  onSelectDay,
  trailing = null,
  className,
  /**
   * `false` means the provider cannot be booked AT ALL — not that this window
   * happens to be empty. The search index answers it (`bookable`, from
   * shared/bookability.js); the profile's own grid never passes it, because a
   * profile that cannot be booked renders no availability section to begin
   * with.
   *
   * Undefined is "not answered" and renders exactly as it always did. Practice
   * records carry no verdict yet, so this is the state most of them are in.
   */
  bookable,
  /**
   * "MM/DD/YYYY" of the day the booking card is describing. That cell is
   * filled, so the grid and the card agree on which day the times
   * belong to. Search passes nothing and no cell is marked.
   */
  selectedDateKey = null,
  /**
   * Two-line cells at phone widths, Zocdoc's tile: "Wed Oct 14" over
   * "32 openings", and a merged run as its dates alone ("Oct 15 - 19"). The
   * search list asks for it so a whole card fits under the map with the
   * sheet at HALF; the profile keeps its four-line cell. Pure CSS, so the
   * server's markup is already right and nothing reflows on hydration.
   */
  compact = false,
  /**
   * "warm" is the search results' tile (owner, 2026-10-26): in light a day
   * with openings is pale teal with a deep-teal count and a day with none a
   * faint neutral wash, on 12px corners with no outline. Dark resolves the
   * same roles to the grayscale tile (shared/designTokens.js, searchDay*).
   * The profile's grid sets it on needtalk.com; a branded page leaves it
   * unset and keeps the grayscale tile.
   */
  tone = "default",
  /**
   * The search card's row (owner, 2026-10-26, after Zocdoc): as many whole
   * tiles as the row fits at FIT_MIN_CELL_WIDTH, then `trailing`, sharing the
   * row so it ends flush with the card; a row too narrow for three days and
   * More scrolls at the minimum width instead. Strip layout only; the rules
   * are `fitLayout` in utils/availabilityLayout.
   */
  fit = false,
  /**
   * Called with the px width the fitted row's tiles and trailing cell take,
   * or null when the row is not fitted. A row whose days run out before its
   * slots do ends short of its box; the search card caps its header and bio
   * there so all three end at More (owner, 2026-10-27: "let the length of
   * those day cards ... be the determining factor of how wide that container
   * (including the bio sample) is"). The box itself keeps its width, so the
   * row can still grow when the window does.
   */
  onFitWidth,
}) => {
  const warm = tone === "warm";
  const [ref, width] = useMeasuredWidth();
  const [rowRef, rowWidth] = useMeasuredWidth();
  const scrollerRef = useRef(null);
  const setScroller = useCallback(
    (node) => {
      scrollerRef.current = node;
      if (fit) rowRef(node);
    },
    [fit, rowRef],
  );
  const [thumb, setThumb] = useState(null);
  const tier = layoutTier(width, layout);

  const todayMoment = today || moment().startOf("day");

  // The verdict is DATA, not a second layout. A provider who cannot be booked
  // has their days zeroed (`unbookableDays`) and everything below is the
  // ordinary path: the grid lays out all thirteen days, so 13 + the trailing
  // More fills its 7x2 exactly — which is what DEFAULT_DAY_COUNT is for — and
  // the strip merges the dead run into one wide cell the way it merges any
  // other, so nobody swipes past thirteen empty days to learn there is nothing
  // there.
  //
  // Two earlier attempts put the verdict in the LAYOUT instead — one
  // row-spanning cell, then per-day "Unavailable" cells with a row cap that
  // capped the grid to seven and pushed More onto a row of its own. Each
  // replaced a working design with a second one used by this case alone. The
  // card's defect was counting openings a visitor could not book; the fix is to
  // stop counting them.
  const window = bookable === false ? unbookableDays(days) : days;
  const merged = tier === "narrow" ? mergeUnavailableRuns(window) : null;
  const fitted =
    fit && tier === "narrow"
      ? fitLayout(rowWidth, merged.length, Boolean(trailing))
      : null;
  // "fit" | "scroll" | null: how a fitted row sizes its cells.
  const $fit = fitted?.mode ?? null;
  const cells =
    tier === "narrow"
      ? merged.slice(0, fitted ? fitted.dayCount : MAX_STRIP_CELLS)
      : window.map((d) => ({ ...d, dates: [d] }));

  /**
   * Native scrollbars are no help here: every mobile browser — and Chrome on
   * macOS under the default "show scroll bars when scrolling" — draws an
   * overlay bar that fades out and reserves no space, and no CSS pins it
   * open. So the strip hides the native bar and renders its own, which is
   * always visible and looks identical on every platform.
   */
  const syncThumb = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return setThumb(null);
    const { clientWidth, scrollWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth + 1) return setThumb(null);
    const size = Math.max((clientWidth / scrollWidth) * 100, MIN_THUMB_PERCENT);
    // Offset is expressed against the room the thumb actually has to travel,
    // so it lands flush at both ends however wide the thumb was clamped to.
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setThumb({ size, offset: progress * (100 - size) });
  }, []);

  useEffect(() => {
    syncThumb();
  }, [syncThumb, tier, width, rowWidth, cells.length, loading]);

  useLayoutEffect(() => {
    if (!onFitWidth) return;
    const el = scrollerRef.current;
    if (loading || $fit !== "fit" || !el?.firstElementChild) {
      onFitWidth(null);
      return;
    }
    const left = el.firstElementChild.getBoundingClientRect().left;
    const right = el.lastElementChild.getBoundingClientRect().right;
    onFitWidth(Math.ceil(right - left));
  }, [onFitWidth, loading, $fit, rowWidth, cells.length]);

  if (loading) {
    // Match the shape the loaded calendar will take, so the skeleton does not
    // reflow into a different cell count the moment data lands.
    // A fitted row's skeleton takes every slot the loaded row will: its days
    // and its trailing More.
    const fittedSlots =
      fit && tier === "narrow" ? fitLayout(rowWidth, Infinity, false) : null;
    const placeholders =
      placeholderCount ??
      (fittedSlots?.mode === "fit"
        ? fittedSlots.dayCount
        : tier === "narrow"
          ? MAX_STRIP_CELLS + 1
          : COLUMNS * 2);
    return (
      <Root ref={ref}>
        <Scroller ref={setScroller} $tier={tier} className={className}>
          {Array.from({ length: placeholders }).map((_, i) => (
            <CellSkeleton
              key={`placeholder-${i}`}
              $tier={tier}
              $compact={compact}
              $warm={warm}
              $fit={fittedSlots?.mode ?? null}
              variant="rounded"
              aria-hidden="true"
            />
          ))}
        </Scroller>
      </Root>
    );
  }

  return (
    <Root ref={ref}>
      <Scroller
        ref={setScroller}
        $tier={tier}
        className={className}
        onScroll={tier === "narrow" ? syncThumb : undefined}
      >
        {cells.map((cell) => {
          const available = cell.state === "available";
          const selected = available && cell.dateKey === selectedDateKey;
          const { value, unit } = cellSlotsParts(cell);
          return (
            <Cell
              key={cell.dateKey}
              $available={available}
              $selected={selected}
              $tier={tier}
              $compact={compact}
              $warm={warm}
              $fit={$fit}
              type="button"
              aria-current={selected ? "date" : undefined}
              disabled={!available}
              onClick={
                available && onSelectDay
                  ? (e) => {
                      e.stopPropagation();
                      onSelectDay(cell);
                    }
                  : undefined
              }
            >
              <CellGroup $fit={$fit}>
                <CellStrong $range={cell.dates?.length > 1}>
                  {cellWeekdayLabel(cell, todayMoment)}
                </CellStrong>
                <CellLight>{cellDateLabel(cell)}</CellLight>
              </CellGroup>
              <CellGroup $count>
                <CellStrong>{value}</CellStrong>
                {/* "Unavailable" is the whole line — there is no unit under
                    it, because nothing is being counted. */}
                {unit ? <CellLight>{unit}</CellLight> : null}
              </CellGroup>
            </Cell>
          );
        })}
        {trailing ? (
          <TrailingSlot $tier={tier} $fit={$fit}>
            {trailing}
          </TrailingSlot>
        ) : null}
      </Scroller>

      {tier === "narrow" && thumb ? (
        // Shares `className` with the scroller so the caller's gutter insets
        // both, keeping the bar aligned with the first cell.
        <TrackRow className={className} aria-hidden="true">
          <Track>
            <Thumb
              style={{ width: `${thumb.size}%`, left: `${thumb.offset}%` }}
            />
          </Track>
        </TrackRow>
      ) : null}
    </Root>
  );
};

// ── Styled components ────────────────────────────────────────────────────────

const Root = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

/* The grid is a fixed 7 columns, so a column is always one weekday and row 2
   lines up under row 1. narrow becomes a content-sized scrolling strip: merged
   cells are naturally wider than single days, which is what makes the range
   labels readable at that size. */
const Scroller = styled.div`
  box-sizing: border-box;
  width: 100%;
  gap: ${ROW_GAP}px ${COLUMN_GAP}px;
  align-items: stretch;

  ${(props) =>
    props.$tier === "narrow"
      ? `
        display: flex;
        flex-direction: row;
        overflow-x: auto;

        /* Hidden in favour of the always-visible bar rendered below. */
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
          display: none;
        }
      `
      : `
        display: grid;
        grid-template-columns: repeat(${COLUMNS}, minmax(0, ${MAX_CELL_WIDTH}px));
        justify-content: start;
      `}
`;

const TrackRow = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
`;

/* No rail of its own — this only sets the geometry the thumb is positioned
   against, so the bar reads as a lone marker under the strip. */
const Track = styled.div`
  position: relative;
  height: 6px;
`;

const Thumb = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: ${theme.radius.xs};
  /* Black alpha disappears on a dark surface, so the bar takes the same
     scrollbar token every other scroller in the app uses. */
  background: ${theme.color.scrollbarThumb};
  transition: background 0.25s ease;

  @media (hover: hover) {
    ${Track}:hover & {
      background: ${theme.color.scrollbarThumbHover};
    }
  }
`;

/* Single source of truth for how a cell claims horizontal space, shared by the
   day cells and whatever the caller passes as `trailing` so the two always
   line up. In the narrow strip cells size to their own content, which is what
   lets a merged range render wider than a single day.

   A fitted row (`fit`, both modes) holds every tile at FIT_MIN_CELL_WIDTH,
   as Zocdoc's does at every width (owner, 2026-10-26: "capped ... including
   the individual day slots"): more room shows more tiles, never wider ones,
   and the spare sits after the trailing cell. The floor of a day cell lives
   on its label column (CellGroup), so min-content is max(floor, label) and a
   long range still fits its words; the trailing cell has no label column
   and takes it here. */
const cellSizing = (props) =>
  props.$fit
    ? `
      flex: 0 0 auto;
      width: auto;
      min-width: min-content;
    `
    : props.$tier === "narrow"
      ? `
      flex: 0 0 auto;
      width: auto;
      min-width: 76px;
    `
      : `
      width: 100%;
      min-width: 0;
    `;

const TrailingSlot = styled.div`
  box-sizing: border-box;
  ${cellSizing}
  /* A fitted row's More is a tile wide, but in "fit" it gives back the few
     pixels a day label wider than the floor ("Today Oct 26", a range) takes,
     so a card cut to whole slots never overflows into a scroll bar. Its one
     word needs far less than 72. */
  ${(props) =>
    props.$fit === "fit"
      ? `flex: 0 1 ${FIT_MIN_CELL_WIDTH}px; min-width: 72px;`
      : props.$fit
        ? `min-width: ${FIT_MIN_CELL_WIDTH}px;`
        : ""}
`;

/* Shimmering stand-in for a Cell. Pinned to CELL_HEIGHT because it has no
   content of its own to be sized by; in the strip it takes a nominal width,
   since real cells there size to labels of differing length. */
const CellSkeleton = styled(CustomSkeleton)`
  box-sizing: border-box;
  border-radius: ${(props) => (props.$warm ? theme.radius.md : theme.radius.xs)} !important;
  height: ${CELL_HEIGHT}px !important;

  ${(props) =>
    props.$compact === "always"
      ? `height: ${COMPACT_CELL_HEIGHT}px !important;`
      : props.$compact &&
        upTo(`${COMPACT_MAX_WIDTH}px`)`
          height: ${COMPACT_CELL_HEIGHT}px !important;
        `}

  ${(props) =>
    props.$fit
      ? `
      flex: 0 0 auto;
      width: ${FIT_MIN_CELL_WIDTH}px !important;
    `
      : props.$tier === "narrow"
        ? `
      flex: 0 0 auto;
      width: 96px !important;
    `
        : `
      width: 100% !important;
      min-width: 0;
    `}
`;

/* The two-line tile: weekday beside date, count beside unit. `compact`
   asks for it on a phone; "always" asks for it at every width (the desktop
   search card's one row). */
const compactCellRules = css`
  gap: 0;
  min-height: ${COMPACT_CELL_HEIGHT}px;

  & > div {
    flex-direction: row;
    align-items: baseline;
    gap: 0.3em;
  }

  /* Two lines + padding + border stay inside COMPACT_CELL_HEIGHT, the
     skeleton tile's height. At the 1.55 leading the tile grew to 53.4 and
     the row dropped a pixel when the days replaced the skeleton. (The two
     sizes share a baseline, so a row runs a little over its leading.) */
  & span {
    font-weight: 500;
    line-height: 20px;
  }

  & span[data-range] {
    display: none;
  }
`;

/* A pick-set tile, not an action: it keeps its own geometry rather than
   design/profile's Button, and its one primaryFill (the chosen day) is
   allowed in config/handRolledButtonBaseline.json. */
const Cell = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  box-sizing: border-box;
  min-height: ${CELL_HEIGHT}px;
  padding: 4px ${CELL_PAD_X}px;
  border: ${CELL_BORDER}px solid;
  border-radius: ${(props) => (props.$warm ? theme.radius.md : theme.radius.xs)};
  font-family: ${theme.font.body};
  text-align: left;
  overflow: hidden;

  ${cellSizing}

  /* Grayscale (owner call, Oct 10 2026): a bookable day is a raised tile
     with an ink label and a dead day stays flat. The day the booking card is
     describing is FILLED with the primary ink (pale in dark), Airbnb's inked
     dates: a booking pick-set is the one place selection is a fill rather
     than the ring (AGENTS.md, "Selection is ink"). The blue it used to be is
     left to the booking CTA. An open day answers the pointer as a time chip
     does, one quiet step of its edge to borderHover (owner, Oct 20 2026);
     the ink edge it used to take was a thin pencil line round the tile.

     The WARM tile (needtalk.com's profile grid) INVERTS its picked day to
     the deep teal with white words (owner, 2026-10-26: "make it darker and
     maybe even think about inverting the text"; dark: its pale primary with
     ink words). A branded page keeps the ink fill. */
  background: ${(props) =>
    props.$selected && props.$warm
      ? theme.color.searchDayPickedFill
      : props.$selected
        ? theme.color.primaryFill
        : props.$available
          ? props.$warm
            ? theme.color.searchDayOpenFill
            : theme.color.surfaceRaised
          : props.$warm
            ? theme.color.searchDayEmptyFill
            : theme.color.unavailableFill};
  border-color: ${(props) =>
    props.$selected && props.$warm
      ? theme.color.searchDayPickedFill
      : props.$selected
        ? theme.color.primaryFill
        : props.$available
          ? props.$warm
            ? theme.color.searchDayOpenEdge
            : theme.color.borderCard
          : "transparent"};
  color: ${(props) =>
    props.$selected && props.$warm
      ? theme.color.searchDayPickedText
      : props.$selected
        ? theme.color.textOnPrimary
        : props.$available
          ? theme.color.textPrimary
          : props.$warm
            ? theme.color.searchDayEmptyText
            : theme.color.unavailableText};

  /* The warm tile's count and unit take the deep teal, so the number is
     what the eye lands on; the weekday and date stay ink. */
  ${(props) =>
    props.$warm && props.$available && !props.$selected
      ? `& > [data-count] { color: ${theme.color.searchDayOpenText}; }`
      : ""}
  cursor: ${(props) => (props.$available ? "pointer" : "default")};
  ${pickTransition}

  @media (hover: hover) {
    &:hover {
      ${(props) =>
        props.$selected && props.$warm
          ? `background: ${theme.color.searchDayPickedFillHover};
             border-color: ${theme.color.searchDayPickedFillHover};`
          : props.$selected
            ? `background: ${theme.color.primaryFillHover};
             border-color: ${theme.color.primaryFillHover};`
            : props.$available
              ? props.$warm
                ? /* The warm tile fills a step darker and grows no ring
                   (owner, 2026-10-26: "I don't like the border
                   highlight"). */
                  `background: ${theme.color.searchDayOpenFillHover};
                 border-color: ${theme.color.searchDayOpenEdgeHover};`
                : `border-color: ${theme.color.borderHover};`
              : ""}
    }
  }

  &:active {
    transform: ${(props) => (props.$available ? "scale(0.97)" : "none")};
  }

  /* Each label pair on one line, the pairs stacked: weekday beside date,
     count beside unit. A merged run drops its weekday range, which beside the
     dates made the longest label in the strip ("Thu - Mon Oct 15 - 19").
     Once a pair shares a line it reads as one phrase, so the weekday and the
     count drop to regular weight (owner call, Oct 13 2026); the bold lead
     only earns its place when the pair is stacked. */
  ${(props) =>
    props.$compact === "always"
      ? compactCellRules
      : props.$compact && upTo(`${COMPACT_MAX_WIDTH}px`)`${compactCellRules}`}
`;

const CellGroup = styled.div.attrs((props) => ({
  "data-count": props.$count ? "" : undefined,
}))`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  ${(props) => (props.$fit ? `min-width: ${FIT_MIN_LABEL_WIDTH}px;` : "")}
`;

const CellStrong = styled.span.attrs((props) => ({
  "data-range": props.$range ? "" : undefined,
}))`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
  white-space: nowrap;
`;

const CellLight = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.55;
  white-space: nowrap;
`;

export default AvailabilityCalendar;
