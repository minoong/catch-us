"use client";

import Link from "next/link";

import ScrollFloat from "@/components/ScrollFloat";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";

import type { Trip } from "../_data/trips";

export function TripStoryStack({ trip }: { trip: Trip }) {
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );
  const inbound = trip.itinerary.find(
    (item) => item.id === "ktx-510-jeonju-to-yongsan",
  );
  const hotel = trip.places.find(
    (place) => place.id === "jeonju-tourist-hotel",
  );

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border bg-neutral-950 p-4 text-white shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.5),transparent_62%)]" />
      <BorderBeam
        borderWidth={1}
        colorFrom="#ef4444"
        colorTo="#2563eb"
        duration={10}
        size={140}
      />
      <div className="relative z-10">
        <p className="text-xs font-bold tracking-[0.28em] text-white/50 uppercase">
          scroll story
        </p>
        <ScrollFloat
          containerClassName="my-1"
          textClassName="text-white text-3xl font-black tracking-[-0.08em]"
        >
          KTX에서 숙소까지
        </ScrollFloat>
        <p className="text-sm leading-6 text-white/62">
          이동, 도착, 숙소, 귀가를 카드가 겹쳐지는 모바일 스토리로 훑어본다.
        </p>
      </div>

      <div className="relative z-10 mt-4 h-[28rem] overflow-hidden rounded-[2rem] bg-white/6">
        <ScrollStack
          baseScale={0.86}
          blurAmount={0}
          className="h-full"
          itemDistance={82}
          itemStackDistance={26}
          rotationAmount={0.7}
        >
          <ScrollStackItem itemClassName="bg-white text-neutral-950 p-6">
            <p className="text-xs font-black tracking-[0.24em] text-neutral-400 uppercase">
              outbound
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-[-0.08em]">
              {outbound?.train?.number ?? "KTX 521"}
            </h3>
            <p className="mt-4 text-sm font-semibold text-neutral-600">
              용산 {outbound?.startsAt} 출발 · 전주 {outbound?.endsAt} 도착
            </p>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white p-6">
            <p className="text-xs font-black tracking-[0.24em] text-white/60 uppercase">
              stay
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-[-0.08em]">
              {hotel?.name ?? "전주 숙소"}
            </h3>
            <p className="mt-4 text-sm font-semibold text-white/72">
              07.10 체크인 · 07.12 체크아웃
            </p>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="bg-[linear-gradient(135deg,#111827,#2563eb)] text-white p-6">
            <p className="text-xs font-black tracking-[0.24em] text-white/60 uppercase">
              return
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-[-0.08em]">
              {inbound?.train?.number ?? "KTX 510"}
            </h3>
            <p className="mt-4 text-sm font-semibold text-white/72">
              전주 {inbound?.startsAt} 출발 · 용산 {inbound?.endsAt} 도착
            </p>
          </ScrollStackItem>
        </ScrollStack>
      </div>

      <Link
        className="relative z-10 mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-black text-neutral-950"
        href={`/trip/${trip.slug}/schedule`}
      >
        <AnimatedGradientText colorFrom="#ef4444" colorTo="#2563eb">
          날짜별 일정으로 이동
        </AnimatedGradientText>
      </Link>
    </section>
  );
}
