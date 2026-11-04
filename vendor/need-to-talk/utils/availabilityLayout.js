/**
 * Width-adaptive layout rules for the shared availability calendar
 * (components/shared/AvailabilityCalendar). Pure functions only — the
 * component owns measurement and rendering, this owns the decisions.
 *
 * Two layouts, chosen by how much room the calendar's *container* gives it:
 *
 *   grid    7 columns x 2 rows, one cell per day, weekday stacked over the
 *           date ("Thu" / "Aug 6" / "9" / "openings")
 *   narrow  a single horizontally scrolling row, capped at MAX_STRIP_CELLS;
 *           runs of *unavailable* days merge into one wider cell
 *           ("Mon - Thu" / "Aug 10 - 13")
 *
 * The weekday is always shown. It sits above the date rather than beside it,
 * so it costs height, never width — there is no container width at which
 * dropping it would buy anything. (Zocdoc does drop it between roughly 1100
 * and 1360px viewport, then shows it again on mobile; we don't follow that.)
 *
 * Available days are never merged: collapsing a bookable day into a range
 * would hide the thing the user is scanning for. Only dead runs collapse.
 *
 * Tiers key off container width, not viewport, so one component serves both
 * the narrow search column and the wide profile column at the same viewport.
 */

export const COLUMNS = 7;
export const COLUMN_GAP = 8;
export const ROW_GAP = 7;

/**
 * Narrowest column that still fits a day cell's longest line ("Aug 18" at
 * 13px plus the cell's 8px side padding). Below this, seven columns stop
 * being readable and the calendar switches to the merged scrolling strip.
 */
export const GRID_MIN_COL_WIDTH = 62;

/**
 * Widest a cell is allowed to get. Without a cap, a roomy container stretches
 * seven columns into slabs — at 967px the cells hit 131px, far past anything
 * the four short lines inside them need.
 */
export const MAX_CELL_WIDTH = 110;

/**
 * Most cells the stacked scrolling row shows before the trailing "More".
 * Merging already shortens a sparse provider's row, but a dense one would
 * otherwise scroll the full window — cap it so every card scrolls the same
 * bounded distance.
 *
 * The STRIP only. The grid is not capped and must not be: 13 days plus the
 * trailing More fills its 7x2 exactly (see DEFAULT_DAY_COUNT), and capping it
 * to seven leaves More stranded on a row of its own.
 */
export const MAX_STRIP_CELLS = 7;

/**
 * Height of a day cell: two stacked label pairs (14px + 13px at 1.55), the
 * 12px gap between them and 5px of padding top and bottom. Cells are sized by
 * their content, but the loading skeleton has no content to size to — pinning
 * both to this keeps the placeholder from resizing the row when data lands.
 */
export const CELL_HEIGHT = 106;

/**
 * The compact cell's height: the same two label pairs, each on ONE line
 * ("Wed Oct 14" / "32 openings"), 4px of padding top and bottom and the
 * 1px border. Zocdoc's phone tile, and what lets the first search result fit
 * above the bottom nav with the sheet at HALF (the four-line cell was 106px
 * of a 292px card). The phone search list only: see `compact` on
 * AvailabilityCalendar.
 */
export const COMPACT_CELL_HEIGHT = 52;

/** Widest viewport the compact cell applies at (the search sheet's). */
export const COMPACT_MAX_WIDTH = 768;

/**
 * Width one column gets if `containerWidth` is split into `columns`.
 * Returns null when the container has not been measured yet.
 */
export function columnWidth(
  containerWidth,
  columns = COLUMNS,
  gap = COLUMN_GAP,
) {
  if (!containerWidth || containerWidth <= 0) return null;
  if (columns <= 0) return null;
  return (containerWidth - gap * (columns - 1)) / columns;
}

