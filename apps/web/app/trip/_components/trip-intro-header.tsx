"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import type { Trip } from "../_data/trips";
import { TripScheduleTransitionLink } from "./trip-schedule-transition-link";

export function TripIntroHeader({
  compactVisible,
  trip,
}: {
  compactVisible: boolean;
  trip: Trip;
}) {
  const headerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    let frame: number | undefined;
    let lastProgress = -1;

    const setProgressVariables = (progress: number) => {
      const target = headerRef.current;
      if (!target || progress === lastProgress) return;
      lastProgress = progress;

      const lerp = (from: number, to: number) => from + (to - from) * progress;

      target.style.setProperty("--trip-intro-header-pt", `${lerp(12, 6)}px`);
      target.style.setProperty("--trip-intro-header-px", `${lerp(12, 10)}px`);
      target.style.setProperty("--trip-intro-header-py", `${lerp(8, 6)}px`);
      target.style.setProperty(
        "--trip-intro-header-radius",
        `${lerp(999, 18)}px`,
      );
      target.style.setProperty("--trip-intro-title-size", `${lerp(14, 12)}px`);
      target.style.setProperty("--trip-intro-cta-height", `${lerp(36, 30)}px`);
    };

    const updateScrollProgress = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        const rawProgress = Math.min(Math.max(window.scrollY / 128, 0), 1);
        const progress = Number(rawProgress.toFixed(3));

        setProgressVariables(progress);
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 mx-auto w-full max-w-md px-4 pt-[var(--trip-intro-header-pt)] sm:max-w-lg"
      ref={headerRef}
      style={
        {
          "--trip-intro-cta-height": "36px",
          "--trip-intro-header-pt": "12px",
          "--trip-intro-header-px": "12px",
          "--trip-intro-header-py": "8px",
          "--trip-intro-header-radius": "999px",
          "--trip-intro-title-size": "14px",
        } as React.CSSProperties
      }
    >
      <div className="flex min-w-0 items-center justify-between gap-2 overflow-hidden rounded-[var(--trip-intro-header-radius)] border border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.70),rgba(255,255,255,0.30)_48%,rgba(255,255,255,0.18))] px-[var(--trip-intro-header-px)] py-[var(--trip-intro-header-py)] shadow-[0_16px_42px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-1px_0_rgba(255,255,255,0.28)] backdrop-blur-[22px] backdrop-saturate-200">
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-[10px] font-black tracking-[0.28em] text-neutral-500 uppercase">
            Jeonju 2026
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            {compactVisible ? (
              <motion.p
                className="block max-w-full truncate overflow-hidden font-black tracking-[-0.04em] text-neutral-950"
                layoutId="trip-intro-title"
                style={{ fontSize: "var(--trip-intro-title-size)" }}
                transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
              >
                <DiaTextReveal
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  colors={["#ef4444", "#f97316", "#2563eb"]}
                  duration={1.2}
                  text={trip.title}
                />
              </motion.p>
            ) : (
              <span className="block h-4" aria-hidden="true" />
            )}
          </AnimatePresence>
        </div>
        <TripScheduleTransitionLink
          className="h-[var(--trip-intro-cta-height)] w-[4.75rem] shrink-0 rounded-full bg-neutral-950 text-white shadow-sm shadow-neutral-950/20"
          href={`/trip/${trip.slug}/schedule`}
          size="compact"
          variant="dark"
        >
          일정
        </TripScheduleTransitionLink>
      </div>
    </header>
  );
}
