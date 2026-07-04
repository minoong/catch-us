"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import type { Trip } from "../_data/trips";

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
      className="sticky top-0 z-40 -mx-4 px-4 pt-[var(--trip-intro-header-pt)]"
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
      <div className="flex items-center justify-between rounded-[var(--trip-intro-header-radius)] border border-white/70 bg-white/86 px-[var(--trip-intro-header-px)] py-[var(--trip-intro-header-py)] shadow-lg backdrop-blur-xl">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.28em] text-neutral-500 uppercase">
            Jeonju 2026
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            {compactVisible ? (
              <motion.p
                className="truncate font-black tracking-[-0.04em] text-neutral-950"
                layoutId="trip-intro-title"
                style={{ fontSize: "var(--trip-intro-title-size)" }}
                transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
              >
                <DiaTextReveal
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
        <Link
          className="bg-primary text-primary-foreground inline-flex h-[var(--trip-intro-cta-height)] shrink-0 items-center justify-center rounded-full px-3 text-xs font-black"
          href={`/trip/${trip.slug}/schedule`}
        >
          일정
        </Link>
      </div>
    </header>
  );
}
