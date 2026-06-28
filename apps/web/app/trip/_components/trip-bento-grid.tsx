"use client";

import {
  BackpackIcon,
  CalendarIcon,
  DrawingPinIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { motion, useReducedMotion } from "motion/react";

import { BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";

import type { Trip } from "../_data/trips";
import { TripGalleryPreview } from "./trip-gallery-preview";

export function TripBentoGrid({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const hotel = trip.places.find(
    (place) => place.id === "jeonju-tourist-hotel",
  );
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );
  const inbound = trip.itinerary.find(
    (item) => item.id === "ktx-510-jeonju-to-yongsan",
  );
  const trainFacts = [outbound, inbound].filter(Boolean).map((item) => (
    <span
      className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-neutral-950 shadow-sm"
      key={item?.id}
    >
      {item?.train?.number} · {item?.startsAt} → {item?.endsAt}
    </span>
  ));

  return (
    <BentoGrid className="auto-rows-auto grid-cols-2 gap-3">
      <motion.article
        className="relative col-span-2 min-h-60 overflow-hidden rounded-[2rem] border bg-[radial-gradient(circle_at_20%_15%,rgba(239,68,68,0.26),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(226,232,240,0.76))] p-5 shadow-sm"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-2xl bg-black text-white">
            <RocketIcon className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-neutral-500 uppercase">
              route
            </p>
            <h2 className="text-xl font-black tracking-[-0.05em] text-neutral-950">
              서울에서 전주까지
            </h2>
          </div>
        </div>
        <div className="relative mt-8 h-24">
          <div className="absolute top-11 right-9 left-9 border-t-2 border-dashed border-neutral-400/80" />
          <div className="absolute top-5 left-0 rounded-full bg-black px-4 py-2 text-xs font-black text-white shadow-lg">
            용산
          </div>
          <div className="absolute top-5 right-0 rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white shadow-lg">
            전주
          </div>
          <div className="absolute top-8 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-white text-sm shadow">
            →
          </div>
        </div>
        {prefersReducedMotion ? (
          <div className="mt-2 flex flex-wrap gap-2">{trainFacts}</div>
        ) : (
          <Marquee className="-mx-5 mt-2 [--duration:16s]">
            {trainFacts}
          </Marquee>
        )}
      </motion.article>

      <motion.article
        className="relative min-h-48 overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(71,85,105,0.78))] p-5 text-white shadow-sm"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      >
        <DrawingPinIcon className="size-6 opacity-80" />
        <p className="mt-7 text-xs font-bold tracking-[0.22em] uppercase opacity-70">
          stay
        </p>
        <h2 className="mt-1 text-lg font-black tracking-[-0.05em]">
          {hotel?.name ?? "전주 숙소"}
        </h2>
        <p className="mt-3 text-xs font-semibold text-white/70">
          체크인 07.10 · 15:00
          <br />
          체크아웃 07.12 · 11:00
        </p>
      </motion.article>

      <motion.article
        className="relative min-h-48 overflow-hidden rounded-[2rem] border bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.38),transparent_46%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.88))] p-5 shadow-sm"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      >
        <CalendarIcon className="size-6 text-neutral-700" />
        <p className="mt-5 text-xs font-bold tracking-[0.22em] text-neutral-500 uppercase">
          timeline
        </p>
        <div className="mt-3 grid gap-2">
          {trip.itinerary.slice(0, 3).map((item) => (
            <div
              className="rounded-2xl bg-white/80 px-3 py-2 text-[11px] font-bold text-neutral-950 shadow-sm"
              key={item.id}
            >
              {item.startsAt ?? item.day.slice(5)} · {item.title}
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        className="relative col-span-2 min-h-56 overflow-hidden rounded-[2rem] border bg-white shadow-sm"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      >
        <TripGalleryPreview reducedMotion={prefersReducedMotion} />
        <div className="absolute right-5 bottom-5 left-5 z-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-neutral-500 uppercase">
              memory board
            </p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.05em] text-neutral-950">
              여행 무드보드
            </h2>
          </div>
          <span className="grid size-11 place-items-center rounded-2xl bg-black text-white">
            <BackpackIcon className="size-5" />
          </span>
        </div>
      </motion.article>
    </BentoGrid>
  );
}
