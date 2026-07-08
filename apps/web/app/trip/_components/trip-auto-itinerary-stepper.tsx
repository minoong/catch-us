"use client";

import Image from "next/image";
import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

import { cn } from "@repo/ui/lib/utils";
import { useInView } from "motion/react";
import { TextEffect } from "../../../components/core/text-effect";

import type { ItineraryItem, Trip } from "../_data/trips";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
}

function getStepperItems(trip: Trip): ItineraryItem[] {
  return trip.itinerary;
}

export function TripAutoItineraryStepper({ trip }: { trip: Trip }) {
  const steps = React.useMemo(() => getStepperItems(trip), [trip]);
  const containerRef = React.useRef<HTMLElement>(null);
  const pathSvgRef = React.useRef<SVGSVGElement>(null);
  const pathLineRef = React.useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion || steps.length === 0) return;

      const movingBox = containerRef.current?.querySelector(".moving-marker");
      const pathSvg = pathSvgRef.current;
      const pathLine = pathLineRef.current;
      const containers = gsap.utils.toArray<HTMLElement>(".step-item");

      if (!movingBox || !pathSvg || !pathLine) return;

      let scrollTl: gsap.core.Timeline | null = null;

      const buildAnimation = () => {
        // 1. Calculate exact coordinates of the dots relative to the SVG container
        const svgRect = pathSvg.getBoundingClientRect();
        const points = containers.map((container) => {
          const marker = container.querySelector(".step-dot") ?? container;
          const r = marker.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - svgRect.left,
            y: r.top + r.height / 2 - svgRect.top,
          };
        });

        // 2. Draw a smooth bezier curve through the points
        let d = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`;
        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          const prev = points[i - 1];
          const cX = ((prev?.x ?? 0) + (p?.x ?? 0)) / 2;
          d += ` C ${cX} ${prev?.y ?? 0}, ${cX} ${p?.y ?? 0}, ${p?.x ?? 0} ${p?.y ?? 0}`;
        }
        pathLine.setAttribute("d", d);

        // 3. Kill old timeline if exists to force motionPath recalculation
        if (scrollTl) {
          scrollTl.kill();
        }

        // 4. Recreate timeline with the fresh path geometry
        scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        scrollTl.to(movingBox, {
          motionPath: {
            path: pathLine,
            align: pathLine,
            alignOrigin: [0.5, 0.5],
          },
          ease: "none",
          duration: 1,
        });
      };

      // Initial build
      buildAnimation();

      // Update path on scroll trigger refresh
      ScrollTrigger.addEventListener("refreshInit", buildAnimation);

      // Dot animations (only created once)
      containers.forEach((container) => {
        const dot = container.querySelector(".step-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0.5, opacity: 0.3 },
            {
              scale: 1.2,
              opacity: 1,
              scrollTrigger: {
                trigger: container,
                start: "top center",
                end: "bottom center",
                scrub: true,
              },
            },
          );
        }
      });

      // ResizeObserver to trigger refresh when layout changes
      let resizeTimer: ReturnType<typeof setTimeout>;
      const ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      });
      if (containerRef.current) {
        ro.observe(containerRef.current);
      }

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", buildAnimation);
        ro.disconnect();
        clearTimeout(resizeTimer);
        if (scrollTl) scrollTl.kill();
      };
    },
    { scope: containerRef, dependencies: [steps] },
  );

  if (steps.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden rounded-[1.75rem] border border-neutral-100 bg-white p-5 pb-20 shadow-xl"
    >
      <div className="mb-8 text-center">
        <p className="text-xs font-black tracking-[0.1em] text-neutral-400 uppercase">
          불을 키고 멀리 떨어져서 보라 해.
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
          전주 지부 출장 루트
        </h2>
      </div>

      <div className="relative mt-10">
        {/* SVG layer for drawing the dashed path */}
        <svg
          ref={pathSvgRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
        >
          <path
            ref={pathLineRef}
            className="stroke-blue-200"
            fill="none"
            strokeDasharray="6 6"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* The Moving Marker */}
        <div className="moving-marker absolute top-0 left-0 z-30 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <Image
            src="/trips/jeonju-2026/meta/favicon.png"
            alt=""
            fill
            className="rounded-full object-cover"
            sizes="40px"
          />
          <div className="absolute -right-3 -bottom-1 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-100 bg-white text-[13px] shadow-sm">
            🐶
          </div>
        </div>

        {/* The Steps */}
        <div className="relative z-10 flex flex-col gap-24">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={step.id}
                className={cn(
                  "step-item relative w-[75%]",
                  isLeft ? "mr-auto pl-6" : "ml-auto pr-6 text-right",
                )}
              >
                {/* Fixed dot for the step */}
                <div
                  className={cn(
                    "step-dot absolute top-6 size-4 -translate-y-1/2 rounded-full border-4 border-white bg-blue-300 shadow-sm",
                    isLeft
                      ? "left-0 -translate-x-1/2"
                      : "right-0 translate-x-1/2",
                  )}
                />
                <ItineraryStepContent item={step} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ItineraryStepContent({ item }: { item: ItineraryItem }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="flex h-full w-full flex-col text-neutral-950">
      <h3 className="text-[17px] leading-tight font-black tracking-tight text-neutral-900 drop-shadow-sm">
        {item.title}
      </h3>
      <TextEffect
        per="word"
        preset="blur"
        as="p"
        trigger={isInView}
        className="mt-1.5 text-[13px] leading-relaxed font-bold break-keep text-neutral-600 opacity-90"
      >
        {item.description}
      </TextEffect>
    </div>
  );
}
