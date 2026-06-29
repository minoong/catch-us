"use client";

import ScrollFloat from "@/components/ScrollFloat";
import { AuroraText } from "@/components/magicui/aurora-text";

import type { ItineraryItem, Trip } from "../_data/trips";
import { getPlace } from "../_lib/itinerary";

export function TripTimeline({
  activeItemId,
  items,
  onActiveItemChange,
  trip,
}: {
  activeItemId: string;
  items: ItineraryItem[];
  onActiveItemChange: (itemId: string) => void;
  trip: Trip;
}) {
  return (
    <div className="grid gap-3">
      <ScrollFloat
        containerClassName="my-1"
        textClassName="text-3xl font-black tracking-[-0.08em]"
      >
        날짜별 일정
      </ScrollFloat>
      {items.map((item) => {
        const place = getPlace(trip, item.placeId);

        return (
          <article
            className="data-[active=true]:border-primary bg-card relative overflow-hidden rounded-3xl border p-4 shadow-sm transition data-[active=true]:shadow-2xl"
            data-active={activeItemId === item.id}
            id={item.id}
            key={item.id}
          >
            <div className="absolute inset-y-5 left-5 w-0.5 bg-gradient-to-b from-red-500 via-orange-400 to-blue-500 opacity-25 data-[active=true]:opacity-100" />
            <button
              className="relative grid w-full grid-cols-[4.5rem_minmax(0,1fr)] gap-3 text-left"
              onClick={() => onActiveItemChange(item.id)}
              type="button"
            >
              <div>
                <p className="text-primary text-xs font-black">
                  <AuroraText colors={["#ef4444", "#f97316", "#2563eb"]}>
                    {item.day.slice(5)}
                  </AuroraText>
                </p>
                <p className="mt-1 text-lg font-black tracking-tight">
                  {item.startsAt ?? item.kind}
                </p>
                {item.endsAt ? (
                  <p className="text-muted-foreground text-xs font-semibold">
                    {item.endsAt}
                  </p>
                ) : null}
              </div>
              <div>
                <h2 className="font-black tracking-[-0.03em]">{item.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {item.description}
                </p>
                {item.train ? (
                  <div className="bg-muted/60 mt-3 grid grid-cols-2 gap-2 rounded-2xl p-2 text-xs font-black">
                    <span>{item.train.car}</span>
                    <span className="text-right">
                      {item.train.seats.join(" · ")}
                    </span>
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      className="bg-muted rounded-full px-2 py-1 text-xs font-semibold"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
            {place?.kakaoPlaceUrl ? (
              <a
                className="mt-3 ml-[5.25rem] inline-flex text-sm font-semibold underline"
                href={place.kakaoPlaceUrl}
                rel="noreferrer"
                target="_blank"
              >
                Kakao Place 열기
              </a>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
