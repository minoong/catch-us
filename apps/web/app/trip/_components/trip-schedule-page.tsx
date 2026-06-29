"use client";

import * as React from "react";
import Link from "next/link";

import type { Trip, TripDayId } from "../_data/trips";
import {
  getItineraryByDay,
  getQuickLinks,
  tripDayOptions,
} from "../_lib/itinerary";
import { TripMapPanel } from "./trip-map-panel";
import { TripPillNav } from "./trip-pill-nav";
import { TripTimeline } from "./trip-timeline";

export function TripSchedulePage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = React.useState<TripDayId>("all");
  const items = React.useMemo(
    () => getItineraryByDay(trip, activeDay),
    [activeDay, trip],
  );
  const [selectedItemId, setSelectedItemId] = React.useState(
    trip.itinerary[0]?.id ?? "",
  );
  const quickLinks = getQuickLinks(trip);
  const activeItemId = items.some((item) => item.id === selectedItemId)
    ? selectedItemId
    : (items[0]?.id ?? "");

  function scrollToItem(itemId: string) {
    setSelectedItemId(itemId);
    document
      .getElementById(itemId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="mx-auto min-h-screen w-full max-w-md px-4 pb-24 sm:max-w-lg">
        <div className="bg-background/95 sticky top-0 z-30 -mx-4 px-4 pt-4 pb-3 backdrop-blur">
          <header className="flex items-center gap-3">
            <Link
              aria-label="여행 소개로 돌아가기"
              className="grid size-10 place-items-center rounded-2xl border"
              href={`/trip/${trip.slug}`}
            >
              ←
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                Jeonju 2026
              </p>
              <h1 className="truncate text-lg font-semibold">{trip.title}</h1>
            </div>
          </header>

          <TripMapPanel activeItemId={activeItemId} trip={trip} />

          <div className="mt-3">
            <TripPillNav
              activeDay={activeDay}
              onChange={setActiveDay}
              options={tripDayOptions}
            />
          </div>

          <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {quickLinks.map((item) => (
              <button
                className="bg-muted h-9 shrink-0 rounded-full px-3 text-xs font-semibold"
                key={item.id}
                onClick={() => {
                  setActiveDay("all");
                  requestAnimationFrame(() => scrollToItem(item.id));
                }}
                type="button"
              >
                {item.train?.number ?? item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="py-4">
          <TripTimeline
            activeItemId={activeItemId}
            items={items}
            onActiveItemChange={setSelectedItemId}
            trip={trip}
          />
        </div>
      </section>
    </main>
  );
}
