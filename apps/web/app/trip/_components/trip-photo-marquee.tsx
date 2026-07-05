"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";

import { ThreeDMarquee } from "@/components/aceternity/3d-marquee";

import type { Trip } from "../_data/trips";

const MARQUEE_IMAGE_COUNT = 32;

function fillImageGrid(images: string[], targetCount: number) {
  if (images.length === 0) return images;

  return Array.from({ length: targetCount }, (_, index) => {
    const offset = Math.floor(index / images.length);
    const sourceIndex = (index + offset * 3) % images.length;
    return images[sourceIndex];
  });
}

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
  const baseImages = getTripImages(trip);
  const images = fillImageGrid(baseImages, MARQUEE_IMAGE_COUNT);

  if (baseImages.length === 0) {
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
        className="overflow-hidden rounded-3xl bg-gray-950/5 p-2 shadow-sm ring-1 ring-neutral-700/10"
      >
        <div className="rounded-[1.4rem] bg-white p-4 pb-3">
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
        <div className="mt-2 grid max-h-[34rem] grid-cols-3 gap-1.5 overflow-y-auto">
          {images.slice(0, 24).map((image, index) => (
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-200"
              key={`${image}-${index}`}
            >
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="(max-width: 640px) 33vw, 180px"
                src={image}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-950/5 p-2 shadow-2xl ring-1 ring-neutral-700/10">
      <div className="relative overflow-hidden rounded-[1.65rem] bg-neutral-950">
        <ThreeDMarquee
          className="h-[38rem] min-h-0 rounded-[1.65rem] opacity-100 max-sm:h-[38rem]"
          images={images}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded-b-[1.65rem] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.78))] p-5 pt-28">
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
