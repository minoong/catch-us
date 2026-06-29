"use client";

import * as React from "react";

import PillNav from "@/components/PillNav";

import type { TripDayId } from "../_data/trips";

const logoSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="24" fill="#ef4444"/><path d="M14 29c8-10 14-10 20 0" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="18" cy="20" r="3" fill="white"/><circle cx="30" cy="20" r="3" fill="white"/></svg>`,
);

const logoSrc = `data:image/svg+xml;utf8,${logoSvg}`;

export function TripPillNav({
  activeDay,
  onChange,
  options,
}: {
  activeDay: TripDayId;
  onChange: (day: TripDayId) => void;
  options: { id: TripDayId; label: string }[];
}) {
  const navRef = React.useRef<HTMLDivElement>(null);
  const items = options.map((option) => ({
    ariaLabel: `${option.label} 일정 보기`,
    href: `#trip-day-${option.id}`,
    label: option.label,
  }));
  const activeHref = `#trip-day-${activeDay}`;

  React.useEffect(() => {
    const element = navRef.current;
    if (!element) return;

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("#trip-day-")) return;

      const day = href.replace("#trip-day-", "") as TripDayId;
      if (!options.some((option) => option.id === day)) return;

      event.preventDefault();
      onChange(day);
    };

    element.addEventListener("click", handleClick);
    return () => element.removeEventListener("click", handleClick);
  }, [onChange, options]);

  return (
    <div className="relative h-14" ref={navRef}>
      <PillNav
        activeHref={activeHref}
        baseColor="#111827"
        className="!px-0"
        ease="power3.out"
        hoveredPillTextColor="#111827"
        inlineOnMobile
        initialLoadAnimation={false}
        items={items}
        logo={logoSrc}
        logoAlt="Catch Us Trip"
        pillColor="#ffffff"
        pillTextColor="#111827"
      />
    </div>
  );
}
