# Vendored from Need to Talk

The booking picker on the case study runs Need to Talk's own code, copied
unchanged from `arrashju/needtotalk` at `95b223659` (master, Nov 3 2026):

| Here | There |
|---|---|
| `components/shared/AvailabilityCalendar.js` | `apps/web/components/shared/AvailabilityCalendar.js` |
| `components/shared/AvailabilitySlotChip.js` | `apps/web/components/shared/AvailabilitySlotChip.js` |
| `utils/availabilityLayout.js` | `apps/web/utils/availabilityLayout.js` |
| `design/phoneLayout.js`, `design/choiceRules.js` | `apps/web/design/` |
| `shared/designTokens.js` | `shared/designTokens.js` |

Don't edit these files; copy them again from Need to Talk to update. The
files written for this site are the shims: `library/styled.js` (the slice of
the theme the picker reads) and `components/shared/CustomSkeleton.js` (a
plain block instead of MUI's). The import paths resolve through `tsconfig.json`.
