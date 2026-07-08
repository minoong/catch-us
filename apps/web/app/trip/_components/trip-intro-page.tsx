"use client";

import * as React from "react";
import { LayoutGroup } from "motion/react";

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
  const [introComplete, setIntroComplete] = React.useState(false);
  const completeIntro = React.useCallback(() => setIntroComplete(true), []);

  return (
    <TripLenisProvider>
      <LayoutGroup>
        <main className="bg-background text-foreground min-h-screen pb-28">
          <TripIntroTransition
            introComplete={introComplete}
            onIntroComplete={completeIntro}
            trip={trip}
          />
          <TripIntroHeader compactVisible={introComplete} trip={trip} />
          <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-3">
            <TripHero trip={trip} />
            <TripPhotoMarquee trip={trip} />
            <TripAutoItineraryStepper trip={trip} />
            <TripClosingCta trip={trip} />
          </section>
          {introComplete ? (
            <TripTimeControlStrip
              className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
              trip={trip}
            />
          ) : null}
        </main>
      </LayoutGroup>
    </TripLenisProvider>
  );
}
