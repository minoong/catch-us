"use client";

import * as React from "react";
import Link from "next/link";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import { TransitionPanel } from "@/components/motion-primitives/transition-panel";

import type { Trip, TripDayId } from "../_data/trips";
import { getItineraryByDay, tripDayOptions } from "../_lib/itinerary";
import { TripDateSegmentedNav } from "./trip-date-segmented-nav";
import { TripMapPanel } from "./trip-map-panel";
import { TripTimeControlStrip } from "./trip-time-control-strip";
import { TripTimeline } from "./trip-timeline";

export function TripSchedulePage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = React.useState<TripDayId>("all");
  const [swipeDirection, setSwipeDirection] = React.useState(1);
  const scheduleTopRef = React.useRef<HTMLDivElement>(null);
  const stickyRef = React.useRef<HTMLDivElement>(null);
  const items = React.useMemo(
    () => getItineraryByDay(trip, activeDay),
    [activeDay, trip],
  );
  const [selectedItemId, setSelectedItemId] = React.useState(
    trip.itinerary[0]?.id ?? "",
  );
  const activeDayIndex = Math.max(
    0,
    tripDayOptions.findIndex((option) => option.id === activeDay),
  );
  const activeItemId = items.some((item) => item.id === selectedItemId)
    ? selectedItemId
    : (items[0]?.id ?? "");

  React.useEffect(() => {
    let frame: number | undefined;
    let lastProgress = -1;

    const setProgressVariables = (progress: number) => {
      const target = stickyRef.current;
      if (!target || progress === lastProgress) return;
      lastProgress = progress;

      const lerp = (from: number, to: number) => from + (to - from) * progress;

      target.style.setProperty("--trip-sticky-radius", `${lerp(0, 28)}px`);
      target.style.setProperty("--trip-sticky-pt", `${lerp(16, 8)}px`);
      target.style.setProperty("--trip-sticky-pb", `${lerp(12, 8)}px`);
      target.style.setProperty("--trip-header-gap", `${lerp(12, 8)}px`);
      target.style.setProperty("--trip-back-size", `${lerp(40, 32)}px`);
      target.style.setProperty("--trip-back-radius", `${lerp(16, 12)}px`);
      target.style.setProperty("--trip-eyebrow-size", `${lerp(12, 10)}px`);
      target.style.setProperty("--trip-title-size", `${lerp(18, 16)}px`);
      target.style.setProperty("--trip-map-mx", `${lerp(0, -16)}px`);
      target.style.setProperty("--trip-map-mt", `${lerp(12, 4)}px`);
      target.style.setProperty("--trip-map-padding", `${lerp(4, 0)}px`);
      target.style.setProperty("--trip-map-radius", `${lerp(30, 0)}px`);
      target.style.setProperty("--trip-map-height", `${lerp(220, 178)}px`);
      target.style.setProperty("--trip-map-inner-radius", `${lerp(28, 0)}px`);
      target.style.setProperty("--trip-tabs-mt", `${lerp(12, 8)}px`);
      target.style.setProperty("--trip-tab-radius", `${lerp(14, 10)}px`);
      target.style.setProperty("--trip-tab-active-radius", `${lerp(12, 8)}px`);
      target.style.setProperty("--trip-tab-height", `${lerp(40, 28)}px`);
      target.style.setProperty("--trip-tab-font-size", `${lerp(14, 11)}px`);
      target.style.setProperty("--trip-tab-px", `${lerp(12, 8)}px`);
    };

    const updateScrollProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        const root = document.documentElement;
        const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 0);
        const nearPageBottom = maxScroll - window.scrollY < 48;
        const rawProgress = nearPageBottom
          ? 1
          : Math.min(Math.max((window.scrollY - 8) / 136, 0), 1);
        const progress = Number(rawProgress.toFixed(3));

        setProgressVariables(progress);
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  function handleDayChange(day: TripDayId) {
    const nextItems = getItineraryByDay(trip, day);
    const nextDayIndex = tripDayOptions.findIndex(
      (option) => option.id === day,
    );

    if (nextDayIndex !== -1 && nextDayIndex !== activeDayIndex) {
      setSwipeDirection(nextDayIndex > activeDayIndex ? 1 : -1);
    }
    setSelectedItemId(nextItems[0]?.id ?? "");
    setActiveDay(day);
    window.requestAnimationFrame(() => {
      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    });
  }

  return (
    <main className="bg-background text-foreground min-h-screen pb-28">
      <section className="mx-auto min-h-screen w-full max-w-md px-4 sm:max-w-lg">
        <div
          className="bg-background/95 sticky top-0 z-30 -mx-4 rounded-b-[var(--trip-sticky-radius)] px-4 pt-[var(--trip-sticky-pt)] pb-[var(--trip-sticky-pb)] shadow-xl backdrop-blur"
          ref={stickyRef}
          style={
            {
              "--trip-back-radius": "16px",
              "--trip-back-size": "40px",
              "--trip-eyebrow-size": "12px",
              "--trip-header-gap": "12px",
              "--trip-map-height": "220px",
              "--trip-map-inner-radius": "28px",
              "--trip-map-mt": "12px",
              "--trip-map-mx": "0px",
              "--trip-map-padding": "4px",
              "--trip-map-radius": "30px",
              "--trip-sticky-pb": "12px",
              "--trip-sticky-pt": "16px",
              "--trip-sticky-radius": "0px",
              "--trip-tab-active-radius": "12px",
              "--trip-tab-font-size": "14px",
              "--trip-tab-height": "40px",
              "--trip-tab-px": "12px",
              "--trip-tab-radius": "14px",
              "--trip-tabs-mt": "12px",
              "--trip-title-size": "18px",
            } as React.CSSProperties
          }
        >
          <header className="relative flex items-center gap-[var(--trip-header-gap)] pr-10">
            <Link
              aria-label="여행 소개로 돌아가기"
              className="grid h-[var(--trip-back-size)] w-[var(--trip-back-size)] place-items-center rounded-[var(--trip-back-radius)] border text-sm"
              href={`/trip/${trip.slug}`}
            >
              ←
            </Link>
            <div className="min-w-0 flex-1">
              <p
                className="text-muted-foreground font-semibold tracking-[0.18em] uppercase"
                style={{ fontSize: "var(--trip-eyebrow-size)" }}
              >
                Jeonju 2026
              </p>
              <h1
                className="truncate leading-none font-semibold"
                style={{ fontSize: "var(--trip-title-size)" }}
              >
                <DiaTextReveal
                  colors={["#ef4444", "#f97316", "#2563eb"]}
                  duration={1.2}
                  text={trip.title}
                />
              </h1>
            </div>
          </header>

          <TripMapPanel
            activeDay={activeDay}
            activeItemId={activeItemId}
            trip={trip}
            visibleItems={items}
          />

          <div className="mt-[var(--trip-tabs-mt)]">
            <TripDateSegmentedNav
              activeDay={activeDay}
              onChange={handleDayChange}
              options={tripDayOptions}
            />
          </div>
        </div>

        <div
          className="-mx-4 overflow-x-clip overflow-y-visible py-3"
          ref={scheduleTopRef}
        >
          <TransitionPanel
            activeIndex={activeDayIndex}
            custom={swipeDirection}
            transition={{
              bounce: 0.18,
              duration: 0.34,
              type: "spring",
            }}
            variants={{
              enter: (direction) => ({
                filter: "blur(3px)",
                opacity: 0,
                x: `${Number(direction) * 18}%`,
              }),
              center: { filter: "blur(0px)", opacity: 1, x: "0%" },
              exit: (direction) => ({
                filter: "blur(3px)",
                opacity: 0,
                x: `${Number(direction) * -18}%`,
              }),
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
      <TripTimeControlStrip
        className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 z-50 mx-auto max-w-md"
        trip={trip}
      />
    </main>
  );
}
