"use client";

import * as React from "react";

import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

import type { ItineraryItem, Trip, TripDayId } from "../_data/trips";
import { getPlace } from "../_lib/itinerary";
import { loadKakaoMaps } from "../_lib/kakao-map-loader";

type CoordinatePlace = Trip["places"][number] & {
  lat: number;
  lng: number;
};

interface KakaoMapLike {
  panTo: (latlng: object) => void;
  relayout: () => void;
  setBounds: (bounds: object) => void;
  setCenter: (latlng: object) => void;
  setLevel: (level: number) => void;
}

interface KakaoOverlayLike {
  setContent: (content: string | HTMLElement) => void;
  setMap: (map: object | null) => void;
}

interface KakaoMarkerLike {
  setMap: (map: object | null) => void;
}

function hasCoordinatePlace(
  place: Trip["places"][number],
): place is CoordinatePlace {
  return typeof place.lat === "number" && typeof place.lng === "number";
}

function isJeonjuCoordinatePlace(
  place: Trip["places"][number],
): place is CoordinatePlace {
  return (
    hasCoordinatePlace(place) &&
    place.lat >= 35.75 &&
    place.lat <= 35.9 &&
    place.lng >= 127.1 &&
    place.lng <= 127.2
  );
}

export function TripMapPanel({
  activeDay,
  activeItemId,
  trip,
  visibleItems,
}: {
  activeDay: TripDayId;
  activeItemId: string;
  trip: Trip;
  visibleItems: ItineraryItem[];
}) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const kakaoMapRef = React.useRef<KakaoMapLike | null>(null);
  const markersRef = React.useRef<Record<string, KakaoMarkerLike>>({});
  const overlaysRef = React.useRef<Record<string, KakaoOverlayLike>>({});
  const [mapStatus, setMapStatus] = React.useState<
    "fallback" | "loading" | "ready"
  >("loading");
  const activeItem =
    trip.itinerary.find((item) => item.id === activeItemId) ??
    trip.itinerary[0];
  const activePlace = getPlace(trip, activeItem?.placeId);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "";
  const hasCoordinates = trip.places.some(
    (place) => typeof place.lat === "number" && typeof place.lng === "number",
  );
  const shouldUseSdk = Boolean(appKey && hasCoordinates);
  const visiblePlaceIds = React.useMemo(() => {
    if (activeDay === "all")
      return new Set(trip.places.map((place) => place.id));

    return new Set(
      visibleItems
        .map((item) => item.placeId)
        .filter((placeId): placeId is string => Boolean(placeId)),
    );
  }, [activeDay, trip.places, visibleItems]);
  const visiblePlaces = React.useMemo(() => {
    if (activeDay === "all") return trip.places;

    return trip.places.filter((place) => visiblePlaceIds.has(place.id));
  }, [activeDay, trip.places, visiblePlaceIds]);
  const visibleCoordinatePlaces = React.useMemo(
    () => visiblePlaces.filter(hasCoordinatePlace),
    [visiblePlaces],
  );
  const boundsCoordinatePlaces = React.useMemo(() => {
    if (activeDay !== "2026-07-10") return visibleCoordinatePlaces;

    return visibleCoordinatePlaces.filter(
      (place) => place.id !== "yongsan-station",
    );
  }, [activeDay, visibleCoordinatePlaces]);
  const visiblePlaceKey = visiblePlaces.map((place) => place.id).join("|");
  const visibleCoordinatePlaceKey = visibleCoordinatePlaces
    .map((place) => place.id)
    .join("|");
  const boundsCoordinatePlaceKey = boundsCoordinatePlaces
    .map((place) => place.id)
    .join("|");

  const getOverlayContent = React.useCallback(
    (place: Trip["places"][number], active: boolean) => {
      return `<div style="pointer-events:none;transform:translateY(-44px);white-space:nowrap;border-radius:999px;padding:6px 9px;background:${
        active ? "#111827" : "rgba(255,255,255,.92)"
      };color:${active ? "#fff" : "#111827"};font-size:10px;font-weight:900;box-shadow:0 8px 20px rgba(15,23,42,.14);border:1px solid rgba(15,23,42,.06)">${place.name}</div>`;
    },
    [],
  );

  React.useEffect(() => {
    if (!shouldUseSdk || !mapRef.current) {
      kakaoMapRef.current = null;
      setMapStatus("fallback");
      return;
    }

    let markers: KakaoMarkerLike[] = [];
    let overlays: KakaoOverlayLike[] = [];
    let cancelled = false;

    setMapStatus("loading");

    loadKakaoMaps(appKey)
      .then((kakao) => {
        if (cancelled || !mapRef.current) return;
        const defaultPlaces = trip.places.filter(isJeonjuCoordinatePlace);
        const firstPlace =
          defaultPlaces[0] ?? trip.places.find(hasCoordinatePlace);
        if (!firstPlace) return;

        const center = new kakao.maps.LatLng(firstPlace.lat, firstPlace.lng);
        const map = new kakao.maps.Map(mapRef.current, { center, level: 12 });
        kakaoMapRef.current = map;
        markersRef.current = {};
        overlaysRef.current = {};
        const bounds = new kakao.maps.LatLngBounds();

        markers = trip.places.filter(hasCoordinatePlace).map((place) => {
          const position = new kakao.maps.LatLng(place.lat, place.lng);
          bounds.extend(position);
          const marker = new kakao.maps.Marker({ position });
          marker.setMap(map);
          markersRef.current[place.id] = marker;
          return marker;
        });

        overlays = trip.places.filter(hasCoordinatePlace).map((place) => {
          const position = new kakao.maps.LatLng(place.lat, place.lng);
          const overlay = new kakao.maps.CustomOverlay({
            content: getOverlayContent(place, false),
            position,
            yAnchor: 1,
          });
          overlay.setMap(map);
          overlaysRef.current[place.id] = overlay;
          return overlay;
        });

        if (defaultPlaces.length > 1) {
          const defaultBounds = new kakao.maps.LatLngBounds();
          defaultPlaces.forEach((place) => {
            defaultBounds.extend(new kakao.maps.LatLng(place.lat, place.lng));
          });
          map.setBounds(defaultBounds);
          map.setLevel(7);
        } else if (trip.places.filter(hasCoordinatePlace).length > 1) {
          map.setBounds(bounds);
        }

        setMapStatus("ready");
      })
      .catch(() => {
        markers = [];
        setMapStatus("fallback");
      });

    return () => {
      cancelled = true;
      kakaoMapRef.current = null;
      markersRef.current = {};
      overlaysRef.current = {};
      markers.forEach((marker) => marker.setMap(null));
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [appKey, getOverlayContent, shouldUseSdk, trip.places]);

  React.useEffect(() => {
    if (!kakaoMapRef.current || mapStatus !== "ready" || !window.kakao) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const map = kakaoMapRef.current;
      if (!map || !window.kakao) return;

      map.relayout();

      trip.places.filter(hasCoordinatePlace).forEach((place) => {
        const visible = activeDay === "all" || visiblePlaceIds.has(place.id);
        markersRef.current[place.id]?.setMap(visible ? map : null);
        overlaysRef.current[place.id]?.setMap(visible ? map : null);
        overlaysRef.current[place.id]?.setContent(
          getOverlayContent(place, activePlace?.id === place.id),
        );
      });

      if (activeDay !== "all") {
        if (boundsCoordinatePlaces.length > 1) {
          const bounds = new window.kakao.maps.LatLngBounds();
          boundsCoordinatePlaces.forEach((place) => {
            bounds.extend(new window.kakao!.maps.LatLng(place.lat, place.lng));
          });
          map.setBounds(bounds);
          return;
        }

        if (boundsCoordinatePlaces.length === 1) {
          const [place] = boundsCoordinatePlaces;
          map.setLevel(5);
          map.setCenter(new window.kakao.maps.LatLng(place.lat, place.lng));
          return;
        }
      }

      if (activePlace && hasCoordinatePlace(activePlace)) {
        map.setLevel(5);
        map.setCenter(
          new window.kakao.maps.LatLng(activePlace.lat, activePlace.lng),
        );
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    activeDay,
    activePlace,
    boundsCoordinatePlaceKey,
    boundsCoordinatePlaces,
    getOverlayContent,
    mapStatus,
    trip.places,
    visibleCoordinatePlaceKey,
    visibleCoordinatePlaces,
    visiblePlaceIds,
    visiblePlaceKey,
  ]);

  React.useEffect(() => {
    const target = mapRef.current;
    if (!target || typeof ResizeObserver === "undefined") return;

    let frame: number | undefined;
    const observer = new ResizeObserver(() => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        kakaoMapRef.current?.relayout();
      });
    });

    observer.observe(target);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      className="bg-card relative mx-[var(--trip-map-mx)] mt-[var(--trip-map-mt)] overflow-hidden rounded-[var(--trip-map-radius)] border p-[var(--trip-map-padding)] shadow-xl"
      data-trip-map-panel
    >
      <div
        className="bg-background relative h-[var(--trip-map-height)] overflow-hidden rounded-[var(--trip-map-inner-radius)] border"
        ref={mapRef}
      >
        {mapStatus === "fallback" ? (
          <FallbackMap activePlaceId={activePlace?.id} places={visiblePlaces} />
        ) : null}
        <div className="pointer-events-none absolute top-3 right-3 left-3 flex items-start justify-between gap-3">
          <span className="max-w-[70%] truncate rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-neutral-950 shadow-lg backdrop-blur">
            {activePlace?.name ?? "현재 선택된 장소 없음"}
          </span>
        </div>
      </div>
    </section>
  );
}

function FallbackMap({
  activePlaceId,
  places,
}: {
  activePlaceId?: string;
  places: Trip["places"];
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
      {places.map((place) => (
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
