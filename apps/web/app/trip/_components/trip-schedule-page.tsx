"use client";

import * as React from "react";
import Link from "next/link";

import type { Trip, TripDayId } from "../_data/trips";
import { getItineraryByDay, tripDayOptions } from "../_lib/itinerary";

export function TripSchedulePage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = React.useState<TripDayId>("all");
  const items = getItineraryByDay(trip, activeDay);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-4 sm:max-w-lg">
        <header className="bg-background/90 sticky top-0 z-20 pb-3 backdrop-blur">
          <Link
            className="text-muted-foreground text-sm"
            href={`/trip/${trip.slug}`}
          >
            ← 인트로
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {trip.title}
          </h1>
          <nav
            aria-label="여행 날짜 필터"
            className="mt-3 flex gap-2 overflow-x-auto"
          >
            {tripDayOptions.map((option) => (
              <button
                aria-pressed={activeDay === option.id}
                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground rounded-full border px-4 py-2 text-sm"
                data-active={activeDay === option.id}
                key={option.id}
                onClick={() => setActiveDay(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </nav>
        </header>
        <div className="grid gap-3 py-4">
          {items.map((item) => (
            <article className="rounded-3xl border p-4" key={item.id}>
              <p className="text-muted-foreground text-xs">{item.day}</p>
              <h2 className="mt-1 font-semibold">{item.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
