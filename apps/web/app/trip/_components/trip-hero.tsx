"use client";

import * as React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { cn } from "@repo/ui/lib/utils";
import type { ItineraryItem, Trip } from "../_data/trips";
import { TripParallaxLayer } from "./trip-parallax-layer";
import { TripScheduleTransitionLink } from "./trip-schedule-transition-link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function TripHero({
  trip,
  introComplete = true,
}: {
  trip: Trip;
  introComplete?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);

  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );
  const inbound = trip.itinerary.find(
    (item) => item.id === "ktx-510-jeonju-to-yongsan",
  );

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ paused: true, delay: 0.1 });
      tlRef.current = tl;

      // Ticket cards spring up
      tl.from(".ticket-card", {
        y: 150,
        opacity: 0,
        rotation: () => gsap.utils.random(-5, 5),
        duration: 0.9,
        stagger: 0.2,
        ease: "back.out(1.1)",
      });

      // Text reveal for the ticket data
      tl.fromTo(
        ".ticket-reveal",
        { clipPath: "inset(100% 0 0 0)", y: 10 },
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.6",
      );

      // Barcode scan effect
      tl.from(
        ".barcode-pattern",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4",
      );

      // Button fade in
      tl.from(
        ".hero-action-btn",
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3",
      );
    },
    { scope: containerRef },
  );

  React.useEffect(() => {
    if (introComplete && tlRef.current) {
      tlRef.current.play();
    }
  }, [introComplete]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden rounded-[1.75rem]"
      data-trip-hero
    >
      <div className="relative min-h-[35rem] overflow-hidden border border-white/70 bg-[radial-gradient(circle_at_8%_6%,rgba(248,113,113,0.34),transparent_30%),radial-gradient(circle_at_95%_0%,rgba(37,99,235,0.22),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,247,246,0.86))] px-5 pt-8 pb-4 shadow-xl">
        <div className="pointer-events-none absolute top-24 -right-10 size-36 rounded-full border border-neutral-950/10" />
        <div className="pointer-events-none absolute bottom-28 left-5 h-24 w-px bg-[linear-gradient(180deg,#ef4444,#2563eb)]" />

        <div className="flex h-full flex-col items-center">
          <div className="mb-4">
            <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-black text-neutral-500 shadow-sm ring-1 ring-neutral-950/5 backdrop-blur">
              07.10 - 07.12
            </span>
          </div>

          <TripParallaxLayer
            className="relative mt-2 w-full max-w-sm flex-1"
            speed={4}
          >
            {/* Outbound Ticket */}
            <div className="ticket-card relative z-10 w-full -rotate-1">
              <HeroBoardingPass item={outbound} type="outbound" />
            </div>

            {/* Inbound Ticket */}
            <div className="ticket-card relative z-20 -mt-10 w-full rotate-2 shadow-2xl">
              <HeroBoardingPass item={inbound} type="inbound" />
            </div>
          </TripParallaxLayer>

          <TripParallaxLayer
            className="hero-action-btn relative z-30 mt-12 w-full"
            speed={-2}
          >
            <TripScheduleTransitionLink
              className="block h-14 w-full rounded-full shadow-lg shadow-neutral-950/15 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none"
              href={`/trip/${trip.slug}/schedule`}
            >
              <span className="text-lg font-black">일정 자세히 보기</span>
            </TripScheduleTransitionLink>
          </TripParallaxLayer>
        </div>
      </div>
    </section>
  );
}

function HeroBoardingPass({
  item,
  type,
}: {
  item: ItineraryItem | undefined;
  type: "outbound" | "inbound";
}) {
  const train = item?.train;
  const isOutbound = type === "outbound";

  const time = item?.endsAt ?? item?.startsAt;
  const isUsed =
    item?.day && time
      ? new Date() > new Date(`${item.day}T${time}:00+09:00`)
      : false;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-white p-5 text-neutral-950 shadow-[0_24px_50px_rgba(15,23,42,0.12)]",
        isUsed && "opacity-80 grayscale-[0.5]",
      )}
    >
      {/* Hole punches */}
      <div className="pointer-events-none absolute top-[62%] -left-3 size-6 -translate-y-1/2 rounded-full bg-[rgb(244,244,243)] shadow-inner" />
      <div className="pointer-events-none absolute top-[62%] -right-3 size-6 -translate-y-1/2 rounded-full bg-[rgb(244,244,243)] shadow-inner" />

      {isUsed && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-[0.5px]">
          <div className="rotate-[-15deg] rounded-md border-4 border-red-500/80 px-6 py-2 text-3xl font-black tracking-widest text-red-500/80 mix-blend-multiply shadow-sm">
            탑승완료
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "ticket-reveal text-[10px] font-black tracking-[0.28em] uppercase",
              isOutbound ? "text-blue-500" : "text-red-500",
            )}
          >
            {isOutbound ? "가는 표 / outbound" : "오는 표 / inbound"}
          </p>
          <h2 className="ticket-reveal mt-1 truncate text-xl font-black tracking-normal">
            {train?.from ?? "용산"} → {train?.to ?? "전주"}
          </h2>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black text-white",
            isOutbound ? "bg-blue-500" : "bg-red-500",
          )}
        >
          {train?.number ?? "KTX"}
        </span>
      </div>

      {/* Main Info */}
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <p className="ticket-reveal text-[10px] font-black tracking-[0.22em] text-neutral-400 uppercase">
            from
          </p>
          <p className="ticket-reveal mt-1 text-3xl font-black tracking-normal">
            {train?.from ?? "용산"}
          </p>
          <p className="ticket-reveal mt-1 text-xs font-black text-neutral-500">
            {item?.startsAt ?? "20:09"}
          </p>
        </div>

        <div
          className={cn(
            "grid size-8 place-items-center rounded-full text-lg font-black",
            isOutbound ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500",
          )}
        >
          →
        </div>

        <div className="text-right">
          <p className="ticket-reveal text-[10px] font-black tracking-[0.22em] text-neutral-400 uppercase">
            to
          </p>
          <p className="ticket-reveal mt-1 text-3xl font-black tracking-normal">
            {train?.to ?? "전주"}
          </p>
          <p className="ticket-reveal mt-1 text-xs font-black text-neutral-500">
            {item?.endsAt ?? "21:47"}
          </p>
        </div>
      </div>

      {/* Perforation line */}
      <div className="my-5 h-px bg-[linear-gradient(90deg,rgba(15,23,42,0.15)_50%,transparent_0)] [background-size:10px_1px]" />

      {/* Bottom Info & Barcode */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="ticket-reveal text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">
            {train?.car ?? "14호차"}
          </p>
          <p className="ticket-reveal mt-1 text-sm font-black text-neutral-900">
            {train?.seats.join(" · ") ?? "1A · 1B"}
          </p>
        </div>
        <div className="barcode-pattern h-8 w-24 bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_2px,transparent_2px,transparent_4px,#0f172a_4px,#0f172a_5px,transparent_5px,transparent_8px)] opacity-60 mix-blend-multiply" />
      </div>
    </article>
  );
}
