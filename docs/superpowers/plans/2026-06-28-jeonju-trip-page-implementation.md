# Jeonju Trip Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Jeonju trip intro and schedule explorer in `apps/web` with Magic UI, ReactBits, static itinerary data, and Kakao Maps fallback behavior.

**Architecture:** Keep the trip feature route-local under `apps/web/app/trip` because this is a static trip experience, not yet a shared product domain. Use server route pages for slug validation and client components for animation, tabs, scroll state, and Kakao Maps. Store trip content in typed static data and drive all UI from that data.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Motion for React, GSAP, shadcn registry, Magic UI registry, ReactBits registry, Kakao Maps JavaScript SDK.

---

## Scope Check

This plan implements one coherent vertical slice:

- `/trip/jeonju-2026` intro page
- `/trip/jeonju-2026/schedule` schedule explorer
- static Jeonju trip data
- visual components and effects
- Kakao Maps loader plus fallback map
- docs/env updates and verification

Supabase, user-generated itinerary editing, image upload, and production-grade travel data management remain outside this slice.

## File Structure

Create these route-local files:

```text
apps/web/app/trip/
├── [slug]/
│   ├── page.tsx
│   └── schedule/
│       └── page.tsx
├── _components/
│   ├── trip-bento-grid.tsx
│   ├── trip-gallery-preview.tsx
│   ├── trip-hero.tsx
│   ├── trip-intro-page.tsx
│   ├── trip-map-panel.tsx
│   ├── trip-pill-nav.tsx
│   ├── trip-schedule-page.tsx
│   ├── trip-ticket-card.tsx
│   └── trip-timeline.tsx
├── _data/
│   └── trips.ts
└── _lib/
    ├── itinerary.ts
    └── kakao-map-loader.ts
```

Modify:

```text
apps/web/.env.example
docs/frontend/README.md
```

Registry-generated visual components are expected under `apps/web/components` and `apps/web/components/magicui`. If shadcn generates a different casing, normalize the local imports in the route-local trip components during the same task.

## Task 1: Install Visual Registry Components

**Files:**

- Modify: `apps/web/components.json` only if shadcn updates registry metadata
- Create/Modify: generated files under `apps/web/components/**`
- Modify: `apps/web/package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Confirm current registry config**

Run:

```bash
sed -n '1,160p' apps/web/components.json
```

Expected: `registries` includes both `@react-bits` and `@magicui`.

- [ ] **Step 2: Install ReactBits components**

Run:

```bash
pnpm dlx shadcn@latest add @react-bits/PillNav-TS-TW @react-bits/SplitText-TS-TW @react-bits/ScrollStack-TS-TW @react-bits/ScrollFloat-TS-TW @react-bits/CircularGallery-TS-TW @react-bits/Silk-TS-TW @react-bits/Noise-TS-TW
```

Expected: shadcn writes ReactBits components under `apps/web/components` and updates app-local dependencies if needed.

- [ ] **Step 3: Install Magic UI components**

Run:

```bash
pnpm dlx shadcn@latest add @magicui/bento-grid @magicui/iphone @magicui/backlight @magicui/marquee @magicui/animated-beam @magicui/animated-grid-pattern @magicui/animated-gradient-text @magicui/aurora-text @magicui/border-beam
```

Expected: shadcn writes Magic UI components under `apps/web/components/magicui` or `apps/web/components`.

- [ ] **Step 4: Install dependency changes**

Run:

```bash
pnpm install
```

Expected: lockfile is current and no npm/yarn/bun lockfile appears.

- [ ] **Step 5: Verify generated files compile in isolation**

Run:

```bash
pnpm --filter @repo/web check-types
```

Expected: type check passes or reports import paths that must be normalized before moving on.

- [ ] **Step 6: Commit registry installation**

Run:

```bash
git add apps/web/components apps/web/package.json pnpm-lock.yaml apps/web/components.json
git commit -m "feat: add trip visual registry components"
```

Expected: commit includes only generated visual components and dependency metadata.

## Task 2: Add Static Trip Data And Utilities

**Files:**

- Create: `apps/web/app/trip/_data/trips.ts`
- Create: `apps/web/app/trip/_lib/itinerary.ts`

- [ ] **Step 1: Create typed trip data**

Create `apps/web/app/trip/_data/trips.ts`:

```ts
export type TripSlug = "jeonju-2026";

export type TripDayId = "all" | "2026-07-10" | "2026-07-11" | "2026-07-12";

