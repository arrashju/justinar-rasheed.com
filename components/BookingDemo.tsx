"use client";

import { useMemo, useState, type ComponentType } from "react";
import moment from "moment-timezone";
import { Open_Sans } from "next/font/google";
import styled, { createGlobalStyle } from "styled-components";
import { color, media, space, type } from "@/styles/tokens";
// Need to Talk's own code, vendored unchanged (vendor/need-to-talk/README.md).
// It is JavaScript, so its props are typed loosely here, where it enters TypeScript.
import CalendarJs, { DEFAULT_DAY_COUNT } from "components/shared/AvailabilityCalendar";
import { AvailabilitySlotChip as ChipJs, AvailabilitySlotRow as RowJs } from "components/shared/AvailabilitySlotChip";
import theme from "library/styled";
import { cssVariablesBlock, darkVariablesBlock } from "vendor/need-to-talk/shared/designTokens";

const AvailabilityCalendar = CalendarJs as unknown as ComponentType<any>;
const AvailabilitySlotChip = ChipJs as unknown as ComponentType<any>;
const AvailabilitySlotRow = RowJs as unknown as ComponentType<any>;

// Need to Talk's typeface, loaded only for the demo.
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", preload: false });

// The product's colour variables. Need to Talk switches dark on an attribute;
// this site follows the system setting, so its dark block sits in the media query.
const ProductTokens = createGlobalStyle`
  ${cssVariablesBlock(":root")}
  @media (prefers-color-scheme: dark) {
    ${darkVariablesBlock(":root")}
  }
`;

// Fictional openings for the next 13 days, the profile grid's window. The pattern
// is fixed so every visitor sees the same calendar; only the dates follow today.
const COUNTS = [0, 3, 2, 0, 4, 1, 0, 0, 3, 2, 0, 2, 1];
const TIMES = ["9:00 am", "10:30 am", "1:00 pm", "2:30 pm", "4:00 pm", "5:30 pm"];

type Day = {
  dateKey: string;
  date: moment.Moment;
  slotCount: number;
  scheduled: boolean;
  state: "available" | "unavailable";
  isToday: boolean;
  times: string[];
};

function buildDays(): Day[] {
  const today = moment().startOf("day");
  return Array.from({ length: DEFAULT_DAY_COUNT }, (_, i) => {
    const date = today.clone().add(i, "days");
    const slotCount = COUNTS[i];
    return {
      dateKey: date.format("MM/DD/YYYY"),
      date,
      slotCount,
      scheduled: slotCount > 0,
      state: slotCount > 0 ? "available" : "unavailable",
      isToday: i === 0,
      // A run of distinct times, started at a different one each day so
      // neighbouring days don't offer the same list.
      times: Array.from({ length: slotCount }, (_, k) => TIMES[(i + k) % TIMES.length]).sort(
        (a, b) => moment(a, "h:mm a").diff(moment(b, "h:mm a")),
      ),
    };
  });
}

export function BookingDemo() {
  const days = useMemo(buildDays, []);
  const firstOpen = days.find((d) => d.slotCount > 0)!;
  const [dayKey, setDayKey] = useState(firstOpen.dateKey);
  const day = days.find((d) => d.dateKey === dayKey) ?? firstOpen;
  // Opening a day picks its first time, as the product does.
  const [time, setTime] = useState(firstOpen.times[0]);
  const [booked, setBooked] = useState(false);

  const pickDay = (cell: { dateKey?: string; dates?: { dateKey: string }[] }) => {
    const key = cell.dateKey ?? cell.dates?.[0]?.dateKey;
    const next = days.find((d) => d.dateKey === key);
    if (!next) return;
    setDayKey(next.dateKey);
    setTime(next.times[0]);
    setBooked(false);
  };

  return (
    <Stage className={openSans.variable}>
      <ProductTokens />
      <Card aria-label="Booking demo">
        <CardHead>
          <CardTitle>Availability</CardTitle>
          <CardNote>{day.date.format("dddd, MMMM D")}</CardNote>
        </CardHead>
        <AvailabilityCalendar
          days={days}
          today={days[0].date}
          tone="warm"
          selectedDateKey={dayKey}
          onSelectDay={pickDay}
        />
        <AvailabilitySlotRow role="radiogroup" aria-label={`Times on ${day.date.format("dddd, MMMM D")}`}>
          {day.times.map((t) => (
            <AvailabilitySlotChip
              key={t}
              type="button"
              role="radio"
              aria-checked={t === time}
              $selected={t === time}
              onClick={() => {
                setTime(t);
                setBooked(false);
              }}
            >
              {t}
            </AvailabilitySlotChip>
          ))}
        </AvailabilitySlotRow>
        <Book type="button" onClick={() => setBooked(true)}>
          Book
        </Book>
        <Status aria-live="polite">
          {booked
            ? `Demo only: nothing was booked. On needtalk.com, ${time} on ${day.date.format("MMM D")} would go on to confirm.`
            : " "}
        </Status>
      </Card>
    </Stage>
  );
}

// The page's own grey plate, so the product card reads as a sample set on it.
const Stage = styled.div`
  padding: ${space(5)} ${space(3)};
  border-radius: 12px;
  background: ${color.surface};
  box-shadow: inset 0 0 0 1px ${color.border};

  ${media.wide} {
    padding: ${space(10)} ${space(8)};
  }
`;

// Below: Need to Talk's roles, so the card is drawn in the product's colours.
const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
  border-radius: ${theme.radius.lg};
  background: ${theme.color.surfaceRaised};
  box-shadow:
    0 0 0 1px ${theme.color.borderCard},
    0 6px 20px ${theme.color.cardShadow};
  color: ${theme.color.textPrimary};
  font-family: ${theme.font.body};
  font-weight: 500;
`;

const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 600;
`;

const CardNote = styled.span`
  font-size: 14px;
  color: ${theme.color.textSecondary};
`;

const Book = styled.button`
  height: 48px;
  border: 0;
  border-radius: ${theme.radius.pill};
  background: ${theme.color.accentFill};
  color: ${theme.color.textOnAccent};
  font-family: ${theme.font.body};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1);

  @media (hover: hover) {
    &:hover {
      background: ${theme.color.accentFillHover};
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.color.textPrimary};
    outline-offset: 2px;
  }
`;

const Status = styled.p`
  margin: -4px 0 0;
  min-height: 20px;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
  color: ${theme.color.textSecondary};
`;

export const BookingDemoCaption = styled.p`
  ${type.small}
  color: ${color.tertiary};
  margin-top: ${space(3)};
`;
