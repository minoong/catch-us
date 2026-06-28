"use client";

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
      {items.map((item) => {
        const place = getPlace(trip, item.placeId);

        return (
          <article
            className="data-[active=true]:border-primary bg-card rounded-3xl border p-4 shadow-sm transition"
            data-active={activeItemId === item.id}
            id={item.id}
            key={item.id}
          >
            <button
              className="grid w-full grid-cols-[4.5rem_minmax(0,1fr)] gap-3 text-left"
              onClick={() => onActiveItemChange(item.id)}
              type="button"
            >
              <div>
                <p className="text-primary text-xs font-semibold">
                  {item.day.slice(5)}
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight">
                  {item.startsAt ?? item.kind}
                </p>
              </div>
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      className="bg-muted rounded-full px-2 py-1 text-xs"
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
