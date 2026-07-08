import type { Trip } from "../_data/trips";
import { TripScheduleTransitionLink } from "./trip-schedule-transition-link";

export function TripClosingCta({ trip }: { trip: Trip }) {
  return (
    <section className="rounded-[2rem] bg-neutral-950 p-5 text-white shadow-2xl">
      <p className="text-xs font-black tracking-[0.24em] text-white/48 uppercase">
        full schedule
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.08em] break-keep">
        어이어이, 아직 끝난 게 아니라고!
      </h2>
      <p className="mt-3 text-sm leading-6 font-semibold break-keep text-white/62">
        다음 화면에 지도랑 진짜배기 일정 카드가 남아있다 해. 당분 보충하기 전에
        끝까지 넘기라 해!
      </p>
      <TripScheduleTransitionLink
        className="mt-5 h-12 w-full text-[15px] font-black shadow-none"
        href={`/trip/${trip.slug}/schedule`}
        variant="light"
      >
        본격적인 일정표 열기 (출발이라고!)
      </TripScheduleTransitionLink>
    </section>
  );
}
