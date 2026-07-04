"use client";

import * as React from "react";
import {
  BackpackIcon,
  CalendarIcon,
  DrawingPinIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { useReducedMotion } from "motion/react";

import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Marquee } from "@/components/magicui/marquee";

import type { Trip } from "../_data/trips";
import { TripGalleryPreview } from "./trip-gallery-preview";
import { TripParallaxLayer } from "./trip-parallax-layer";

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

  const scheduleHref = `/trip/${trip.slug}/schedule`;

  return (
    <BentoGrid className="auto-rows-[13.5rem] grid-cols-2 gap-3">
      <TripBentoActionCard
        Icon={RocketIcon}
        background={
          <RouteBeamCard
            reducedMotion={prefersReducedMotion}
            trainFacts={trainFacts}
          />
        }
        className="col-span-2 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(226,232,240,0.78))]"
        cta="일정 보기"
        description="용산에서 전주까지, KTX 이동을 하나의 여행 앱 카드처럼 본다."
        href={scheduleHref}
        name="서울에서 전주까지"
        parallaxSpeed={10}
      />

      <TripBentoActionCard
        Icon={DrawingPinIcon}
        background={
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.28),transparent_36%),linear-gradient(135deg,#111827,#475569)]" />
        }
        className="text-white"
        cta="숙소 보기"
        description={`체크인 07.10 15:00 · 체크아웃 07.12 11:00 · ${
          hotel?.name ?? "전주 숙소"
        }`}
        href={hotel?.kakaoPlaceUrl ?? scheduleHref}
        name="전주 베이스캠프"
        parallaxSpeed={6}
      />

      <TripBentoActionCard
        Icon={CalendarIcon}
        background={<TimelinePreview trip={trip} />}
        className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(254,243,199,0.82))]"
        cta="타임라인 열기"
        description="전체, 날짜별 탭으로 KTX와 장소 동선을 훑어본다."
        href={scheduleHref}
        name="날짜별 일정"
        parallaxSpeed={-5}
      />

      <TripBentoActionCard
        Icon={BackpackIcon}
        background={<TripGalleryPreview reducedMotion={prefersReducedMotion} />}
        className="col-span-2 bg-white"
        cta="무드 보기"
        description="한옥마을, 야경, 숙소, KTX를 여행 무드보드로 묶는다."
        href={scheduleHref}
        name="여행 무드보드"
        parallaxSpeed={8}
      />
    </BentoGrid>
  );
}

function TripBentoActionCard({
  Icon,
  background,
  className = "",
  cta,
  description,
  href,
  name,
  parallaxSpeed,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  background: React.ReactNode;
  className?: string;
  cta: string;
  description: string;
  href: string;
  name: string;
  parallaxSpeed: number;
}) {
  return (
    <TripParallaxLayer
      className={`group relative flex min-h-[13.5rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/70 p-4 shadow-sm ${className}`.trim()}
      speed={parallaxSpeed}
    >
      {background}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.72))] opacity-80 group-[.text-white]:bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.36))]" />
      <div className="relative z-10 grid size-11 place-items-center rounded-2xl bg-white/82 text-neutral-950 shadow-sm backdrop-blur">
        <Icon className="size-5" />
      </div>
      <div className="relative z-10 mt-auto">
        <h2 className="text-xl font-black tracking-[-0.06em]">{name}</h2>
        <p className="mt-2 line-clamp-3 text-xs leading-5 font-semibold opacity-72">
          {description}
        </p>
        <a
          className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-neutral-950 px-4 text-xs font-black text-white shadow-sm"
          href={href}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {cta}
        </a>
      </div>
    </TripParallaxLayer>
  );
}

function RouteBeamCard({
  reducedMotion,
  trainFacts,
}: {
  reducedMotion: boolean;
  trainFacts: React.ReactNode[];
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="absolute inset-0 overflow-hidden p-5" ref={containerRef}>
      <AnimatedGridPattern
        className="opacity-35"
        duration={3}
        maxOpacity={0.35}
        numSquares={18}
      />
      <div
        className="absolute top-16 left-7 z-10 rounded-full bg-neutral-950 px-4 py-2 text-xs font-black text-white shadow-lg"
        ref={fromRef}
      >
        용산
      </div>
      <div
        className="absolute right-7 bottom-14 z-10 rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white shadow-lg"
        ref={toRef}
      >
        전주
      </div>
      {reducedMotion ? null : (
        <AnimatedBeam
          containerRef={containerRef}
          curvature={-54}
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
      <div className="absolute right-0 bottom-4 left-0 z-20">
        {reducedMotion ? (
          <div className="flex flex-wrap gap-2 px-5">{trainFacts}</div>
        ) : (
          <Marquee className="[--duration:18s]">{trainFacts}</Marquee>
        )}
      </div>
      <BorderBeam
        borderWidth={1}
        colorFrom="#ef4444"
        colorTo="#2563eb"
        duration={9}
        size={120}
      />
    </div>
  );
}

function TimelinePreview({ trip }: { trip: Trip }) {
  return (
    <div className="absolute inset-0 p-5">
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.38),transparent_58%)]" />
      <div className="relative mt-8 grid gap-2">
        {trip.itinerary.slice(0, 3).map((item) => (
          <div
            className="rounded-2xl bg-white/82 px-3 py-2 text-[11px] font-black text-neutral-950 shadow-sm backdrop-blur"
            key={item.id}
          >
            <AuroraText colors={["#ef4444", "#f97316", "#2563eb"]}>
              {item.startsAt ?? item.day.slice(5)}
            </AuroraText>{" "}
            · {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