/**
 * "grid" | "narrow" for a measured container width.
 *
 * `layout` lets the caller state the answer outright, which the search card
 * needs: when the card stacks, the calendar sits *under* the provider info
 * rather than beside it, and a stacked calendar is always the scrolling row
 * even though it spans the full card and is therefore plenty wide. Width
 * alone cannot tell those two cases apart.
 *
 * Unmeasured (SSR, first paint) resolves to "grid" so the server markup
 * matches the desktop case and hydration only ever narrows.
 */
export function layoutTier(containerWidth, layout = "auto") {
  if (layout === "grid") return "grid";
  if (layout === "strip") return "narrow";
  const col = columnWidth(containerWidth);
  if (col === null) return "grid";
  return col >= GRID_MIN_COL_WIDTH ? "grid" : "narrow";
}

/**
 * Collapses each run of two or more consecutive unavailable days into a
 * single cell. Available days always pass through untouched.
 *
 * @param {Array} days - [{ dateKey, date, state, slotCount, scheduled, isToday }]
 * @returns {Array} cells - same shape plus `dates: [...]`, the days it covers
 */
export function mergeUnavailableRuns(days) {
  if (!Array.isArray(days) || days.length === 0) return [];

  const cells = [];
  for (let i = 0; i < days.length; i++) {
    const day = days[i];

    if (day.state === "available") {
      cells.push({ ...day, dates: [day] });
      continue;
    }

    let end = i;
    while (end + 1 < days.length && days[end + 1].state !== "available") {
      end += 1;
    }

    if (end === i) {
      cells.push({ ...day, dates: [day] });
    } else {
      const run = days.slice(i, end + 1);
      cells.push({
        dateKey: day.dateKey,
        date: day.date,
        state: "unavailable",
        slotCount: 0,
        // A range is "scheduled" if the provider works *any* day in it, so a
        // merged run never claims they are entirely off when they are not.
        scheduled: run.some((d) => Boolean(d.scheduled)),
        isToday: Boolean(day.isToday),
        dates: run,
      });
      i = end;
    }
  }

  return cells;
}

/**
 * "Today" for the current day, the weekday name for every other day.
 * Deliberately no "Tomorrow": Zocdoc uses it, but one relative label is
 * enough to anchor the row, and a second makes the first two cells read
 * inconsistently with the rest.
 *
 * Both arguments are moments already normalised to start-of-day.
 */
export function relativeWeekday(date, today) {
  if (!date || !today) return "";
  return date.isSame(today, "day") ? "Today" : date.format("ddd");
}

/**
 * Weekday line of a cell: "Today" or "Thu" for one day, "Thu - Sun" for a
 * merged run.
 *
 * A RANGE NEVER SAYS "TODAY". A single cell for the current day is precisely
 * today, and the relative word is what anchors the row. A run that merely
 * *begins* today is not — "Today - Sun" reads as though today were the whole
 * stretch, and it is the longest label this module can produce, so in a
 * fixed-width grid column it also clipped mid-word ("Today - Wec"). The
 * leading weekday is both truer and shorter.
 */
export function cellWeekdayLabel(cell, today) {
  const dates = cell?.dates?.length ? cell.dates : [cell];
  const first = dates[0]?.date;
  const last = dates[dates.length - 1]?.date;
  if (!first) return "";
  if (dates.length === 1) return relativeWeekday(first, today);
  return `${first.format("ddd")} - ${last.format("ddd")}`;
}

/**
 * Date line of a cell: "Aug 6", "Aug 10 - 13" within one month, or
 * "Aug 30 - Sep 2" across a month boundary.
 */
export function cellDateLabel(cell) {
  const dates = cell?.dates?.length ? cell.dates : [cell];
  const first = dates[0]?.date;
  const last = dates[dates.length - 1]?.date;
  if (!first) return "";
  if (dates.length === 1) return first.format("MMM D");
  return first.month() === last.month()
    ? `${first.format("MMM D")} - ${last.format("D")}`
    : `${first.format("MMM D")} - ${last.format("MMM D")}`;
}

