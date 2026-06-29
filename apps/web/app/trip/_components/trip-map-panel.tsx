"use client";

import * as React from "react";

import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { BorderBeam } from "@/components/magicui/border-beam";

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
  const [mapStatus, setMapStatus] = React.useState<
    "fallback" | "loading" | "ready"
  >("fallback");
  const activeItem =
    trip.itinerary.find((item) => item.id === activeItemId) ??
    trip.itinerary[0];
  const activePlace = getPlace(trip, activeItem?.placeId);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";
  const hasCoordinates = trip.places.some(
    (place) => typeof place.lat === "number" && typeof place.lng === "number",
  );
  const shouldUseSdk = Boolean(appKey && hasCoordinates);

  React.useEffect(() => {
    if (!shouldUseSdk || !mapRef.current) {
      setMapStatus("fallback");
      return;
    }

    let markers: { setMap: (map: object | null) => void }[] = [];
    let overlays: { setMap: (map: object | null) => void }[] = [];
    let cancelled = false;

    setMapStatus("loading");

    loadKakaoMaps(appKey)
      .then((kakao) => {
        if (cancelled || !mapRef.current) return;
        const firstPlace = trip.places.find(hasCoordinatePlace);
        if (!firstPlace) return;

        const center = new kakao.maps.LatLng(firstPlace.lat, firstPlace.lng);
        const map = new kakao.maps.Map(mapRef.current, { center, level: 12 });
        const bounds = new kakao.maps.LatLngBounds();

        markers = trip.places.filter(hasCoordinatePlace).map((place) => {
          const position = new kakao.maps.LatLng(place.lat, place.lng);
          bounds.extend(position);
          const marker = new kakao.maps.Marker({ position });
          marker.setMap(map);
          return marker;
        });

        overlays = trip.places.filter(hasCoordinatePlace).map((place) => {
          const position = new kakao.maps.LatLng(place.lat, place.lng);
          const active = activePlace?.id === place.id;
          const overlay = new kakao.maps.CustomOverlay({
            content: `<div style="transform:translateY(-44px);white-space:nowrap;border-radius:999px;padding:7px 10px;background:${
              active ? "#111827" : "rgba(255,255,255,.92)"
            };color:${active ? "#fff" : "#111827"};font-size:11px;font-weight:900;box-shadow:0 10px 24px rgba(15,23,42,.18);border:1px solid rgba(15,23,42,.08)">${place.name}</div>`,
            position,
            yAnchor: 1,
          });
          overlay.setMap(map);
          return overlay;
        });

        if (trip.places.filter(hasCoordinatePlace).length > 1) {
          map.setBounds(bounds);
        }

        if (activePlace && hasCoordinatePlace(activePlace)) {
          map.panTo(new kakao.maps.LatLng(activePlace.lat, activePlace.lng));
        }

        setMapStatus("ready");
      })
      .catch(() => {
        markers = [];
        setMapStatus("fallback");
      });

    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.setMap(null));
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [activePlace, appKey, shouldUseSdk, trip.places]);

  return (
    <section className="bg-card relative mt-3 overflow-hidden rounded-[1.9rem] border shadow-xl">
      <BorderBeam
        borderWidth={1}
        colorFrom="#ef4444"
        colorTo="#2563eb"
        duration={9}
        size={120}
      />
      <div className="relative z-10 flex items-start justify-between gap-3 p-4">
        <div>
          <h2 className="font-black tracking-[-0.04em]">Kakao Map</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            {activePlace?.name ?? "현재 선택된 장소 없음"}
          </p>
        </div>
        <span className="bg-muted rounded-full px-2 py-1 text-xs font-semibold">
          {mapStatus === "ready" ? "SDK" : "fallback"}
        </span>
      </div>
      <div
        className="bg-background relative mx-4 mb-3 h-44 overflow-hidden rounded-3xl border"
        ref={mapRef}
      >
        {mapStatus !== "ready" ? (
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
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_70%_25%,rgba(239,68,68,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(241,245,249,0.9))]">
      <AnimatedGridPattern
        className="opacity-40"
        duration={3}
        maxOpacity={0.35}
        numSquares={22}
      />
      <div className="absolute top-1/2 right-[22%] left-[18%] border-t-2 border-dashed border-neutral-400/70" />
      {trip.places.map((place) => (
        <div
          className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground bg-background absolute grid h-9 min-w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border px-2 text-[10px] font-black shadow-lg transition data-[active=true]:scale-110"
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
