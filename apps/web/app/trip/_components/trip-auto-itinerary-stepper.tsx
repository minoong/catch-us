"use client";

import Image from "next/image";
import * as React from "react";
import { useReducedMotion } from "motion/react";

import { Step, Stepper } from "@/components/reactbits/stepper";

import type { ItineraryItem, Trip } from "../_data/trips";

const STEP_DURATION_MS = 5200;
const STEP_IDS = [
  "ktx-521-yongsan-to-jeonju",
  "jeonju-arrival",
  "jeonju-tourist-hotel",
  "day-2-jeondong-cathedral",
  "day-2-deokjin-park",
  "day-2-jinmijip",
  "ktx-510-jeonju-to-yongsan",
] as const;

function getStepperItems(trip: Trip): ItineraryItem[] {
  return STEP_IDS.map((id) =>
    trip.itinerary.find((item) => item.id === id),
  ).filter((item): item is ItineraryItem => Boolean(item));
}

function getItemImage(trip: Trip, item: ItineraryItem) {
  if (!item.placeId) return null;
  return (
    trip.places.find((place) => place.id === item.placeId)?.imageUrl ?? null
  );
}

export function TripAutoItineraryStepper({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const steps = React.useMemo(() => getStepperItems(trip), [trip]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [stepDirection, setStepDirection] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [timerResetKey, setTimerResetKey] = React.useState(0);

  React.useEffect(() => {
    if (steps.length <= 1) return;

    const startedAt = performance.now();
    let frame: number | undefined;
    let interval: number | undefined;
    let timeout: number | undefined;

    const goToNextStep = () => {
      setStepDirection(1);
      setActiveIndex((current) => (current + 1) % steps.length);
      setProgress(0);
    };

    if (prefersReducedMotion) {
      interval = window.setInterval(() => {
        const ratio = Math.min(
          (performance.now() - startedAt) / STEP_DURATION_MS,
          1,
        );
        setProgress(ratio);
      }, 250);
      timeout = window.setTimeout(goToNextStep, STEP_DURATION_MS);

      return () => {
        if (interval !== undefined) window.clearInterval(interval);
        if (timeout !== undefined) window.clearTimeout(timeout);
      };
    }

    const tick = (timestamp: number) => {
      const ratio = Math.min((timestamp - startedAt) / STEP_DURATION_MS, 1);
      setProgress(ratio);

      if (ratio >= 1) {
        goToNextStep();
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [activeIndex, prefersReducedMotion, steps.length, timerResetKey]);

  if (steps.length === 0) return null;

  return (
    <section>
      <Stepper
        currentStep={activeIndex + 1}
        direction={stepDirection}
        initialStep={1}
        onFinalStepCompleted={() => {
          setStepDirection(1);
          setActiveIndex(0);
          setProgress(0);
          setTimerResetKey((current) => current + 1);
        }}
        onStepChange={(step: number) => {
          setStepDirection(step > activeIndex + 1 ? 1 : -1);
          setActiveIndex(step - 1);
          setProgress(0);
          setTimerResetKey((current) => current + 1);
        }}
        backButtonText="Previous"
        nextButtonText="Next"
        disableStepIndicators={false}
      >
        {steps.map((step) => (
          <Step key={step.id}>
            <ItineraryStepContent
              imageUrl={getItemImage(trip, step)}
              item={step}
            />
          </Step>
        ))}
      </Stepper>

      <div className="mx-auto -mt-3 h-2 w-[calc(100%-4rem)] max-w-md overflow-hidden rounded-full bg-neutral-950/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#ef4444,#2563eb)]"
          style={{
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
        />
      </div>
    </section>
  );
}

function ItineraryStepContent({
  imageUrl,
  item,
}: {
  imageUrl: string | null;
  item: ItineraryItem;
}) {
  return (
    <div className="text-neutral-950">
      <h2 className="text-[1.35rem] leading-6 font-black text-neutral-950">
        {item.title}
      </h2>

      {imageUrl ? (
        <div className="relative mt-4 h-[100px] w-full overflow-hidden rounded-[15px] bg-neutral-100">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(max-width: 640px) 320px, 440px"
            src={imageUrl}
          />
        </div>
      ) : null}

      <p className="mt-4 text-sm leading-6 font-semibold text-neutral-500">
        {item.description}
      </p>
    </div>
  );
}
