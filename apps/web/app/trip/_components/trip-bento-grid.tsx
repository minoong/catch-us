"use client";

import {
  BackpackIcon,
  CalendarIcon,
  DrawingPinIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { useReducedMotion } from "motion/react";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
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
  const hotelHref = hotel?.kakaoPlaceUrl ?? `/trip/${trip.slug}/schedule`;
  const trainFacts = [outbound, inbound].filter(Boolean).map((item) => (
    <span
      className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm"
      key={item?.id}
    >
      {item?.train?.number} · {item?.startsAt} → {item?.endsAt}
    </span>
  ));

  return (
    <BentoGrid className="auto-rows-[14rem] grid-cols-2 gap-3">
      <BentoCard
        Icon={RocketIcon}
        background={
          <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.26),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(226,232,240,0.7))] p-4">
            <div className="absolute top-20 right-8 left-8 border-t-2 border-dashed border-neutral-400/70" />
            <div className="absolute top-15 left-5 rounded-full bg-black px-3 py-1 text-xs font-black text-white">
              용산
            </div>
            <div className="absolute top-15 right-5 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
              전주
            </div>
            {prefersReducedMotion ? (
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                {trainFacts}
              </div>
            ) : (
              <Marquee className="absolute inset-x-0 bottom-4 [--duration:16s]">
                {trainFacts}
              </Marquee>
            )}
          </div>
        }
        className="col-span-2 rounded-[2rem]"
        cta="일정 보기"
        description="왕복 KTX 시간과 좌석을 한눈에 보는 이동 카드."
        href={`/trip/${trip.slug}/schedule`}
        name="서울에서 전주까지"
      />
      <BentoCard
        Icon={DrawingPinIcon}
        background={
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(71,85,105,0.74))] p-4 text-white">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase opacity-70">
              stay
            </p>
            <p className="mt-3 text-2xl font-black tracking-[-0.06em]">
              07.10
              <br />
              15:00
            </p>
            <p className="mt-2 text-xs font-semibold opacity-70">
              체크아웃 07.12 · 11:00
            </p>
          </div>
        }
        className="col-span-1 rounded-[2rem]"
        cta="Kakao Place"
        description={hotel?.name ?? "전주 숙소"}
        href={hotelHref}
        name="숙소"
      />
      <BentoCard
        Icon={CalendarIcon}
        background={
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.35),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(241,245,249,0.88))] p-4">
            <p className="text-xs font-semibold tracking-[0.22em] text-neutral-500 uppercase">
              timeline
            </p>
            <div className="mt-4 grid gap-2">
              {trip.itinerary.slice(0, 3).map((item) => (
                <div
                  className="rounded-2xl bg-white/75 px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm"
                  key={item.id}
                >
                  {item.startsAt ?? item.day.slice(5)} · {item.title}
                </div>
              ))}
            </div>
          </div>
        }
        className="col-span-1 rounded-[2rem]"
        cta="타임라인"
        description="전체, 날짜별로 넘겨 보는 여행 동선."
        href={`/trip/${trip.slug}/schedule`}
        name="날짜별 일정"
      />
      <BentoCard
        Icon={BackpackIcon}
        background={<TripGalleryPreview reducedMotion={prefersReducedMotion} />}
        className="col-span-2 rounded-[2rem]"
        cta="사진은 여행 후"
        description="여행 후 사진과 장소를 붙일 수 있는 프리뷰 영역."
        href={`/trip/${trip.slug}/schedule`}
        name="여행 무드보드"
      />
    </BentoGrid>
  );
}
