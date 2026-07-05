"use client";

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

  const active = steps[activeIndex] ?? steps[0];

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
          backButtonText=""
          className="min-h-0 p-0"
          contentClassName="hidden"
          footerClassName="hidden"
          nextButtonProps={{ "aria-hidden": true, tabIndex: -1 }}
          nextButtonText=""
          renderStepIndicator={({ step, currentStep, onStepClick }) => {
            const stepIndex = step - 1;
            const title = steps[stepIndex]?.title ?? `Step ${step}`;
            const isActive = currentStep === step;
            const isComplete = currentStep > step;

            return (
              <button
                type="button"
                aria-current={isActive ? "step" : undefined}
                aria-label={`${title}로 이동`}
                className={[
                  "grid size-8 place-items-center rounded-full text-[11px] font-black transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : isComplete
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-200 text-neutral-500",
                ].join(" ")}
                onClick={() => onStepClick(step)}
              >
                {step}
              </button>
            );
          }}
          stepCircleContainerClassName="max-w-none rounded-none shadow-none"
          stepContainerClassName="px-0 py-0"
        >
          {steps.map((step) => (
            <Step key={step.id}>
              <span className="sr-only">{step.title}</span>
            </Step>
          ))}
        </Stepper>
      </div>

      <article className="mt-4 rounded-[1.5rem] bg-neutral-950 p-4 text-white">
        <p className="text-xs font-black text-white/48">
          {active.startsAt ?? active.day.slice(5)}
        </p>
        <h3 className="mt-2 text-xl font-black tracking-[-0.05em]">
          {active.title}
        </h3>
        <p className="mt-2 text-sm leading-6 font-semibold text-white/68">
          {active.description}
        </p>
      </article>

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