/**
 * Slot count split into its emphasised value and its unit, so the cell can
 * weight them differently the way the profile grid always has.
 *
 * The unit reads "openings", not "slots": the cell counts unbooked time, and
 * "opening" says that in a word that stays true once the directory carries
 * professions that never hold a consult. "Slot" stays the internal name for
 * the inventory unit — only the label someone reads changed.
 *
 * A day with nothing to book reads "No openings" whether or not the provider
 * works that day (owner, 2026-10-26). It used to read "0 openings" when they
 * did, which sat beside "No openings" in one grid as two words for the same
 * thing to the person booking.
 */
export function cellSlotsParts(cell) {
  if (cell?.state === "available") {
    const n = Number(cell.slotCount) || 0;
    return { value: String(n), unit: n === 1 ? "opening" : "openings" };
  }
  return { value: "No", unit: "openings" };
}

/** Flattened form of {@link cellSlotsParts}, for assertions and a11y labels. */
export function cellSlotsText(cell) {
  const { value, unit } = cellSlotsParts(cell);
  return unit ? `${value} ${unit}` : value;
}

/**
 * Zeroes every day in the window, for a provider who cannot be booked at all.
 *
 * NO NEW CELL STATE, AND NO NEW SHAPE. The card's whole defect was counting
 * openings a visitor could not actually book; the fix is to stop counting them,
 * not to invent a second way for a calendar to look. So the verdict lands as
 * data — `slotCount: 0`, `scheduled: false`, `state: "unavailable"` — and every
 * rule already in this module takes it from there: the cells read "No
 * openings", the grid lays out thirteen of them plus More across its 7x2, and
 * the strip merges the dead run into one wide cell the way it merges any other.
 *
 * Two earlier attempts here each invented something instead: a single
 * row-spanning cell, then a per-day "unbookable" state reading "Unavailable"
 * with a row cap to match. Both replaced a working design with a second one
 * that only this case used, which is how a card ends up looking like it failed
 * to load.
 */
export function unbookableDays(days) {
  const list = Array.isArray(days) ? days : [];
  return list.map((day) => ({
    ...day,
    state: "unavailable",
    slotCount: 0,
    scheduled: false,
  }));
}

/**
 * THE SEARCH CARD'S ROW FITS THE CARD (owner, 2026-10-26, after Zocdoc's
 * /searchai card, whose tile is exactly 100px on an 8px gap at every width).
 * A tile is FIT_MIN_CELL_WIDTH wide, never wider ("capped at the same width
 * Zocdoc is capped at. Including the individual day slots"), so the number of
 * days follows the row's width: as many whole tiles as fit, then the trailing
 * More, and the spare (less than one tile) sits after it.
 *
 * Below FIT_MIN_SLOTS (three days and More, 424px) the row scrolls instead,
 * at the same width -- a phone, where Zocdoc scrolls too. Zocdoc scrolls at
 * every width and cuts the last tile at the card's edge; we only scroll where
 * the floor cannot fit, so a desktop card never shows half a day.
 */
export const FIT_MIN_CELL_WIDTH = 100;
export const FIT_MIN_SLOTS = 4;

/**
 * { mode, dayCount } for a fitted row `rowWidth` wide (its content box).
 * "fit": `dayCount` days and the trailing cell, whole. "scroll": the
 * row is too narrow for FIT_MIN_SLOTS, so it shows up to MAX_STRIP_CELLS days
 * at the minimum width and scrolls. Unmeasured (SSR, first paint) is
 * "scroll", the phone's answer; the desktop narrows nothing on hydration,
 * it only lays the same tiles out wider.
 */
export function fitLayout(rowWidth, cellCount, hasTrailing = true) {
  const trailing = hasTrailing ? 1 : 0;
  const slots =
    rowWidth > 0
      ? Math.floor((rowWidth + COLUMN_GAP) / (FIT_MIN_CELL_WIDTH + COLUMN_GAP))
      : 0;
  if (slots < FIT_MIN_SLOTS) {
    return { mode: "scroll", dayCount: Math.min(MAX_STRIP_CELLS, cellCount) };
  }
  return { mode: "fit", dayCount: Math.min(slots - trailing, cellCount) };
}
