"use client";

import * as React from "react";

import type { Trip } from "../_data/trips";
import { getPlace } from "../_lib/itinerary";
import { loadKakaoMaps } from "../_lib/kakao-map-loader";

type CoordinatePlace = Trip["places"][number] & {
  lat: number;
  lng: number;
};

function hasCoordinatePlace(
  place: Trip["places"][number],
): place is CoordinatePlace {
  return typeof place.lat === "number" && typeof place.lng === "number";
}

export function TripMapPanel({
  activeItemId,
  trip,
}: {
  activeItemId: string;
  trip: Trip;
}) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const activeItem =
    trip.itinerary.find((item) => item.id === activeItemId) ??
    trip.itinerary[0];
  const activePlace = getPlace(trip, activeItem?.placeId);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";
  const hasCoordinates = trip.places.some(
    (place) => typeof place.lat === "number" && typeof place.lng === "number",
  );

  React.useEffect(() => {
    if (!appKey || !hasCoordinates || !mapRef.current) return;

    let markers: { setMap: (map: object | null) => void }[] = [];

    loadKakaoMaps(appKey)
      .then((kakao) => {
        if (!mapRef.current) return;
        const firstPlace = trip.places.find(hasCoordinatePlace);
        if (!firstPlace) return;

        const center = new kakao.maps.LatLng(firstPlace.lat, firstPlace.lng);
        const map = new kakao.maps.Map(mapRef.current, { center, level: 7 });

        markers = trip.places.filter(hasCoordinatePlace).map((place) => {
          const position = new kakao.maps.LatLng(place.lat, place.lng);
          const marker = new kakao.maps.Marker({ position });
          marker.setMap(map);
          return marker;
        });
      })
      .catch(() => {
        markers = [];
      });

    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [appKey, hasCoordinates, trip.places]);

  return (
    <section className="bg-card mt-3 overflow-hidden rounded-[1.75rem] border shadow-sm">
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h2 className="font-semibold">Kakao Map</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            {activePlace?.name ?? "현재 선택된 장소 없음"}
          </p>
        </div>
        <span className="bg-muted rounded-full px-2 py-1 text-xs font-semibold">
          {appKey && hasCoordinates ? "SDK" : "fallback"}
        </span>
      </div>
      <div
        className="bg-background relative mx-4 mb-4 h-52 overflow-hidden rounded-3xl border"
        ref={mapRef}
      >
        {!appKey || !hasCoordinates ? (
          <FallbackMap activePlaceId={activePlace?.id} trip={trip} />
        ) : null}
      </div>
    </section>
  );
}

function FallbackMap({
  activePlaceId,
  trip,
}: {
  activePlaceId?: string;
  trip: Trip;
}) {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(90deg,var(--border)_1px,transparent_1px),linear-gradient(var(--border)_1px,transparent_1px)] bg-size-[28px_28px]">
      <div className="absolute top-1/2 right-[22%] left-[18%] border-t-2 border-dashed" />
      {trip.places.map((place) => (
        <div
          className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground bg-background absolute grid h-9 min-w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border px-2 text-[10px] font-black shadow"
          data-active={activePlaceId === place.id}
          key={place.id}
          style={{
            left: `${place.visualPosition.x}%`,
            top: `${place.visualPosition.y}%`,
          }}
          title={place.name}
        >
          {place.id.includes("hotel")
            ? "STAY"
            : place.id.includes("station")
              ? "KTX"
              : "PIN"}
        </div>
      ))}
    </div>
  );
}
