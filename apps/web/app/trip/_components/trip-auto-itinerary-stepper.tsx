"use client";

import Image from "next/image";
import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

import { cn } from "@repo/ui/lib/utils";

import type { ItineraryItem, Trip } from "../_data/trips";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
}

const STEP_IDS = [
  "ktx-521-yongsan-to-jeonju",
  "jeonju-arrival",
  "jeonju-tourist-hotel",
  "day-2-jeondong-cathedral",
  "day-2-deokjin-park",
  "day-2-jinmijip",
  "ktx-510-jeonju-to-yongsan",
] as const;

function getStepperItems(trip: Trip): ItineraryItem[] {
  return STEP_IDS.map((id) =>
    trip.itinerary.find((item) => item.id === id),
  ).filter((item): item is ItineraryItem => Boolean(item));
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
      if (!movingBox) return;

      const svgRect = pathSvgRef.current?.getBoundingClientRect();
      if (!svgRect) return;

      const containers = gsap.utils.toArray<HTMLElement>(".step-item");

      // 1. Calculate exact coordinates of the dots relative to the SVG container
      const points = containers.map((container) => {
        const marker = container.querySelector(".step-dot") ?? container;
        const r = marker.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - svgRect.left,
          y: r.top + r.height / 2 - svgRect.top,
        };
      });

      // 2. Draw a smooth bezier curve through the points
      if (pathLineRef.current) {
        let d = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`;
        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          const prev = points[i - 1];
          const cX = ((prev?.x ?? 0) + (p?.x ?? 0)) / 2;
          d += ` C ${cX} ${prev?.y ?? 0}, ${cX} ${p?.y ?? 0}, ${p?.x ?? 0} ${p?.y ?? 0}`;
        }
        pathLineRef.current.setAttribute("d", d);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1, // smooth scrubbing
          },
        });

        // 3. Move the marker exactly along the drawn SVG path
        tl.to(movingBox, {
          motionPath: {
            path: pathLineRef.current,
            align: pathLineRef.current,
            alignOrigin: [0.5, 0.5],
          },
          ease: "none",
          duration: 1,
        });
      }

      // Also scale up step dots as we pass them
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
    },
    { scope: containerRef },
  );

  if (steps.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden rounded-[1.75rem] border border-neutral-100 bg-white p-5 pb-20 shadow-xl"
    >
      <div className="mb-8 text-center">
        <p className="text-xs font-black tracking-[0.22em] text-neutral-400 uppercase">
          route preview
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-neutral-950">
          우리의 동선
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
  return (
    <div className="text-neutral-950">
      <h3 className="text-lg leading-6 font-black text-neutral-950">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-6 font-semibold text-neutral-500">
        {item.description}
      </p>
    </div>
  );
}
