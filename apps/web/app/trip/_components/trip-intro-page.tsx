"use client";

import * as React from "react";
import { LayoutGroup, useReducedMotion } from "motion/react";

import type { Trip } from "../_data/trips";
import { TripAutoItineraryStepper } from "./trip-auto-itinerary-stepper";
import { TripClosingCta } from "./trip-closing-cta";
import { TripHero } from "./trip-hero";
import { TripIntroHeader } from "./trip-intro-header";
import { TripIntroTransition } from "./trip-intro-transition";
import { TripLenisProvider } from "./trip-lenis-provider";
import { TripPhotoMarquee } from "./trip-photo-marquee";
import { TripTimeControlStrip } from "./trip-time-control-strip";

export function TripIntroPage({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [introComplete, setIntroComplete] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(
      () => setIntroComplete(true),
      prefersReducedMotion ? 0 : 2150,
    );
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <TripLenisProvider>
      <LayoutGroup>
        <main className="bg-background text-foreground min-h-screen pb-28">
          <TripIntroTransition introComplete={introComplete} trip={trip} />
          <TripIntroHeader compactVisible={introComplete} trip={trip} />
          <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-3 sm:max-w-lg">
            <TripHero trip={trip} />
            <TripPhotoMarquee trip={trip} />
            <TripAutoItineraryStepper trip={trip} />
            <TripClosingCta trip={trip} />
          </section>
          {introComplete ? (
            <TripTimeControlStrip
              className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 z-50 mx-auto max-w-md sm:max-w-lg"
              trip={trip}
            />
          ) : null}
        </main>
      </LayoutGroup>
    </TripLenisProvider>
  );
}
