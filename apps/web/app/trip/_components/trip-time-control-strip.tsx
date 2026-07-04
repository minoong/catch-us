"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { SlidingNumber } from "@/components/core/sliding-number";

import type { Trip } from "../_data/trips";

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

function formatAccessibleDuration(parts: ReturnType<typeof splitDuration>) {
  return `${parts.days}일 ${formatTimeUnit(parts.hours, true)}시 ${formatTimeUnit(
    parts.minutes,
    true,
  )}분 ${formatTimeUnit(parts.seconds, true)}초`;
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
      <section className="rounded-[1.4rem] border border-white/70 bg-white/82 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-[11px] font-black tracking-[0.2em] text-neutral-500 uppercase">
          trip clock
        </p>
        <p className="mt-1 text-sm font-black text-neutral-950">여행 준비 중</p>
      </section>
    );
  }

  if (!now) {
    return (
      <section className="h-[5.5rem] rounded-[1.4rem] border border-white/70 bg-white/70 shadow-sm backdrop-blur" />
    );
  }

  const delta = departure.getTime() - now.getTime();
  const beforeDeparture = delta > 0;
  const parts = splitDuration(delta);
  const accessibleDuration = formatAccessibleDuration(parts);

  return (
    <section className="rounded-[1.4rem] border border-white/70 bg-white/86 px-4 py-3 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] text-red-500 uppercase">
            trip clock
          </p>
          <h2 className="mt-1 text-sm font-black text-neutral-950">
            {beforeDeparture ? "용산역 출발까지" : "여행 시작 후"}
          </h2>
        </div>
        <p className="rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-black text-white">
          KTX 521
        </p>
      </div>

      <p className="sr-only">{accessibleDuration}</p>
      <div
        aria-hidden="true"
        className="mt-3 grid grid-cols-4 gap-2 font-mono text-neutral-950"
      >
        <TimeUnit
          label="일"
          prefersReducedMotion={prefersReducedMotion}
          value={parts.days}
        />
        <TimeUnit
          label="시"
          prefersReducedMotion={prefersReducedMotion}
          value={parts.hours}
          padStart
        />
        <TimeUnit
          label="분"
          prefersReducedMotion={prefersReducedMotion}
          value={parts.minutes}
          padStart
        />
        <TimeUnit
          label="초"
          prefersReducedMotion={prefersReducedMotion}
          value={parts.seconds}
          padStart
        />
      </div>
    </section>
  );
}

function TimeUnit({
  label,
  padStart = false,
  prefersReducedMotion,
  value,
}: {
  label: string;
  padStart?: boolean;
  prefersReducedMotion: boolean;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-neutral-950/[0.04] px-2 py-2 text-center">
      <div className="flex justify-center text-xl leading-none font-black">
        {prefersReducedMotion ? (
          formatTimeUnit(value, padStart)
        ) : (
          <SlidingNumber padStart={padStart} value={value} />
        )}
      </div>
      <p className="mt-1 text-[10px] font-black text-neutral-500">{label}</p>
    </div>
  );
}
