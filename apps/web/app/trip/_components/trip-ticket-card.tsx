import { cn } from "@repo/ui/lib/utils";
import type { ItineraryItem } from "../_data/trips";

export function TripTicketCard({
  compact = false,
  item,
}: {
  compact?: boolean;
  item: ItineraryItem;
}) {
  if (!item.train) return null;

  // 임시로 화면 확인을 위해 true로 강제 설정 (실제 로직 연동 시 오늘 날짜와 비교)
  const isUsed = true;

  if (compact) {
    return (
      <article
        className={cn(
          "relative overflow-hidden rounded-[1.4rem] text-neutral-950",
          isUsed && "opacity-80 grayscale-[0.5]",
        )}
      >
        {isUsed && (
          <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-[0.5px]">
            <div className="rotate-[-15deg] rounded-md border-4 border-red-500/80 px-4 py-1 text-2xl font-black tracking-widest text-red-500/80 mix-blend-multiply shadow-sm">
              탑승완료
            </div>
          </div>
        )}
        <div className="flex items-start justify-between border-b border-dashed border-neutral-300 pb-3">
          <div>
            <p className="text-[9px] font-black tracking-[0.18em] text-neutral-500 uppercase">
              train
            </p>
            <h2 className="mt-1 text-lg font-black">{item.train.number}</h2>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black tracking-[0.18em] text-neutral-500 uppercase">
              seat
            </p>
            <p className="mt-1 text-xs font-black">
              {item.train.seats.join(" · ")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-4">
          <div>
            <p className="text-2xl font-black tracking-[-0.08em]">
              {item.train.from}
            </p>
            <p className="text-[10px] font-bold text-neutral-500">
              {item.startsAt}
            </p>
          </div>
          <p className="text-base font-black text-red-500">→</p>
          <div className="text-right">
            <p className="text-2xl font-black tracking-[-0.08em]">
              {item.train.to}
            </p>
            <p className="text-[10px] font-bold text-neutral-500">
              {item.endsAt}
            </p>
          </div>
        </div>
        <p className="rounded-2xl bg-neutral-100 px-3 py-2 text-xs font-black">
          {item.train.car} · {item.day}
        </p>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-white p-5 text-neutral-950 shadow-2xl",
        isUsed && "opacity-80 grayscale-[0.5]",
      )}
    >
      <div className="absolute top-1/2 -left-4 size-8 -translate-y-1/2 rounded-full bg-[var(--card)]" />
      <div className="absolute top-1/2 -right-4 size-8 -translate-y-1/2 rounded-full bg-[var(--card)]" />

      {isUsed && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-[0.5px]">
          <div className="rotate-[-15deg] rounded-md border-4 border-red-500/80 px-6 py-2 text-3xl font-black tracking-widest text-red-500/80 mix-blend-multiply shadow-sm">
            탑승완료
          </div>
        </div>
      )}

      <div className="flex items-start justify-between border-b border-dashed border-neutral-300 pb-4">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-neutral-500 uppercase">
            train
          </p>
          <h2 className="mt-1 text-xl font-black">{item.train.number}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold tracking-[0.18em] text-neutral-500 uppercase">
            seat
          </p>
          <p className="mt-1 text-sm font-black">
            {item.train.seats.join(" · ")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-5">
        <div>
          <p className="text-3xl font-black tracking-[-0.08em]">
            {item.train.from}
          </p>
          <p className="text-xs font-bold text-neutral-500">
            {item.startsAt} 출발
          </p>
        </div>
        <p className="text-xl font-black text-red-500">→</p>
        <div className="text-right">
          <p className="text-3xl font-black tracking-[-0.08em]">
            {item.train.to}
          </p>
          <p className="text-xs font-bold text-neutral-500">
            {item.endsAt} 도착
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-neutral-100 p-3">
          <p className="text-xs font-bold tracking-[0.18em] text-neutral-500 uppercase">
            car
          </p>
          <p className="mt-1 text-sm font-black">{item.train.car}</p>
        </div>
        <div className="rounded-2xl bg-neutral-100 p-3">
          <p className="text-xs font-bold tracking-[0.18em] text-neutral-500 uppercase">
            date
          </p>
          <p className="mt-1 text-sm font-black">{item.day}</p>
        </div>
      </div>
    </article>
  );
}
