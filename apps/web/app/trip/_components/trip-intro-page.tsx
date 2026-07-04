"use client";

import * as React from "react";
import { LayoutGroup, useReducedMotion } from "motion/react";

import type { Trip } from "../_data/trips";
import { TripBentoGrid } from "./trip-bento-grid";
import { TripHero } from "./trip-hero";
import { TripIntroHeader } from "./trip-intro-header";
import { TripIntroTransition } from "./trip-intro-transition";
import { TripLenisProvider } from "./trip-lenis-provider";
import { TripPhotoMarquee } from "./trip-photo-marquee";
import { TripStoryStack } from "./trip-story-stack";
import { TripTimeControlStrip } from "./trip-time-control-strip";

export function TripIntroPage({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [introComplete, setIntroComplete] =
    React.useState(prefersReducedMotion);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setTimeout(() => setIntroComplete(true), 2150);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <TripLenisProvider>
      <LayoutGroup>
        <main className="bg-background text-foreground min-h-screen overflow-hidden pb-8">
          <TripIntroTransition introComplete={introComplete} trip={trip} />
          <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-3 sm:max-w-lg">
            <TripIntroHeader compactVisible={introComplete} trip={trip} />
            <TripTimeControlStrip trip={trip} />
            <TripHero trip={trip} />
            <TripPhotoMarquee trip={trip} />
            <TripBentoGrid trip={trip} />
            <TripStoryStack trip={trip} />
          </section>
        </main>
      </LayoutGroup>
    </TripLenisProvider>
  );
}
