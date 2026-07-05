"use client";

import { motion, useReducedMotion } from "motion/react";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import { BorderBeam } from "@/components/magicui/border-beam";

import type { ItineraryItem, Trip } from "../_data/trips";
import { TripParallaxLayer } from "./trip-parallax-layer";
import { TripScheduleTransitionLink } from "./trip-schedule-transition-link";

export function TripHero({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  return (
    <section
      className="relative overflow-hidden rounded-[1.75rem]"
      data-trip-hero
    >
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative min-h-[33rem] overflow-hidden border border-white/70 bg-[radial-gradient(circle_at_8%_6%,rgba(248,113,113,0.34),transparent_30%),radial-gradient(circle_at_95%_0%,rgba(37,99,235,0.22),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,247,246,0.86))] px-5 pt-6 pb-4 shadow-xl"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
        transition={{ delay: 0.08, duration: 0.6, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute top-24 -right-10 size-36 rounded-full border border-neutral-950/10" />
        <div className="pointer-events-none absolute bottom-28 left-5 h-24 w-px bg-[linear-gradient(180deg,#ef4444,#2563eb)]" />

        {prefersReducedMotion ? null : (
          <BorderBeam
            borderWidth={1.2}
            colorFrom="#ef4444"
            colorTo="#2563eb"
            duration={9}
            size={120}
          />
        )}

        <TripParallaxLayer className="relative z-10" speed={8}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black tracking-[0.26em] text-neutral-500 uppercase">
              date invitation
            </p>
            <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-black text-neutral-500 shadow-sm ring-1 ring-neutral-950/5 backdrop-blur">
              07.10 - 07.12
            </span>
          </div>

          <h1 className="mt-5 min-h-28 max-w-[14rem] text-[3.65rem] leading-[0.86] font-black tracking-normal text-balance text-neutral-950">
            {prefersReducedMotion ? (
              trip.title
            ) : (
              <DiaTextReveal
                colors={["#ef4444", "#f97316", "#2563eb", "#111827"]}
                delay={0.12}
                duration={1.2}
                text={trip.title}
              />
            )}
          </h1>

          <p className="mt-5 max-w-[17rem] text-[15px] leading-7 font-bold text-neutral-600">
            {trip.subtitle}
          </p>
        </TripParallaxLayer>

        <TripParallaxLayer className="relative z-10 mt-8" speed={-8}>
          <HeroBoardingPass outbound={outbound} />
        </TripParallaxLayer>

        <TripParallaxLayer className="relative z-10 mt-4" speed={6}>
          <TripScheduleTransitionLink
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-black text-white shadow-lg shadow-neutral-950/15 transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none"
            href={`/trip/${trip.slug}/schedule`}
          >
            일정 자세히 보기
          </TripScheduleTransitionLink>
        </TripParallaxLayer>
      </motion.div>
    </section>
  );
}

function HeroBoardingPass({
  outbound,
}: {
  outbound: ItineraryItem | undefined;
}) {
  const train = outbound?.train;

  return (
    <article className="relative overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-white/92 p-4 text-neutral-950 shadow-[0_24px_70px_rgba(15,23,42,0.13)] backdrop-blur">
      <div className="pointer-events-none absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-[rgb(248,248,247)] shadow-inner" />
      <div className="pointer-events-none absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-[rgb(248,248,247)] shadow-inner" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.28em] text-neutral-500 uppercase">
            boarding pass
          </p>
          <h2 className="mt-2 truncate text-2xl leading-none font-black tracking-normal">
            {train?.from ?? "용산"} → {train?.to ?? "전주"}
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-950 px-3 py-1.5 text-[11px] font-black text-white">
          {train?.number ?? "KTX"}
        </span>
      </div>

      <div className="my-4 h-px bg-[linear-gradient(90deg,rgba(15,23,42,0.15)_50%,transparent_0)] [background-size:10px_1px]" />

      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] text-neutral-400 uppercase">
            from
          </p>
          <p className="mt-2 text-4xl leading-none font-black tracking-normal">
            {train?.from ?? "용산"}
          </p>
          <p className="mt-1 text-xs font-black text-neutral-500">
            {outbound?.startsAt ?? "20:09"}
          </p>
        </div>

        <div className="grid size-9 place-items-center rounded-full bg-red-50 text-lg font-black text-red-500">
          →
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black tracking-[0.22em] text-neutral-400 uppercase">
            to
          </p>
          <p className="mt-2 text-4xl leading-none font-black tracking-normal">
            {train?.to ?? "전주"}
          </p>
          <p className="mt-1 text-xs font-black text-neutral-500">
            {outbound?.endsAt ?? "21:47"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-neutral-950/[0.04] px-3 py-2">
        <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
          {train?.car ?? "14호차"}
        </p>
        <p className="text-sm font-black">
          {train?.seats.join(" · ") ?? "1A · 1B"}
        </p>
      </div>
    </article>
  );
}
