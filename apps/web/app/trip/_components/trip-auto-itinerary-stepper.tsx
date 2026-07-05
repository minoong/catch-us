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
  const [progress, setProgress] = React.useState(0);
  const [timerResetKey, setTimerResetKey] = React.useState(0);

  React.useEffect(() => {
    if (steps.length <= 1) return;

    const startedAt = performance.now();
    let frame: number | undefined;
    let interval: number | undefined;
    let timeout: number | undefined;

    const goToNextStep = () => {
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
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-4 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] text-blue-500 uppercase">
            auto itinerary
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.07em] text-neutral-950">
            다음 장면 미리보기
          </h2>
        </div>
        <span className="rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-black text-white">
          {activeIndex + 1}/{steps.length}
        </span>
      </div>

      <div className="mt-4">
        <Stepper
          key={activeIndex}
          initialStep={activeIndex + 1}
          onStepChange={(step: number) => {
            setActiveIndex(step - 1);
            setProgress(0);
            setTimerResetKey((current) => current + 1);
          }}
          backButtonProps={{ "aria-hidden": true, tabIndex: -1 }}
          backButtonText="이전"
          className="min-h-0 p-0"
          contentClassName="mt-4"
          footerClassName="hidden"
          nextButtonProps={{ "aria-hidden": true, tabIndex: -1 }}
          nextButtonText="다음"
          stepCircleContainerClassName="max-w-none shadow-none"
        >
          {steps.map((step, index) => (
            <Step key={step.id}>
              <ItineraryStepCard
                imageUrl={getItemImage(trip, step)}
                item={step}
                stepNumber={index + 1}
                totalSteps={steps.length}
              />
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-950/10">
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

function ItineraryStepCard({
  imageUrl,
  item,
  stepNumber,
  totalSteps,
}: {
  imageUrl: string | null;
  item: ItineraryItem;
  stepNumber: number;
  totalSteps: number;
}) {
  return (
    <article className="-mx-6 rounded-[1.35rem] bg-white p-3 text-neutral-950 ring-1 ring-neutral-950/8">
      {imageUrl ? (
        <div className="relative h-32 overflow-hidden rounded-[1rem] bg-neutral-100">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(max-width: 640px) 320px, 440px"
            src={imageUrl}
          />
        </div>
      ) : null}

      <div className={imageUrl ? "pt-3" : ""}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-black text-neutral-400">
            {item.startsAt ?? item.day.slice(5)}
          </p>
          <p className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-black text-white">
            {stepNumber}/{totalSteps}
          </p>
        </div>
        <h3 className="mt-2 text-[1.35rem] leading-6 font-black tracking-[-0.05em] text-neutral-950">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-6 font-semibold text-neutral-500">
          {item.description}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            className="rounded-full bg-neutral-950/[0.06] px-2 py-1 text-[10px] font-black text-neutral-500"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
