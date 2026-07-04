"use client";

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
  return (
    <header className="sticky top-0 z-40 -mx-4 px-4 pt-3">
      <div className="flex items-center justify-between rounded-full border border-white/70 bg-white/82 px-3 py-2 shadow-lg backdrop-blur-xl">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.28em] text-neutral-500 uppercase">
            Jeonju 2026
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            {compactVisible ? (
              <motion.p
                className="truncate text-sm font-black tracking-[-0.04em] text-neutral-950"
                layoutId="trip-intro-title"
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
          className="bg-primary text-primary-foreground inline-flex h-9 shrink-0 items-center justify-center rounded-full px-3 text-xs font-black"
          href={`/trip/${trip.slug}/schedule`}
        >
          일정
        </Link>
      </div>
    </header>
  );
}