export type ItineraryKind =
  | "train"
  | "station"
  | "hotel"
  | "meal"
  | "cafe"
  | "walk"
  | "transport"
  | "place";

export interface TripPlace {
  id: string;
  name: string;
  kakaoPlaceUrl?: string;
  address?: string;
  lat?: number;
  lng?: number;
  visualPosition: {
    x: number;
    y: number;
  };
}

export interface ItineraryItem {
  id: string;
  day: Exclude<TripDayId, "all">;
  kind: ItineraryKind;
  title: string;
  startsAt?: string;
  endsAt?: string;
  description: string;
  tags: string[];
  placeId?: string;
  quickLink?: boolean;
  train?: {
    number: string;
    from: string;
    to: string;
    car: string;
    seats: string[];
  };
}

export interface Trip {
  slug: TripSlug;
  title: string;
  subtitle: string;
  startsOn: string;
  endsOn: string;
  places: TripPlace[];
  itinerary: ItineraryItem[];
}

export const trips = [
  {
    slug: "jeonju-2026",
    title: "전주로 넘어가는 밤",
    subtitle:
      "2026년 7월 10일, 용산에서 KTX를 타고 전주로 내려가는 2박 3일 여행.",
    startsOn: "2026-07-10",
    endsOn: "2026-07-12",
    places: [
      {
        id: "yongsan-station",
        name: "용산역",
        kakaoPlaceUrl: "https://place.map.kakao.com/8014275",
        visualPosition: { x: 18, y: 58 },
      },
      {
        id: "jeonju-station",
        name: "전주역",
        kakaoPlaceUrl: "https://place.map.kakao.com/8508642",
        visualPosition: { x: 78, y: 36 },
      },
      {
        id: "jeonju-tourist-hotel",
        name: "전주관광호텔호텔",
        kakaoPlaceUrl: "https://place.map.kakao.com/2126483278",
        visualPosition: { x: 68, y: 78 },
      },
    ],
    itinerary: [
      {
        id: "ktx-521-yongsan-to-jeonju",
        day: "2026-07-10",
        kind: "train",
        title: "용산역 출발 · KTX 521",
        startsAt: "20:09",
        endsAt: "21:47",
        description: "용산에서 전주로 내려가는 첫 이동. 14호차 1A, 1B 좌석.",
        tags: ["KTX", "교통", "출발"],
        placeId: "yongsan-station",
        quickLink: true,
        train: {
          number: "KTX 521",
          from: "용산",
          to: "전주",
          car: "14호차",
          seats: ["1A", "1B"],
        },
      },
      {
        id: "jeonju-arrival",
        day: "2026-07-10",
        kind: "station",
        title: "전주역 도착",
        startsAt: "21:47",
        description: "전주 여행의 첫 도착 지점.",
        tags: ["도착", "지도"],
        placeId: "jeonju-station",
        quickLink: true,
      },
      {
        id: "jeonju-tourist-hotel",
        day: "2026-07-10",
        kind: "hotel",
        title: "전주관광호텔호텔",
        startsAt: "15:00",
        endsAt: "2026-07-12 11:00",
        description: "2026년 7월 10일 체크인, 7월 12일 체크아웃.",
        tags: ["숙소", "베이스캠프", "Kakao Place"],
        placeId: "jeonju-tourist-hotel",
        quickLink: true,
      },
      {
        id: "day-2-empty-guide",
        day: "2026-07-11",
        kind: "place",
        title: "전주 일정 준비 중",
        description:
          "7월 11일 장소와 동선은 전달받는 즉시 정적 일정 데이터에 반영한다.",
        tags: ["일정 대기", "정적 데이터"],
      },
      {
        id: "ktx-510-jeonju-to-yongsan",
        day: "2026-07-12",
        kind: "train",
        title: "전주역 출발 · KTX 510",
        startsAt: "13:18",
        endsAt: "15:03",
        description: "전주에서 용산으로 돌아오는 이동. 15호차 1A, 1B 좌석.",
        tags: ["KTX", "교통", "귀가"],
        placeId: "jeonju-station",
        quickLink: true,
        train: {
          number: "KTX 510",
          from: "전주",
          to: "용산",
          car: "15호차",
          seats: ["1A", "1B"],
        },
      },
    ],
  },
] satisfies Trip[];
```

- [ ] **Step 2: Create itinerary helpers**

Create `apps/web/app/trip/_lib/itinerary.ts`:

```ts
import {
  trips,
  type ItineraryItem,
  type Trip,
  type TripDayId,
  type TripSlug,
} from "../_data/trips";

