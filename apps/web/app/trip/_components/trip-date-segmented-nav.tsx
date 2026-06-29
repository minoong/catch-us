"use client";

import { motion } from "motion/react";

import type { TripDayId } from "../_data/trips";

export function TripDateSegmentedNav({
  activeDay,
  onChange,
  options,
}: {
  activeDay: TripDayId;
  onChange: (day: TripDayId) => void;
  options: { id: TripDayId; label: string }[];
}) {
  return (
    <nav
      aria-label="여행 날짜 필터"
      className="relative grid grid-cols-4 gap-1 rounded-full border-2 border-neutral-950 bg-white p-1 shadow-sm backdrop-blur"
    >
      {options.map((option) => {
        const active = activeDay === option.id;

        return (
          <button
            aria-pressed={active}
            className="relative h-10 rounded-full px-3 text-sm font-black text-neutral-950 transition active:scale-[0.98]"
            data-active={active}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {active ? (
              <motion.span
                className="absolute inset-0 rounded-full bg-neutral-950 shadow-sm"
                layoutId="trip-date-tab-cursor"
                transition={{ duration: 0.24, ease: "easeInOut" }}
              />
            ) : null}
            <span className="relative z-10 text-white mix-blend-difference">
              {option.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
