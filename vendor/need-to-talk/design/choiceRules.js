/* The option row's rules, in one small module so every list that offers a
 * pick reads the same numbers (owner, 2026-10-08: "options in general
 * always the same kind of styling everywhere ... if they can share tokens
 * that would be better"). The look is the phone's Booking window presets:
 * 15 semibold on a 13/20 row (47 tall), the chosen row banded with the
 * hover fill and checked at 18.
 *
 * Read by components/shared/ChoiceRow (SelectModal's single pick, the value
 * cards' presets), BottomSheetMenu's rows, and StandardMenu when its items
 * present a choice. Before this the same option was 14 regular in a desktop
 * popup, 15 semibold in a phone sheet and 16 regular for one afternoon --
 * three files that agreed only by coincidence. A MENU OF VERBS (Edit,
 * Remove) on desktop keeps its own denser row; a choice never does.
 *
 * The field the pick lands in stays 16 regular (§ Form fields and selects):
 * the list is something to choose from, the field is the content. */
export const CHOICE_LABEL = 15;
export const CHOICE_WEIGHT = 600;
/* A LONG list -- one you search or scroll (insurers, specialties, states,
 * time zones) -- sets its names at the same 15 but regular (owner,
 * 2026-10-11, after Airbnb's notice list beside our insurance list: forty
 * semibold names all shout at once). Regular is 500 in this app. A short
 * pick of a handful keeps CHOICE_WEIGHT. */
export const CHOICE_LIST_WEIGHT = 500;
/* The line under an option's name (a length, a qualifier): a step below. */
export const CHOICE_META = 14;
export const CHOICE_LINE_HEIGHT = 21;
export const CHOICE_PAD_Y = 13;
export const CHOICE_PAD_X = 20;
export const CHOICE_CHECK = 18;
export const CHOICE_CHECK_STROKE = 2.5;
