"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { SlidingNumber } from "@/components/core/sliding-number";
import { MorphingText } from "@repo/ui/components/morphing-text";

import type { Trip } from "../_data/trips";

const TRIP_CLOCK_TEXTS = [
  "가현쨩과 미누쿤의 전주 여행",
  "이쿠죠!!!",
  "여자에게 최고의 화장은 미소!",
];

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

function parseTripDeparture(trip: Trip): Date | null {
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  if (!outbound?.startsAt) return null;
  return new Date(`${outbound.day}T${outbound.startsAt}:00+09:00`);
}

function splitDuration(value: number) {
  const absolute = Math.max(Math.abs(value), 0);
  const days = Math.floor(absolute / MS_PER_DAY);
  const hours = Math.floor((absolute % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((absolute % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((absolute % MS_PER_MINUTE) / MS_PER_SECOND);

  return { days, hours, minutes, seconds };
}

function formatTimeUnit(value: number, padStart = false) {
  const text = value.toString();
  return padStart && value < 10 ? `0${text}` : text;
}

export function TripTimeControlStrip({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [now, setNow] = React.useState<Date | null>(null);
  const departure = React.useMemo(() => parseTripDeparture(trip), [trip]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setNow(new Date()), 0);
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  if (!departure) {
    return (
      <section className="rounded-full border border-white/70 bg-white/86 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-xs font-black text-neutral-950">여행 준비 중</p>
      </section>
    );
  }

  if (!now) {
    return (
      <section className="h-14 rounded-full border border-white/70 bg-white/70 shadow-sm backdrop-blur" />
    );
  }

  const delta = departure.getTime() - now.getTime();
  const parts = splitDuration(delta);

  return (
    <section className="rounded-full border border-white/70 bg-white/88 px-4 py-3 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {prefersReducedMotion ? (
            <p className="truncate text-sm leading-none font-black text-neutral-950">
              {TRIP_CLOCK_TEXTS[0]}
            </p>
          ) : (
            <MorphingText
              className="mx-0 h-4 max-w-none overflow-hidden text-left text-xs leading-none font-black whitespace-nowrap text-neutral-950 filter-[url(#threshold)_blur(0.2px)]"
              texts={TRIP_CLOCK_TEXTS}
            />
          )}
        </div>
        <DurationDigits
          parts={parts}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </section>
  );
}

function DurationDigits({
  parts,
  prefersReducedMotion,
}: {
  parts: ReturnType<typeof splitDuration>;
  prefersReducedMotion: boolean;
}) {
  const durationText = `${parts.days}일 ${formatTimeUnit(
    parts.hours,
    true,
  )}:${formatTimeUnit(parts.minutes, true)}:${formatTimeUnit(
    parts.seconds,
    true,
  )}`;

  if (prefersReducedMotion) {
    return (
      <div
        className="font-mono text-xl leading-none font-black text-neutral-950 tabular-nums"
        role="timer"
      >
        {durationText}
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center gap-0.5 font-mono text-xl leading-none font-black text-neutral-950 tabular-nums"
      aria-label={durationText}
      role="timer"
    >
      <span aria-hidden="true" className="flex items-center gap-0.5">
        <SlidingNumber value={parts.days} />
        <span className="text-xs text-neutral-500">일</span>
        <SlidingNumber value={parts.hours} padStart />
        <span className="text-neutral-400">:</span>
        <SlidingNumber value={parts.minutes} padStart />
        <span className="text-neutral-400">:</span>
        <SlidingNumber value={parts.seconds} padStart />
      </span>
    </div>
  );
}
