"use client";

import * as React from "react";

import { DottedMap, type Marker } from "@repo/ui/components/dotted-map";

const MAP_WIDTH = 150;
const MAP_HEIGHT = 75;
const MAP_EDGE_PADDING = 1.5;

type CountryMarker = Marker & {
  overlay: {
    badgeOffsetY?: number;
    badgeSide?: "left" | "right";
    cities: string[];
    countryCode: "jp" | "kr" | "th";
    countryName: string;
  };
};

const countryMarkers = [
  {
    lat: 36.4,
    lng: 127.9,
    overlay: {
      badgeOffsetY: -8,
      badgeSide: "left",
      cities: ["서울", "강릉", "부산"],
      countryCode: "kr",
      countryName: "한국",
    },
    size: 2.8,
  },
  {
    lat: 33.64,
    lng: 130.25,
    overlay: {
      badgeOffsetY: 0,
      badgeSide: "right",
      cities: ["후쿠오카", "이토시마"],
      countryCode: "jp",
      countryName: "일본",
    },
    size: 2.8,
  },
  {
    lat: 12.9236,
    lng: 100.8825,
    overlay: {
      badgeOffsetY: 8,
      badgeSide: "right",
      cities: ["방콕", "파타야"],
      countryCode: "th",
      countryName: "태국",
    },
    size: 2.8,
  },
] satisfies CountryMarker[];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getBadgeX({
  preferredSide,
  pillGap,
  pillWidth,
  r,
  x,
}: {
  preferredSide: "left" | "right";
  pillGap: number;
  pillWidth: number;
  r: number;
  x: number;
}) {
  const maxX = MAP_WIDTH - pillWidth - MAP_EDGE_PADDING;
  const leftX = x - r - pillGap - pillWidth;
  const rightX = x + r + pillGap;
  const preferredX = preferredSide === "left" ? leftX : rightX;
  const fallbackX = preferredSide === "left" ? rightX : leftX;
  const canUsePreferred = preferredX >= MAP_EDGE_PADDING && preferredX <= maxX;
  const unclampedX = canUsePreferred ? preferredX : fallbackX;

  return clamp(unclampedX, MAP_EDGE_PADDING, maxX);
}

function getBadgeY({
  badgeOffsetY,
  pillHeight,
  y,
}: {
  badgeOffsetY: number;
  pillHeight: number;
  y: number;
}) {
  return clamp(
    y - pillHeight / 2 + badgeOffsetY,
    MAP_EDGE_PADDING,
    MAP_HEIGHT - pillHeight - MAP_EDGE_PADDING,
  );
}

export function TravelDottedMap() {
  const id = React.useId();

  return (
    <section
      aria-labelledby="travel-map-title"
      className="border-border/70 bg-card/55 relative overflow-hidden rounded-[2rem] border p-4 shadow-2xl backdrop-blur-xl sm:p-5"
    >
      <div className="from-background/80 via-background/25 pointer-events-none absolute inset-0 bg-radial to-transparent" />
      <div className="relative flex flex-col gap-3">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-[0.24em] uppercase">
            Memory map
          </p>
          <h2 id="travel-map-title" className="text-lg font-semibold">
            우리가 남긴 도시들
          </h2>
        </div>

        <div className="text-muted-foreground bg-background/55 relative h-56 w-full overflow-hidden rounded-[1.5rem] border sm:h-72 lg:h-80">
          <DottedMap<CountryMarker>
            aria-hidden
            className="absolute inset-0"
            dotColor="var(--muted-foreground)"
            dotRadius={0.14}
            markerColor="var(--primary)"
            markers={countryMarkers}
            renderMarkerOverlay={({ marker, x, y, r, index }) => {
              const {
                badgeOffsetY = 0,
                badgeSide = "right",
                cities,
                countryCode,
                countryName,
              } = marker.overlay;
              const clipId = `${id}-flag-clip-${index}`.replaceAll(":", "-");
              const flagHref = `https://flagcdn.com/w80/${countryCode}.webp`;
              const imageRadius = r * 0.92;
              const titleFontSize = r * 0.72;
              const cityFontSize = r * 0.58;
              const cityLabel = cities.join(" · ");
              const longestLineLength = Math.max(
                countryName.length,
                cityLabel.length,
              );
              const pillHeight = r * 2.45;
              const pillWidth =
                longestLineLength * (cityFontSize * 0.74) + r * 2.15;
              const pillGap = r * 0.6;
              const isLeftBadge = badgeSide === "left";
              const pillX = getBadgeX({
                preferredSide: isLeftBadge ? "left" : "right",
                pillGap,
                pillWidth,
                r,
                x,
              });
              const pillY = getBadgeY({ badgeOffsetY, pillHeight, y });
              const textX = pillX + r * 0.78;

              return (
                <g pointerEvents="none">
                  <clipPath id={clipId}>
                    <circle cx={x} cy={y} r={imageRadius} />
                  </clipPath>

                  <image
                    clipPath={`url(#${clipId})`}
                    height={imageRadius * 2}
                    href={flagHref}
                    preserveAspectRatio="xMidYMid slice"
                    width={imageRadius * 2}
                    x={x - imageRadius}
                    y={y - imageRadius}
                  />

                  <rect
                    fill="rgba(15, 23, 42, 0.72)"
                    height={pillHeight}
                    rx={r * 0.72}
                    width={pillWidth}
                    x={pillX}
                    y={pillY}
                  />

                  <text
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={titleFontSize}
                    fontWeight={700}
                    x={textX}
                    y={pillY + r * 0.9}
                  >
                    {countryName}
                  </text>
                  <text
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.78)"
                    fontSize={cityFontSize}
                    fontWeight={500}
                    x={textX}
                    y={pillY + r * 1.6}
                  >
                    {cityLabel}
                  </text>
                </g>
              );
            }}
          />
          <div className="from-background via-background/20 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent" />
        </div>
      </div>
    </section>
  );
}
