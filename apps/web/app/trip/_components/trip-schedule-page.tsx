"use client";

import * as React from "react";
import Link from "next/link";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import GradualBlur from "@/components/GradualBlur";
import { TransitionPanel } from "@/components/motion-primitives/transition-panel";

import type { Trip, TripDayId } from "../_data/trips";
import {
  getItineraryByDay,
  getQuickLinks,
  tripDayOptions,
} from "../_lib/itinerary";
import { TripDateSegmentedNav } from "./trip-date-segmented-nav";
import { TripMapPanel } from "./trip-map-panel";
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
  const activeDayIndex = Math.max(
    0,
    tripDayOptions.findIndex((option) => option.id === activeDay),
  );
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
              <h1 className="truncate text-lg font-semibold">
                <DiaTextReveal
                  colors={["#ef4444", "#f97316", "#2563eb"]}
                  duration={1.2}
                  text={trip.title}
                />
              </h1>
            </div>
          </header>

          <TripMapPanel activeItemId={activeItemId} trip={trip} />

          <div className="mt-3">
            <TripDateSegmentedNav
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

        <div className="overflow-hidden py-4">
          <TransitionPanel
            activeIndex={activeDayIndex}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            variants={{
              enter: { opacity: 0, y: -28, filter: "blur(4px)" },
              center: { opacity: 1, y: 0, filter: "blur(0px)" },
              exit: { opacity: 0, y: 28, filter: "blur(4px)" },
            }}
          >
            {tripDayOptions.map((option) => (
              <TripTimeline
                activeItemId={activeItemId}
                items={
                  option.id === activeDay
                    ? items
                    : getItineraryByDay(trip, option.id)
                }
                key={option.id}
                onActiveItemChange={setSelectedItemId}
                trip={trip}
              />
            ))}
          </TransitionPanel>
        </div>
      </section>
      <GradualBlur
        animated="scroll"
        curve="bezier"
        divCount={9}
        height="7rem"
        mobileHeight="7rem"
        opacity={0.96}
        position="bottom"
        responsive
        strength={2.8}
        target="page"
        zIndex={40}
      />
    </main>
  );
}
