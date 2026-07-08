"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import Noise from "@/components/Noise";
import { AnimatedNumber } from "@/components/core/animated-number";
import { TextEffect } from "@/components/core/text-effect";

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

const datingStartDate = { day: 31, monthIndex: 7, year: 2025 };
const loveBubbleLottieSrc = "/trips/jeonju-2026/love-bubble.lottie";
const countUpDurationMs = 2000;
const reducedMotionCountUpDurationMs = 150;
const countCompletePauseMs = 650;
const createTextEffectVariants = ({
  delayChildren,
  prefersReducedMotion,
}: {
  delayChildren: number;
  prefersReducedMotion: boolean;
}) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: prefersReducedMotion ? 0 : delayChildren,
        staggerChildren: prefersReducedMotion ? 0 : 0.16,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.42,
      },
    },
  },
});

export function TripIntroTransition({
  introComplete,
  onIntroComplete,
  trip,
}: {
  introComplete: boolean;
  onIntroComplete: () => void;
  trip: Trip;
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const durationMs = prefersReducedMotion
    ? reducedMotionCountUpDurationMs
    : countUpDurationMs;
  const coupleTextEffectVariants = React.useMemo(
    () =>
      createTextEffectVariants({
        delayChildren: 0,
        prefersReducedMotion,
      }),
    [prefersReducedMotion],
  );
  const sinceTextEffectVariants = React.useMemo(
    () =>
      createTextEffectVariants({
        delayChildren: 0.42,
        prefersReducedMotion,
      }),
    [prefersReducedMotion],
  );
  const titleTextEffectVariants = React.useMemo(
    () =>
      createTextEffectVariants({
        delayChildren: 0.78,
        prefersReducedMotion,
      }),
    [prefersReducedMotion],
  );
  const datingDayCount = React.useMemo(() => getDatingDayCount(), []);
  const [displayedDayCount, setDisplayedDayCount] = React.useState(0);

  React.useEffect(() => {
    if (introComplete) {
      return;
    }

    const timer = window.setTimeout(() => {
      setDisplayedDayCount(datingDayCount);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [datingDayCount, introComplete]);

  React.useEffect(() => {
    if (introComplete) {
      return;
    }

    const timer = window.setTimeout(
      onIntroComplete,
      durationMs + countCompletePauseMs,
    );
    return () => window.clearTimeout(timer);
  }, [durationMs, introComplete, onIntroComplete]);

  return (
    <AnimatePresence mode="popLayout">
      {!introComplete ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-neutral-950 text-white"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: "easeInOut",
          }}
        >
          <TripIntroPhotoFlash
            active={!introComplete}
            images={introImages}
            reducedMotion={prefersReducedMotion}
          />
          <Noise patternAlpha={18} patternRefreshInterval={3} />
          <motion.div
            className="relative z-10 flex flex-col items-center px-6 pb-28 text-center"
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0.98,
                    scale: 0.28,
                    x: "-33vw",
                    y: "-39vh",
                  }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.58,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <TextEffect
              as="p"
              className="text-sm font-black tracking-[0.14em] text-white/70"
              layoutId="trip-couple-heading"
              per="line"
              segmentWrapperClassName="block overflow-hidden"
              transition={{
                duration: prefersReducedMotion ? 0 : 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              variants={coupleTextEffectVariants}
            >
              가현쨩 ❤️ 미누쿤
            </TextEffect>
            <p
              aria-label={`사귄 지 ${datingDayCount}일`}
              className="mt-5 flex items-end justify-center gap-2 font-black text-white"
            >
              <AnimatedNumber
                className="text-7xl leading-none tracking-normal tabular-nums"
                springOptions={{
                  bounce: 0,
                  duration: durationMs,
                }}
                value={displayedDayCount}
              />
              <span className="pb-2 text-3xl leading-none tracking-normal">
                일
              </span>
            </p>
            <TextEffect
              as="p"
              className="mt-3 text-sm font-bold tracking-[0.16em] text-white/55 uppercase"
              per="line"
              segmentWrapperClassName="block overflow-hidden"
              variants={sinceTextEffectVariants}
            >
              since 2025.08.31
            </TextEffect>
            <TextEffect
              as="p"
              className="mt-5 text-lg font-black tracking-[-0.04em] text-white/80"
              layoutId="trip-title-heading"
              per="line"
              segmentWrapperClassName="block overflow-hidden"
              transition={{
                duration: prefersReducedMotion ? 0 : 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              variants={titleTextEffectVariants}
            >
              {trip.title}
            </TextEffect>
            <div className="pointer-events-none absolute -top-16 left-1/2 z-10 size-36 -translate-x-1/2">
              <DotLottieReact autoplay loop src={loveBubbleLottieSrc} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function getDatingDayCount() {
  const today = getSeoulDateUtcValue(new Date());
  const start = Date.UTC(
    datingStartDate.year,
    datingStartDate.monthIndex,
    datingStartDate.day,
  );

  if (today < start) {
    return 0;
  }

  return Math.floor((today - start) / 86_400_000) + 1;
}

function getSeoulDateUtcValue(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Seoul",
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return Date.UTC(values.year, values.month - 1, values.day);
}
