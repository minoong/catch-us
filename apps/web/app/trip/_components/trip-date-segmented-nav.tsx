"use client";

import * as React from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

import type { TripDayId } from "../_data/trips";

function isTripDayId(value: string | null): value is TripDayId {
  return (
    value === "all" ||
    value === "2026-07-10" ||
    value === "2026-07-11" ||
    value === "2026-07-12"
  );
}

const ALL_TAB_LOTTIE_SRC = "/trips/jeonju-2026/heart-love-trip.lottie";
const ALL_TAB_LOTTIE_HOLD_FRAME = 235;

export function TripDateSegmentedNav({
  activeDay,
  onChange,
  options,
}: {
  activeDay: TripDayId;
  onChange: (day: TripDayId) => void;
  options: { id: TripDayId; label: string }[];
}) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const allTabLottieRef = React.useRef<DotLottie | null>(null);
  const allTabCompleteHandlerRef = React.useRef<(() => void) | null>(null);
  const [labelReplayCounts, setLabelReplayCounts] = React.useState<
    Partial<Record<TripDayId, number>>
  >({});
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.id === activeDay),
  );

  const replayAllTabLottie = React.useCallback(() => {
    const player = allTabLottieRef.current;
    if (!player) return;
    if (prefersReducedMotion) {
      player.setFrame(ALL_TAB_LOTTIE_HOLD_FRAME);
      return;
    }

    player.setFrame(0);
    player.setLoop(false);
    player.play();
  }, [prefersReducedMotion]);

  const setAllTabLottieRef = React.useCallback(
    (player: DotLottie | null) => {
      const previousPlayer = allTabLottieRef.current;
      const previousCompleteHandler = allTabCompleteHandlerRef.current;

      if (previousPlayer && previousCompleteHandler) {
        previousPlayer.removeEventListener("complete", previousCompleteHandler);
      }

      allTabLottieRef.current = player;
      allTabCompleteHandlerRef.current = null;

      if (!player) return;

      const holdVisibleFrame = () => {
        player.setFrame(ALL_TAB_LOTTIE_HOLD_FRAME);
      };

      player.setLoop(false);
      player.addEventListener("complete", holdVisibleFrame);
      allTabCompleteHandlerRef.current = holdVisibleFrame;

      if (prefersReducedMotion) {
        holdVisibleFrame();
      }
    },
    [prefersReducedMotion],
  );

  const replayLabel = React.useCallback((day: TripDayId) => {
    setLabelReplayCounts((counts) => ({
      ...counts,
      [day]: (counts[day] ?? 0) + 1,
    }));
  }, []);

  const selectDay = (day: TripDayId) => {
    if (day === "all") {
      replayAllTabLottie();
    } else {
      replayLabel(day);
    }

    if (day !== activeDay) onChange(day);
  };

  return (
    <div className="rounded-[var(--trip-tab-radius)] bg-rose-50 p-[2px] shadow-sm shadow-rose-950/5 backdrop-blur">
      <nav
        aria-label="여행 날짜 필터"
        className="relative isolate grid grid-cols-4"
      >
        <motion.div
          animate={{
            x: `${activeIndex * 100}%`,
          }}
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-0 w-1/4 rounded-[var(--trip-tab-active-radius)] bg-[linear-gradient(135deg,#fb7185_0%,#f97316_100%)] shadow-[0_10px_24px_rgba(244,63,94,0.22)]"
          initial={false}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
          }
        />
        {options.map((option) => (
          <button
            aria-pressed={activeDay === option.id}
            aria-label={`${option.label} 일정 보기`}
            className={cn(
              "relative z-10 grid place-items-center rounded-[var(--trip-tab-active-radius)] px-[var(--trip-tab-px)] text-center font-black text-rose-500 active:scale-[0.98]",
              activeDay === option.id ? "text-white" : "text-rose-500",
            )}
            data-id={option.id}
            key={option.id}
            onClick={() => {
              if (isTripDayId(option.id)) selectDay(option.id);
            }}
            style={{
              fontSize: "var(--trip-tab-font-size)",
              height: "var(--trip-tab-height)",
            }}
            type="button"
          >
            <span className="relative z-10 grid h-full place-items-center leading-none transition-colors duration-200">
              {option.id === "all" ? (
                <span className="grid size-6 place-items-center overflow-hidden">
                  <span className="sr-only">{option.label}</span>
                  <DotLottieReact
                    aria-hidden="true"
                    autoplay={!prefersReducedMotion}
                    className="block size-6"
                    dotLottieRefCallback={setAllTabLottieRef}
                    loop={false}
                    src={ALL_TAB_LOTTIE_SRC}
                  />
                </span>
              ) : (
                <RollingTabLabel
                  label={option.label}
                  replayCount={labelReplayCounts[option.id] ?? 0}
                />
              )}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function RollingTabLabel({
  label,
  replayCount,
}: {
  label: string;
  replayCount: number;
}) {
  if (replayCount === 0) return <span>{label}</span>;

  return (
    <span
      aria-label={label}
      className="relative inline-grid h-[1em] overflow-hidden align-bottom leading-none"
    >
      <motion.span
        animate={{ y: "-1em" }}
        aria-hidden="true"
        className="col-start-1 row-start-1 flex flex-col will-change-transform"
        initial={{ y: "0em" }}
        key={replayCount}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="block h-[1em] leading-none">{label}</span>
        <span className="block h-[1em] leading-none">{label}</span>
      </motion.span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {label}
      </span>
    </span>
  );
}
