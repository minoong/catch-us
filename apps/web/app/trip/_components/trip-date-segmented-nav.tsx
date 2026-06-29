"use client";

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
      className="grid grid-cols-4 gap-1 rounded-full border bg-white/86 p-1 shadow-sm backdrop-blur"
    >
      {options.map((option) => {
        const active = activeDay === option.id;

        return (
          <button
            aria-pressed={active}
            className="h-10 rounded-full px-3 text-sm font-black text-neutral-950 transition active:scale-[0.98] data-[active=true]:bg-neutral-950 data-[active=true]:text-white data-[active=true]:shadow-sm"
            data-active={active}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </nav>
  );
}
