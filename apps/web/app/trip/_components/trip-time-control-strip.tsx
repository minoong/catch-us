"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { SlidingNumber } from "@/components/core/sliding-number";
import { ComicText } from "@repo/ui/components/comic-text";
import { MorphingText } from "@repo/ui/components/morphing-text";
import { cn } from "@repo/ui/lib/utils";

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

export function TripTimeControlStrip({
  className,
  trip,
}: {
  className?: string;
  trip: Trip;
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [now, setNow] = React.useState<Date | null>(null);
  const departure = React.useMemo(() => parseTripDeparture(trip), [trip]);
  const shellClassName = cn(
    "rounded-full border border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.68),rgba(255,255,255,0.28)_50%,rgba(255,255,255,0.16))] px-4 py-3 shadow-[0_18px_52px_rgba(15,23,42,0.2),inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-1px_0_rgba(255,255,255,0.24)] backdrop-blur-[22px] backdrop-saturate-200",
    className,
  );

  const motionProps = prefersReducedMotion
    ? {}
    : {
        animate: { opacity: 1, scale: 1, y: 0 },
        initial: { opacity: 0, scale: 0.96, y: 28 },
        transition: {
          damping: 20,
          delay: 0.18,
          stiffness: 260,
          type: "spring" as const,
        },
      };

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
      <motion.section className={shellClassName} {...motionProps}>
        <p className="text-xs font-black text-neutral-950">여행 준비 중</p>
      </motion.section>
    );
  }

  if (!now) {
    return (
      <motion.section
        className={cn("h-14 bg-white/70", shellClassName)}
        {...motionProps}
      />
    );
  }

  const delta = departure.getTime() - now.getTime();
  const beforeDeparture = delta > 0;
  const parts = splitDuration(delta);

  return (
    <motion.section className={shellClassName} {...motionProps}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {prefersReducedMotion ? (
            <p className="truncate text-[15px] leading-none font-black text-neutral-950">
              {TRIP_CLOCK_TEXTS[0]}
            </p>
          ) : (
            <MorphingText
              className="mx-0 !h-5 max-w-none overflow-hidden text-left !text-[15px] leading-none font-black whitespace-nowrap text-neutral-950 filter-[url(#threshold)_blur(0.2px)] md:!h-5 md:!text-[15px] lg:!text-[15px]"
              texts={TRIP_CLOCK_TEXTS}
            />
          )}
        </div>
        <DurationDigits
          comicLabel={beforeDeparture ? "D-DAY" : "ON TRIP"}
          parts={parts}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </motion.section>
  );
}

function DurationDigits({
  comicLabel,
  parts,
  prefersReducedMotion,
}: {
  comicLabel: string;
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
        className="font-mono text-base leading-none font-black text-neutral-950 tabular-nums"
        role="timer"
      >
        {durationText}
      </div>
    );
  }

  return (
    <div
      className="relative flex shrink-0 items-center gap-0.5 font-mono text-base leading-none font-black text-neutral-950 tabular-nums"
      aria-label={durationText}
      role="timer"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-5 -left-4 z-10 -rotate-12 skew-x-[-8deg]"
      >
        <ComicText
          accentColor="#60a5fa"
          className="drop-shadow-sm"
          fillColor="#fff7ed"
          fontSize={0.62}
          shadowColor="#fb7185"
          strokeColor="#171717"
        >
          {comicLabel}
        </ComicText>
      </span>
      <span aria-hidden="true" className="flex items-center gap-0.5">
        <SlidingNumber value={parts.days} />
        <span className="text-[10px] text-neutral-500">일</span>
        <SlidingNumber value={parts.hours} padStart />
        <span className="text-neutral-400">:</span>
        <SlidingNumber value={parts.minutes} padStart />
        <span className="text-neutral-400">:</span>
        <SlidingNumber value={parts.seconds} padStart />
      </span>
    </div>
  );
}
