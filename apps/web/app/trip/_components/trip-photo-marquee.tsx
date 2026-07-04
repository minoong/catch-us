"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";

import { ThreeDMarquee } from "@/components/aceternity/3d-marquee";

import type { Trip } from "../_data/trips";

function getTripImages(trip: Trip) {
  const placeImages = trip.places
    .map((place) => place.imageUrl)
    .filter((image): image is string => Boolean(image));

  return [
    "/trips/jeonju-2026/intro/01-sea.jpg",
    "/trips/jeonju-2026/intro/02-fireworks.jpg",
    "/trips/jeonju-2026/intro/03-stars.jpg",
    "/trips/jeonju-2026/intro/04-field.jpg",
    ...placeImages,
  ];
}

export function TripPhotoMarquee({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const images = getTripImages(trip);

  if (images.length === 0) {
    return (
      <section className="rounded-[2rem] border bg-white p-5 shadow-sm">
        <p className="text-sm font-black text-neutral-950">
          전주 여행 사진을 준비 중입니다.
        </p>
      </section>
    );
  }

  if (prefersReducedMotion) {
    return (
      <section
        aria-labelledby="trip-photo-marquee-title"
        className="overflow-hidden rounded-[2rem] border bg-white shadow-sm"
      >
        <div className="p-5 pb-3">
          <p className="text-xs font-black tracking-[0.22em] text-neutral-500 uppercase">
            photo field
          </p>
          <h2
            className="mt-2 text-3xl font-black tracking-normal text-neutral-950"
            id="trip-photo-marquee-title"
          >
            우리가 지나갈 장면들
          </h2>
        </div>
        <div className="grid max-h-[32rem] grid-cols-2 gap-2 overflow-y-auto p-2 pt-0">
          {images.map((image) => (
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]"
              key={image}
            >
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="(max-width: 640px) 50vw, 240px"
                src={image}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-neutral-950 shadow-2xl">
      <ThreeDMarquee className="min-h-[28rem] opacity-[0.88]" images={images} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))] p-5 pt-24">
        <p className="text-xs font-black tracking-[0.22em] text-white/60 uppercase">
          photo field
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-normal text-white">
          우리가 지나갈 장면들
        </h2>
      </div>
    </section>
  );
}
