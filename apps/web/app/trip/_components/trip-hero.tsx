"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import Noise from "@/components/Noise";
import SplitText from "@/components/SplitText";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Backlight } from "@/components/magicui/backlight";

import type { Trip } from "../_data/trips";
import { TripTicketCard } from "./trip-ticket-card";

export function TripHero({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  return (
    <motion.section
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      className="relative min-h-[43.5rem] overflow-hidden rounded-[2.5rem] border bg-[radial-gradient(circle_at_20%_0%,rgba(248,113,113,0.34),transparent_38%),radial-gradient(circle_at_80%_12%,rgba(59,130,246,0.28),transparent_35%),linear-gradient(180deg,var(--card),var(--background))] p-5 shadow-2xl"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {prefersReducedMotion ? null : (
        <Noise patternAlpha={10} patternRefreshInterval={4} />
      )}
      <div className="absolute inset-x-8 top-6 h-40 rounded-full bg-white/30 blur-3xl" />

      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative z-10"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
        transition={{ delay: 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
          Jeonju 2026
        </p>
        <h1 className="mt-5 min-h-36 text-6xl font-semibold tracking-[-0.09em] text-balance">
          {prefersReducedMotion ? (
            <span className="leading-[0.9]">{trip.title}</span>
          ) : (
            <SplitText
              className="leading-[0.9]"
              delay={55}
              duration={0.7}
              ease="power3.out"
              splitType="chars"
              tag="span"
              text={trip.title}
            />
          )}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-6">
          {trip.subtitle}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
            Private trip board
          </span>
          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            KTX · 전주 · 2박 3일
          </span>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Link
            className="bg-primary text-primary-foreground inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-lg"
            href={`/trip/${trip.slug}/schedule`}
          >
            일정 탐색 열기
          </Link>
          <span className="rounded-full border border-white/40 bg-white/70 px-3 py-2 text-[11px] font-bold text-neutral-900 shadow-sm backdrop-blur">
            {prefersReducedMotion ? (
              "용산 → 전주"
            ) : (
              <AnimatedGradientText colorFrom="#ef4444" colorTo="#2563eb">
                용산 → 전주
              </AnimatedGradientText>
            )}
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="absolute inset-x-5 bottom-5 z-10"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 34 }}
        transition={{ delay: 0.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <Backlight blur={12}>
          <div>{outbound ? <TripTicketCard item={outbound} /> : null}</div>
        </Backlight>
      </motion.div>
    </motion.section>
  );
}
