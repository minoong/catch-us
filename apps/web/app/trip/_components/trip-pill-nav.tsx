"use client";

import type { TripDayId } from "../_data/trips";

export function TripPillNav({
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
      className="bg-background/80 flex gap-2 overflow-x-auto rounded-full border p-1"
    >
      {options.map((option) => (
        <button
          aria-pressed={activeDay === option.id}
          className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground h-10 shrink-0 rounded-full px-4 text-sm font-semibold"
          data-active={activeDay === option.id}
          key={option.id}
          onClick={() => onChange(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </nav>
  );
}
