"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";

import type { Trip } from "../_data/trips";
import { TripParallaxLayer } from "./trip-parallax-layer";
import { TripTicketCard } from "./trip-ticket-card";

export function TripHero({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  return (
    <section className="relative">
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_10%,rgba(248,113,113,0.24),transparent_32%),radial-gradient(circle_at_88%_0%,rgba(37,99,235,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,244,0.9))] px-5 pt-6 pb-5 shadow-xl"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
        transition={{ delay: 0.08, duration: 0.6, ease: "easeOut" }}
      >
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
          <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
            date invitation
          </p>
          <h1 className="mt-4 min-h-24 text-5xl leading-[0.9] font-black tracking-normal text-balance text-neutral-950">
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
          <p className="mt-4 max-w-sm text-sm leading-6 font-semibold text-neutral-600">
            {trip.subtitle}
          </p>
        </TripParallaxLayer>

        <TripParallaxLayer className="relative z-10 mt-6" speed={-8}>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-neutral-950/10 bg-white/85 p-4 shadow-lg backdrop-blur">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-neutral-950/20 to-transparent" />
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                  boarding pass
                </p>
                <h2 className="mt-1 text-xl font-black tracking-normal text-neutral-950">
                  {outbound?.train?.from ?? "용산"}에서{" "}
                  {outbound?.train?.to ?? "전주"}까지
                </h2>
              </div>
              <div className="rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-black text-white">
                {prefersReducedMotion ? (
                  (outbound?.train?.number ?? "KTX")
                ) : (
                  <AnimatedGradientText colorFrom="#fecaca" colorTo="#bfdbfe">
                    {outbound?.train?.number ?? "KTX"}
                  </AnimatedGradientText>
                )}
              </div>
            </div>
            {outbound ? (
              <TripTicketCard compact item={outbound} />
            ) : (
              <p className="rounded-[1.25rem] bg-neutral-100 px-3 py-4 text-sm font-black text-neutral-950">
                KTX 탑승권을 준비 중입니다.
              </p>
            )}
          </div>
        </TripParallaxLayer>

        <TripParallaxLayer className="relative z-10 mt-5" speed={6}>
          <Link
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-black text-white shadow-lg shadow-neutral-950/15 transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none"
            href={`/trip/${trip.slug}/schedule`}
          >
            일정 자세히 보기
          </Link>
        </TripParallaxLayer>
      </motion.div>
    </section>
  );
}
