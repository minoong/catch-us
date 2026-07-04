"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Noise from "@/components/Noise";

import type { Trip } from "../_data/trips";
import {
  TripIntroPhotoFlash,
  type TripIntroFlashImage,
} from "./trip-intro-photo-flash";

const introImages = [
  {
    alt: "성산일출봉과 바다가 내려다보이는 여행 풍경",
    src: "/trips/jeonju-2026/intro/01-sea.jpg",
  },
  {
    alt: "밤하늘을 가르는 불꽃 공연",
    src: "/trips/jeonju-2026/intro/02-fireworks.jpg",
  },
  {
    alt: "별이 촘촘한 밤하늘",
    src: "/trips/jeonju-2026/intro/03-stars.jpg",
  },
  {
    alt: "들판에서 풀을 뜯는 양들",
    src: "/trips/jeonju-2026/intro/04-field.jpg",
  },
] satisfies TripIntroFlashImage[];

export function TripIntroTransition({
  introComplete,
  trip,
}: {
  introComplete: boolean;
  trip: Trip;
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <AnimatePresence mode="popLayout">
      {!introComplete ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-neutral-950 text-white"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <TripIntroPhotoFlash
            active={!introComplete}
            images={introImages}
            reducedMotion={prefersReducedMotion}
          />
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
