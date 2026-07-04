import Link from "next/link";

import type { Trip } from "../_data/trips";

export function TripClosingCta({ trip }: { trip: Trip }) {
  return (
    <section className="rounded-[2rem] bg-neutral-950 p-5 text-white shadow-2xl">
      <p className="text-xs font-black tracking-[0.24em] text-white/48 uppercase">
        full schedule
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.08em]">
        지도와 일정은 다음 화면에서
      </h2>
      <p className="mt-3 text-sm leading-6 font-semibold text-white/62">
        날짜별 동선, 지도, 장소 카드는 전체 일정 화면에서 더 자세히 볼 수
        있어요.
      </p>
      <Link
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-black text-neutral-950"
        href={`/trip/${trip.slug}/schedule`}
      >
        전체 일정 열기
      </Link>
    </section>
  );
}