export const tripDayOptions = [
  { id: "all", label: "전체" },
  { id: "2026-07-10", label: "07.10" },
  { id: "2026-07-11", label: "07.11" },
  { id: "2026-07-12", label: "07.12" },
] satisfies { id: TripDayId; label: string }[];

export function getTrip(slug: string): Trip | undefined {
  return trips.find((item) => item.slug === slug);
}

export function generateTripStaticParams(): { slug: TripSlug }[] {
  return trips.map((trip) => ({ slug: trip.slug }));
}

export function getPlace(trip: Trip, placeId: string | undefined) {
  if (!placeId) return undefined;
  return trip.places.find((place) => place.id === placeId);
}

export function getItineraryByDay(trip: Trip, day: TripDayId): ItineraryItem[] {
  if (day === "all") return trip.itinerary;
  return trip.itinerary.filter((item) => item.day === day);
}

export function getQuickLinks(trip: Trip): ItineraryItem[] {
  return trip.itinerary.filter((item) => item.quickLink);
}
```

- [ ] **Step 3: Type-check data and helpers**

Run:

```bash
pnpm --filter @repo/web check-types
```

Expected: type check passes.

- [ ] **Step 4: Commit data layer**

Run:

```bash
git add apps/web/app/trip/_data/trips.ts apps/web/app/trip/_lib/itinerary.ts
git commit -m "feat: add static jeonju trip data"
```

Expected: commit includes only route-local data and helpers.

## Task 3: Add Route Pages And Intro/Schedule Shells

**Files:**

- Create: `apps/web/app/trip/[slug]/page.tsx`
- Create: `apps/web/app/trip/[slug]/schedule/page.tsx`
- Create: `apps/web/app/trip/_components/trip-intro-page.tsx`
- Create: `apps/web/app/trip/_components/trip-schedule-page.tsx`

- [ ] **Step 1: Create intro route page**

Create `apps/web/app/trip/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";

import { TripIntroPage } from "../_components/trip-intro-page";
import { generateTripStaticParams, getTrip } from "../_lib/itinerary";

export function generateStaticParams() {
  return generateTripStaticParams();
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();

  return <TripIntroPage trip={trip} />;
}
```

- [ ] **Step 2: Create schedule route page**

Create `apps/web/app/trip/[slug]/schedule/page.tsx`:

```tsx
import { notFound } from "next/navigation";

import { TripSchedulePage } from "../../_components/trip-schedule-page";
import { generateTripStaticParams, getTrip } from "../../_lib/itinerary";

export function generateStaticParams() {
  return generateTripStaticParams();
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();

  return <TripSchedulePage trip={trip} />;
}
```

- [ ] **Step 3: Create intro shell**

Create `apps/web/app/trip/_components/trip-intro-page.tsx`:

```tsx
import Link from "next/link";

import type { Trip } from "../_data/trips";

