import Link from "next/link";

import type { Trip } from "../_data/trips";

export function TripIntroPage({ trip }: { trip: Trip }) {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-4 py-4 sm:max-w-lg">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
          Trip intro
        </p>
        <h1 className="text-6xl font-semibold tracking-[-0.09em] text-balance">
          {trip.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-6">
          {trip.subtitle}
        </p>
        <Link
          className="bg-primary text-primary-foreground inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold"
          href={`/trip/${trip.slug}/schedule`}
        >
          일정 탐색 열기
        </Link>
      </section>
    </main>
  );
}
