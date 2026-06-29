"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import Aurora from "@/components/Aurora";
import Noise from "@/components/Noise";
import SplitText from "@/components/SplitText";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Backlight } from "@/components/magicui/backlight";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Iphone } from "@/components/magicui/iphone";

import type { Trip } from "../_data/trips";
import { TripParallaxLayer } from "./trip-parallax-layer";
import { TripTicketCard } from "./trip-ticket-card";

export function TripHero({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const beamContainerRef = React.useRef<HTMLDivElement>(null);
  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );
  const hotel = trip.places.find(
    (place) => place.id === "jeonju-tourist-hotel",
  );

  return (
    <section className="relative">
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative min-h-[44rem] overflow-hidden rounded-[2.75rem] border border-white/50 bg-[radial-gradient(circle_at_15%_0%,rgba(248,113,113,0.36),transparent_36%),radial-gradient(circle_at_85%_12%,rgba(59,130,246,0.32),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.84))] p-5 shadow-2xl"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
        transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
      >
        {prefersReducedMotion ? null : (
          <>
            <div className="absolute inset-0 opacity-35">
              <Aurora
                amplitude={0.8}
                blend={0.4}
                colorStops={["#ef4444", "#f97316", "#2563eb"]}
                speed={0.35}
              />
            </div>
            <Noise patternAlpha={8} patternRefreshInterval={4} />
            <BorderBeam
              borderWidth={1.5}
              colorFrom="#ef4444"
              colorTo="#2563eb"
              duration={8}
              size={180}
            />
          </>
        )}

        <TripParallaxLayer className="relative z-10" speed={12}>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
            Jeonju 2026
          </p>
          <h1 className="mt-5 min-h-32 text-6xl font-black tracking-[-0.09em] text-balance text-neutral-950">
            {prefersReducedMotion ? (
              <span className="leading-[0.9]">{trip.title}</span>
            ) : (
              <SplitText
                className="leading-[0.9]"
                delay={42}
                duration={0.64}
                ease="power3.out"
                splitType="chars"
                tag="span"
                text={trip.title}
              />
            )}
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-6 font-medium text-neutral-600">
            {trip.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur">
              Private trip board
            </span>
            <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white shadow-sm">
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
            <span className="rounded-full border border-white/60 bg-white/80 px-3 py-2 text-[11px] font-bold text-neutral-900 shadow-sm backdrop-blur">
              {prefersReducedMotion ? (
                "용산 → 전주"
              ) : (
                <AnimatedGradientText colorFrom="#ef4444" colorTo="#2563eb">
                  용산 → 전주
                </AnimatedGradientText>
              )}
            </span>
          </div>
        </TripParallaxLayer>

        <TripParallaxLayer speed={-14}>
          <div
            className="relative z-10 mt-8 h-48 overflow-hidden rounded-[2rem] border border-white/65 bg-white/58 p-4 shadow-inner backdrop-blur"
            ref={beamContainerRef}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.92),transparent_58%)]" />
            <div
              className="absolute top-9 left-5 grid size-14 place-items-center rounded-3xl bg-neutral-950 text-[11px] font-black text-white shadow-xl"
              ref={fromRef}
            >
              용산
            </div>
            <div
              className="absolute right-5 bottom-9 grid size-14 place-items-center rounded-3xl bg-red-500 text-[11px] font-black text-white shadow-xl"
              ref={toRef}
            >
              전주
            </div>
            {prefersReducedMotion ? null : (
              <AnimatedBeam
                containerRef={beamContainerRef}
                curvature={-46}
                duration={4}
                fromRef={fromRef}
                gradientStartColor="#ef4444"
                gradientStopColor="#2563eb"
                pathColor="#111827"
                pathOpacity={0.15}
                pathWidth={3}
                toRef={toRef}
              />
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-neutral-950 shadow">
              {outbound?.train?.number ?? "KTX"}
            </div>
          </div>
        </TripParallaxLayer>

        <TripParallaxLayer speed={18}>
          <motion.div
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            className="relative z-10 mx-auto mt-6 w-[15.5rem]"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 34 }}
            transition={{ delay: 0.28, duration: 0.7, ease: "easeOut" }}
          >
            <Iphone className="drop-shadow-2xl">
              <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#171717,#020617)] p-6 pt-16 text-white">
                <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-red-500/35 blur-3xl" />
                <p className="relative text-[10px] font-bold tracking-[0.22em] text-white/50 uppercase">
                  trip pass
                </p>
                <h2 className="relative mt-2 text-3xl font-black tracking-[-0.08em]">
                  전주행
                </h2>
                <div className="relative mt-6 rounded-[1.6rem] bg-white p-4 text-neutral-950 shadow-2xl">
                  {outbound ? <TripTicketCard item={outbound} compact /> : null}
                </div>
                <div className="relative mt-4 rounded-3xl bg-white/10 p-4 text-xs font-semibold text-white/78">
                  {hotel?.name ?? "전주 숙소"}
                  <br />
                  07.10 체크인 · 07.12 체크아웃
                </div>
              </div>
            </Iphone>
          </motion.div>
        </TripParallaxLayer>

        <div className="absolute inset-x-5 bottom-5 z-0">
          <Backlight blur={18}>
            <div className="h-24 rounded-full bg-red-400/25" />
          </Backlight>
        </div>
      </motion.div>
    </section>
  );
}