export function TripIntroPage({ trip }: { trip: Trip }) {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-4 py-4 sm:max-w-lg">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
          Trip intro
        </p>
        <h1 className="text-6xl font-semibold tracking-[-0.09em] text-balance">
          {trip.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-6">
          {trip.subtitle}
        </p>
        <Link
          className="bg-primary text-primary-foreground inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold"
          href={`/trip/${trip.slug}/schedule`}
        >
          일정 탐색 열기
        </Link>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Create schedule shell**

Create `apps/web/app/trip/_components/trip-schedule-page.tsx`:

```tsx
"use client";

import * as React from "react";
import Link from "next/link";

import type { Trip, TripDayId } from "../_data/trips";
import { getItineraryByDay, tripDayOptions } from "../_lib/itinerary";

export function TripSchedulePage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = React.useState<TripDayId>("all");
  const items = getItineraryByDay(trip, activeDay);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-4 sm:max-w-lg">
        <header className="bg-background/90 sticky top-0 z-20 pb-3 backdrop-blur">
          <Link
            className="text-muted-foreground text-sm"
            href={`/trip/${trip.slug}`}
          >
            ← 인트로
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {trip.title}
          </h1>
          <nav
            className="mt-3 flex gap-2 overflow-x-auto"
            aria-label="여행 날짜 필터"
          >
            {tripDayOptions.map((option) => (
              <button
                aria-pressed={activeDay === option.id}
                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground rounded-full border px-4 py-2 text-sm"
                data-active={activeDay === option.id}
                key={option.id}
                onClick={() => setActiveDay(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </nav>
        </header>
        <div className="grid gap-3 py-4">
          {items.map((item) => (
            <article className="rounded-3xl border p-4" key={item.id}>
              <p className="text-muted-foreground text-xs">{item.day}</p>
              <h2 className="mt-1 font-semibold">{item.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Verify route shells**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web build
```

Expected: both commands pass.

- [ ] **Step 6: Commit route shells**

Run:

```bash
git add apps/web/app/trip
git commit -m "feat: add jeonju trip routes"
```

Expected: commit includes route pages and minimal shells.

## Task 4: Build Mobile Intro With Bento And Ticket Components

**Files:**

- Modify: `apps/web/app/trip/_components/trip-intro-page.tsx`
- Create: `apps/web/app/trip/_components/trip-hero.tsx`
- Create: `apps/web/app/trip/_components/trip-bento-grid.tsx`
- Create: `apps/web/app/trip/_components/trip-ticket-card.tsx`
- Create: `apps/web/app/trip/_components/trip-gallery-preview.tsx`

- [ ] **Step 1: Create ticket card component**

Create `apps/web/app/trip/_components/trip-ticket-card.tsx`:

```tsx
import type { ItineraryItem } from "../_data/trips";

export function TripTicketCard({ item }: { item: ItineraryItem }) {
  if (!item.train) return null;

  return (
    <article className="text-background relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-2xl">
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
```

- [ ] **Step 2: Create mobile hero component**

Create `apps/web/app/trip/_components/trip-hero.tsx`:

```tsx
import Link from "next/link";

import type { Trip } from "../_data/trips";
import { TripTicketCard } from "./trip-ticket-card";

export function TripHero({ trip }: { trip: Trip }) {
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  return (
    <section className="relative min-h-[42rem] overflow-hidden rounded-[2.25rem] border bg-[radial-gradient(circle_at_top,var(--accent),transparent_42%),linear-gradient(180deg,var(--card),var(--background))] p-5 shadow-2xl">
      <div className="relative z-10">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
          Jeonju 2026
        </p>
        <h1 className="mt-5 text-6xl font-semibold tracking-[-0.09em] text-balance">
          {trip.title}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-6">
          {trip.subtitle}
        </p>
        <Link
          className="bg-primary text-primary-foreground mt-6 inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold"
          href={`/trip/${trip.slug}/schedule`}
        >
          일정 탐색 열기
        </Link>
      </div>
      <div className="absolute inset-x-5 bottom-5 z-10">
        {outbound ? <TripTicketCard item={outbound} /> : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create bento grid component**

Create `apps/web/app/trip/_components/trip-bento-grid.tsx`:

```tsx
import Link from "next/link";

import type { Trip } from "../_data/trips";

export function TripBentoGrid({ trip }: { trip: Trip }) {
  const hotel = trip.places.find(
    (place) => place.id === "jeonju-tourist-hotel",
  );

  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="bg-card col-span-2 min-h-56 overflow-hidden rounded-[2rem] border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
          route
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          서울에서 전주까지
        </h2>
        <div className="bg-background/70 relative mt-6 h-28 rounded-3xl border">
          <div className="absolute top-14 right-8 left-8 border-t-2 border-dashed" />
          <div className="bg-primary text-primary-foreground absolute top-10 left-5 grid size-10 place-items-center rounded-full">
            🚄
          </div>
          <div className="bg-destructive text-destructive-foreground absolute top-6 right-5 grid size-10 place-items-center rounded-full">
            📍
          </div>
        </div>
      </article>
      <article className="bg-card min-h-48 rounded-[2rem] border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
          stay
        </p>
        <h2 className="mt-2 text-lg font-semibold">
          {hotel?.name ?? "전주 숙소"}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          07.10 체크인 · 07.12 체크아웃
        </p>
        {hotel?.kakaoPlaceUrl ? (
          <Link
            className="mt-4 inline-flex text-sm font-semibold underline"
            href={hotel.kakaoPlaceUrl}
          >
            Kakao Place
          </Link>
        ) : null}
      </article>
      <article className="bg-card min-h-48 rounded-[2rem] border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
          photos
        </p>
        <h2 className="mt-2 text-lg font-semibold">여행 사진 준비</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          사진이 생기면 갤러리 카드로 교체한다.
        </p>
      </article>
    </section>
  );
}
```

- [ ] **Step 4: Wire intro page**

Replace `apps/web/app/trip/_components/trip-intro-page.tsx`:

```tsx
import type { Trip } from "../_data/trips";
import { TripBentoGrid } from "./trip-bento-grid";
import { TripHero } from "./trip-hero";

export function TripIntroPage({ trip }: { trip: Trip }) {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden">
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-4 sm:max-w-lg">
        <TripHero trip={trip} />
        <TripBentoGrid trip={trip} />
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Add generated effects incrementally**

After the static intro compiles, replace static pieces with generated effects:

```tsx
// Expected generated imports, adjust only if Task 1 produced different file casing.
import PillNav from "@/components/PillNav";
import SplitText from "@/components/SplitText";
import Silk from "@/components/Silk";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
```

Apply these substitutions:

- ReactBits `PillNav` for intro section navigation.
- ReactBits `SplitText` for the hero title.
- ReactBits `Silk` or `Noise` behind the hero card.
- Magic UI `Marquee` for KTX facts.
- Magic UI `BentoGrid` and `BentoCard` for the route, KTX, stay, and gallery cards.

- [ ] **Step 6: Verify intro page**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web build
```

Expected: both commands pass.

- [ ] **Step 7: Commit intro page**

Run:

```bash
git add apps/web/app/trip apps/web/components apps/web/package.json pnpm-lock.yaml
git commit -m "feat: build jeonju trip intro"
```

Expected: commit includes intro route components and generated effect usage.

## Task 5: Build Schedule Explorer Interactions

**Files:**

- Modify: `apps/web/app/trip/_components/trip-schedule-page.tsx`
- Create: `apps/web/app/trip/_components/trip-pill-nav.tsx`
- Create: `apps/web/app/trip/_components/trip-timeline.tsx`

- [ ] **Step 1: Create pill nav wrapper**

Create `apps/web/app/trip/_components/trip-pill-nav.tsx`:

```tsx
"use client";

import type { TripDayId } from "../_data/trips";

export function TripPillNav({
  activeDay,
  onChange,
  options,
}: {
  activeDay: TripDayId;
  onChange: (day: TripDayId) => void;
  options: { id: TripDayId; label: string }[];
}) {
  return (
    <nav
      className="bg-background/80 flex gap-2 overflow-x-auto rounded-full border p-1"
      aria-label="여행 날짜 필터"
    >
      {options.map((option) => (
        <button
          aria-pressed={activeDay === option.id}
          className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground h-10 shrink-0 rounded-full px-4 text-sm font-semibold"
          data-active={activeDay === option.id}
          key={option.id}
          onClick={() => onChange(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Create timeline component**

Create `apps/web/app/trip/_components/trip-timeline.tsx`:

```tsx
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
            className="data-[active=true]:border-primary bg-card rounded-3xl border p-4"
            data-active={activeItemId === item.id}
            id={item.id}
            key={item.id}
            onClick={() => onActiveItemChange(item.id)}
          >
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
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
                {place?.kakaoPlaceUrl ? (
                  <a
                    className="mt-3 inline-flex text-sm font-semibold underline"
                    href={place.kakaoPlaceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Kakao Place 열기
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Replace schedule page with sticky explorer**

Replace `apps/web/app/trip/_components/trip-schedule-page.tsx`:

```tsx
"use client";

import * as React from "react";
import Link from "next/link";

import type { Trip, TripDayId } from "../_data/trips";
import {
  getItineraryByDay,
  getQuickLinks,
  tripDayOptions,
} from "../_lib/itinerary";
import { TripMapPanel } from "./trip-map-panel";
import { TripPillNav } from "./trip-pill-nav";
import { TripTimeline } from "./trip-timeline";

export function TripSchedulePage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = React.useState<TripDayId>("all");
  const items = React.useMemo(
    () => getItineraryByDay(trip, activeDay),
    [activeDay, trip],
  );
  const [activeItemId, setActiveItemId] = React.useState(items[0]?.id ?? "");
  const quickLinks = getQuickLinks(trip);

  React.useEffect(() => {
    setActiveItemId(items[0]?.id ?? "");
  }, [items]);

  function scrollToItem(itemId: string) {
    setActiveItemId(itemId);
    document
      .getElementById(itemId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="mx-auto min-h-screen w-full max-w-md px-4 pb-24 sm:max-w-lg">
        <div className="bg-background/95 sticky top-0 z-30 -mx-4 px-4 pt-4 pb-3 backdrop-blur">
          <header className="flex items-center gap-3">
            <Link
              className="grid size-10 place-items-center rounded-2xl border"
              href={`/trip/${trip.slug}`}
            >
              ←
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                Jeonju 2026
              </p>
              <h1 className="truncate text-lg font-semibold">{trip.title}</h1>
            </div>
          </header>
          <TripMapPanel activeItemId={activeItemId} trip={trip} />
          <div className="mt-3">
            <TripPillNav
              activeDay={activeDay}
              onChange={setActiveDay}
              options={tripDayOptions}
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {quickLinks.map((item) => (
              <button
                className="bg-muted h-9 shrink-0 rounded-full px-3 text-xs font-semibold"
                key={item.id}
                onClick={() => scrollToItem(item.id)}
                type="button"
              >
                {item.train?.number ?? item.title}
              </button>
            ))}
          </div>
        </div>
        <div className="py-4">
          <TripTimeline
            activeItemId={activeItemId}
            items={items}
            onActiveItemChange={setActiveItemId}
            trip={trip}
          />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Verify schedule interactions compile**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web build
```

Expected: both commands pass.

- [ ] **Step 5: Commit schedule explorer**

Run:

```bash
git add apps/web/app/trip
git commit -m "feat: build jeonju schedule explorer"
```

Expected: commit includes schedule components and interaction state.

## Task 6: Add Kakao Map Loader And Fallback Panel

**Files:**

- Create: `apps/web/app/trip/_lib/kakao-map-loader.ts`
- Create: `apps/web/app/trip/_components/trip-map-panel.tsx`
- Modify: `apps/web/.env.example`

- [ ] **Step 1: Add Kakao app key example**

Append to `apps/web/.env.example`:

```bash
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=
```

- [ ] **Step 2: Create Kakao loader**

Create `apps/web/app/trip/_lib/kakao-map-loader.ts`:

```ts
declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: Record<string, unknown>,
        ) => unknown;
        Marker: new (options: Record<string, unknown>) => {
          setMap: (map: unknown | null) => void;
        };
      };
    };
  }
}

type KakaoNamespace = NonNullable<typeof window.kakao>;

let kakaoMapsPromise: Promise<KakaoNamespace> | undefined;

export function loadKakaoMaps(appKey: string): Promise<KakaoNamespace> {
  if (!appKey) {
    return Promise.reject(new Error("NEXT_PUBLIC_KAKAO_MAP_APP_KEY is empty"));
  }

  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Maps can only load in the browser"));
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoMapsPromise) return kakaoMapsPromise;

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.onload = () => {
      window.kakao?.maps.load(() => {
        if (window.kakao) resolve(window.kakao);
        else reject(new Error("Kakao Maps namespace was not created"));
      });
    };
    script.onerror = () =>
      reject(new Error("Failed to load Kakao Maps script"));
    document.head.appendChild(script);
  });

  return kakaoMapsPromise;
}
```

- [ ] **Step 3: Create map panel with fallback**

Create `apps/web/app/trip/_components/trip-map-panel.tsx`:

```tsx
"use client";

import * as React from "react";

import type { Trip } from "../_data/trips";
import { getPlace } from "../_lib/itinerary";
import { loadKakaoMaps } from "../_lib/kakao-map-loader";

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

    let markers: { setMap: (map: unknown | null) => void }[] = [];

    loadKakaoMaps(appKey)
      .then((kakao) => {
        if (!mapRef.current) return;
        const firstPlace = trip.places.find(
          (place) =>
            typeof place.lat === "number" && typeof place.lng === "number",
        );
        if (
          !firstPlace ||
          typeof firstPlace.lat !== "number" ||
          typeof firstPlace.lng !== "number"
        )
          return;

        const center = new kakao.maps.LatLng(firstPlace.lat, firstPlace.lng);
        const map = new kakao.maps.Map(mapRef.current, { center, level: 7 });

        markers = trip.places
          .filter(
            (place) =>
              typeof place.lat === "number" && typeof place.lng === "number",
          )
          .map((place) => {
            const position = new kakao.maps.LatLng(
              place.lat as number,
              place.lng as number,
            );
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
    <section className="bg-card mt-3 overflow-hidden rounded-[1.75rem] border">
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
        ref={mapRef}
        className="bg-background relative mx-4 mb-4 h-52 overflow-hidden rounded-3xl border"
      >
        {!appKey || !hasCoordinates ? (
          <FallbackMap trip={trip} activePlaceId={activePlace?.id} />
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
          className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground bg-background absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-xs shadow"
          data-active={activePlaceId === place.id}
          key={place.id}
          style={{
            left: `${place.visualPosition.x}%`,
            top: `${place.visualPosition.y}%`,
          }}
          title={place.name}
        >
          {place.id.includes("hotel")
            ? "🏨"
            : place.id.includes("station")
              ? "🚄"
              : "📍"}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify map fallback and loader**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web build
```

Expected: both commands pass without a Kakao key.

- [ ] **Step 5: Commit Kakao map structure**

Run:

```bash
git add apps/web/.env.example apps/web/app/trip
git commit -m "feat: add kakao map trip panel"
```

Expected: commit includes Kakao loader, fallback panel, and env example.

## Task 7: Polish Motion, Docs, And Verification

**Files:**

- Modify: `apps/web/app/trip/_components/*.tsx`
- Modify: `docs/frontend/README.md`

- [ ] **Step 1: Add reduced-motion guards to client animations**

In client components that use Motion, GSAP, or generated animation components, gate continuous motion:

```tsx
import { useReducedMotion } from "motion/react";

const prefersReducedMotion = useReducedMotion();
```

Use this policy:

- If `prefersReducedMotion` is true, avoid infinite movement and use static gradients.
- If `prefersReducedMotion` is false, allow floating, scroll, beam, and marquee effects.

- [ ] **Step 2: Add frontend docs for trip page**

Append to `docs/frontend/README.md`:

```md
## Trip Pages

`apps/web/app/trip` owns static trip intro and schedule pages. The first trip is
`/trip/jeonju-2026`.

- Keep trip data in route-local `_data/trips.ts`.
- Do not add user-facing itinerary creation UI for this slice.
- Use Magic UI and ReactBits effects aggressively on the 1-depth intro page, but
  preserve reduced-motion access.
- Use a 2-depth schedule explorer for itinerary navigation: sticky map, sticky
  date PillNav, quick rail, and scrollable timeline.
- Kakao Maps uses `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`; when the key or coordinates
  are missing, show the fallback map card.
```

- [ ] **Step 3: Run full relevant verification**

Run:

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
git diff --check
```

Expected: all commands pass.

- [ ] **Step 4: Browser verify mobile routes**

Run:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000/trip/jeonju-2026
http://localhost:3000/trip/jeonju-2026/schedule
```

Verify:

- Intro page renders the hero, KTX ticket, bento cards, and CTA.
- CTA moves to `/trip/jeonju-2026/schedule`.
- Schedule page keeps map/filter area sticky while timeline scrolls.
- Date tabs switch visible timeline items.
- Quick rail scrolls to a matching card.
- With no Kakao key, fallback map appears.
- Mobile width has no horizontal overflow.

- [ ] **Step 5: Commit polish and docs**

Run:

```bash
git add apps/web docs/frontend/README.md
git commit -m "docs: document trip page frontend rules"
```

Expected: commit includes final visual polish and documentation.

## Final Verification Before PR

- [ ] **Step 1: Inspect changed files**

Run:

```bash
git status --short
git diff --stat main...HEAD
```

Expected: changes are limited to `apps/web`, docs, package metadata, and generated visual components.

- [ ] **Step 2: Run final gate**

Run:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
git diff --check
```

Expected: all commands pass.

- [ ] **Step 3: Push and create PR**

Run:

```bash
git push -u origin codex/feat-jeonju-trip-page
gh pr create --base main --head codex/feat-jeonju-trip-page --title "전주 여행 인트로와 일정 탐색 페이지 추가" --body "## 요약
- /trip/jeonju-2026 1뎁스 인트로 페이지 추가
- /trip/jeonju-2026/schedule 2뎁스 일정 탐색 페이지 추가
- Magic UI, ReactBits 기반 모바일 우선 시각 효과 적용
- Kakao Maps SDK loader와 fallback 지도 카드 추가

## 확인
- pnpm install --frozen-lockfile
- pnpm format:check
- pnpm lint
- pnpm check-types
- pnpm build
- git diff --check"
```

Expected: PR body is Korean and includes the verification commands.
