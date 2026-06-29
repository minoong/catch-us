"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Noise from "@/components/Noise";
import Silk from "@/components/Silk";

import type { Trip } from "../_data/trips";

export function TripIntroTransition({
  introComplete,
  trip,
}: {
  introComplete: boolean;
  trip: Trip;
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence mode="popLayout">
      {!introComplete ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-neutral-950 text-white"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 opacity-85">
            <Silk color="#ef4444" noiseIntensity={0.7} rotation={0.35} />
          </div>
          <Noise patternAlpha={18} patternRefreshInterval={3} />
          <motion.div
            className="relative z-10 text-center"
            exit={{
              opacity: 0.98,
              scale: 0.28,
              x: "-33vw",
              y: "-39vh",
            }}
            layoutId="trip-intro-title"
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-bold tracking-[0.42em] text-white/60 uppercase">
              Catch Us Trip
            </p>
            <p className="mt-4 text-6xl font-black tracking-[-0.09em]">
              Jeonju
            </p>
            <p className="mt-4 text-lg font-black tracking-[-0.06em] text-white/80">
              {trip.title}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
