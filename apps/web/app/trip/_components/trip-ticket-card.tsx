import type { ItineraryItem } from "../_data/trips";

export function TripTicketCard({ item }: { item: ItineraryItem }) {
  if (!item.train) return null;

  return (
    <article className="relative overflow-hidden rounded-[2rem] bg-white p-5 text-neutral-950 shadow-2xl">
      <div className="absolute top-1/2 -left-4 size-8 -translate-y-1/2 rounded-full bg-[var(--card)]" />
      <div className="absolute top-1/2 -right-4 size-8 -translate-y-1/2 rounded-full bg-[var(--card)]" />
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
