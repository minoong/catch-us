# Jeonju Trip Intro Renewal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/trip/jeonju-2026` as a mobile-only date-invitation trip intro with the existing intro flash, shrinking sticky header, countdown/elapsed timer, 3D photo marquee, and auto-advancing itinerary Stepper.

**Architecture:** Keep route data in `apps/web/app/trip/_data/trips.ts` and keep page composition in focused route-local components under `apps/web/app/trip/_components`. Registry components live under `apps/web/components/*`, while small trip-specific adapters own countdown math, selected itinerary steps, mobile layout, and reduced-motion behavior.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS 4, Motion for React, Lenis, Aceternity 3D Marquee via shadcn registry, ReactBits Stepper via shadcn registry, Motion Primitives SlidingNumber.

---

## File Structure

- Modify: `apps/web/app/trip/_components/trip-intro-page.tsx` — orchestrates the renewed intro page.
- Modify: `apps/web/app/trip/_components/trip-intro-header.tsx` — converts the existing sticky header into a scroll-progress shrink header.
- Replace or heavily modify: `apps/web/app/trip/_components/trip-hero.tsx` — becomes the invitation-style mobile hero.
- Create: `apps/web/app/trip/_components/trip-time-control-strip.tsx` — computes countdown before KTX 521 and elapsed time after departure.
- Create: `apps/web/app/trip/_components/trip-photo-marquee.tsx` — wraps Aceternity 3D Marquee with trip image assets and reduced-motion fallback.
- Create: `apps/web/app/trip/_components/trip-auto-itinerary-stepper.tsx` — adapts ReactBits Stepper into an auto-advancing itinerary summary with progress bar.
- Create: `apps/web/app/trip/_components/trip-closing-cta.tsx` — final schedule route CTA.
- Create: `apps/web/components/aceternity/3d-marquee.tsx` — app-local wrapper/export for the Aceternity generated component.
- Create: `apps/web/components/reactbits/stepper.tsx` — app-local wrapper/export for the ReactBits generated Stepper.
- Create: `apps/web/components/reactbits/stepper.css` — Stepper styles imported by the wrapper if the generated component ships CSS separately.
- Create: `apps/web/components/core/sliding-number.tsx` — Motion Primitives SlidingNumber component.
- Do not modify: `apps/web/app/trip/[slug]/schedule/page.tsx` and `apps/web/app/trip/_components/trip-schedule-page.tsx` except if type exports are required; schedule UX is out of scope.

## Task 1: Install Registry Components

**Files:**

- Create or modify: files generated under `apps/web/components/`
- Modify: `apps/web/package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Add Aceternity 3D Marquee**

Run from repo root:

```bash
pnpm --dir apps/web dlx shadcn@latest add @aceternity/3d-marquee-demo
```

Expected: one or more Aceternity 3D Marquee files are created under `apps/web/components` and no npm/yarn/bun lockfile is created.

- [ ] **Step 2: Add ReactBits Stepper**

Run from repo root:

```bash
pnpm --dir apps/web dlx shadcn@latest add @react-bits/Stepper-TS-CSS
```

Expected: Stepper TypeScript and CSS files are created under `apps/web/components`, with imports that resolve inside `apps/web`.

- [ ] **Step 3: Add Motion Primitives SlidingNumber**

Run from repo root:

```bash
pnpm --dir apps/web dlx motion-primitives@latest add sliding-number
```

Expected: `apps/web/components/core/sliding-number.tsx` exists.

- [ ] **Step 4: Normalize generated files into stable app-local paths**

Move or re-export generated files so the implementation imports these stable paths:

```text
apps/web/components/aceternity/3d-marquee.tsx
apps/web/components/reactbits/stepper.tsx
apps/web/components/reactbits/stepper.css
apps/web/components/core/sliding-number.tsx
```

Inspect generated files. When a file imports `@/components/ui/*`, `@/lib/utils`, or app-local aliases that do not exist, update the import to this repo's aliases:

```ts
import { cn } from "@repo/ui/lib/utils";
```

Expected: page code can import `ThreeDMarquee` from `@/components/aceternity/3d-marquee`, `Stepper` from `@/components/reactbits/stepper`, and `SlidingNumber` from `@/components/core/sliding-number`.

- [ ] **Step 5: Run targeted checks**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web lint
```

Expected: both commands pass, or only reveal generated-code style issues that are fixed before continuing.

- [ ] **Step 6: Commit registry additions**

Run:

```bash
git add apps/web/components apps/web/package.json pnpm-lock.yaml
git commit -m "feat: 전주 인트로 비주얼 컴포넌트 추가"
```

Expected: commit includes only generated/normalized registry component files and dependency metadata.

## Task 2: Add Time Control Strip

**Files:**

- Create: `apps/web/app/trip/_components/trip-time-control-strip.tsx`
- Modify: `apps/web/app/trip/_components/trip-intro-page.tsx`

- [ ] **Step 1: Create countdown helpers and display component**

Create `apps/web/app/trip/_components/trip-time-control-strip.tsx`:

```tsx
"use client";

import * as React from "react";

import { SlidingNumber } from "@/components/core/sliding-number";

import type { Trip } from "../_data/trips";

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

function parseTripDeparture(trip: Trip): Date | null {
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  if (!outbound?.startsAt) return null;
  return new Date(`${outbound.day}T${outbound.startsAt}:00`);
}

function splitDuration(value: number) {
  const absolute = Math.max(Math.abs(value), 0);
  const days = Math.floor(absolute / MS_PER_DAY);
  const hours = Math.floor((absolute % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((absolute % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((absolute % MS_PER_MINUTE) / MS_PER_SECOND);

  return { days, hours, minutes, seconds };
}

export function TripTimeControlStrip({ trip }: { trip: Trip }) {
  const [now, setNow] = React.useState<Date | null>(null);
  const departure = React.useMemo(() => parseTripDeparture(trip), [trip]);

  React.useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (!departure) {
    return (
      <section className="rounded-[1.4rem] border border-white/70 bg-white/82 px-4 py-3 shadow-sm backdrop-blur">
        <p className="text-[11px] font-black tracking-[0.2em] text-neutral-500 uppercase">
          trip clock
        </p>
        <p className="mt-1 text-sm font-black text-neutral-950">여행 준비 중</p>
      </section>
    );
  }

  if (!now) {
    return (
      <section className="h-[5.5rem] rounded-[1.4rem] border border-white/70 bg-white/70 shadow-sm backdrop-blur" />
    );
  }

  const delta = departure.getTime() - now.getTime();
  const beforeDeparture = delta > 0;
  const parts = splitDuration(delta);

  return (
    <section className="rounded-[1.4rem] border border-white/70 bg-white/86 px-4 py-3 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] text-red-500 uppercase">
            trip clock
          </p>
          <h2 className="mt-1 text-sm font-black text-neutral-950">
            {beforeDeparture ? "용산역 출발까지" : "여행 시작 후"}
          </h2>
        </div>
        <p className="rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-black text-white">
          KTX 521
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 font-mono text-neutral-950">
        <TimeUnit label="일" value={parts.days} />
        <TimeUnit label="시" value={parts.hours} padStart />
        <TimeUnit label="분" value={parts.minutes} padStart />
        <TimeUnit label="초" value={parts.seconds} padStart />
      </div>
    </section>
  );
}

function TimeUnit({
  label,
  padStart = false,
  value,
}: {
  label: string;
  padStart?: boolean;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-neutral-950/[0.04] px-2 py-2 text-center">
      <div className="flex justify-center text-xl leading-none font-black">
        <SlidingNumber padStart={padStart} value={value} />
      </div>
      <p className="mt-1 text-[10px] font-black text-neutral-500">{label}</p>
    </div>
  );
}
```

- [ ] **Step 2: Wire the strip into intro page**

Modify `apps/web/app/trip/_components/trip-intro-page.tsx` imports:

```tsx
import { TripTimeControlStrip } from "./trip-time-control-strip";
```

Then place it after the header:

```tsx
<TripIntroHeader compactVisible={introComplete} trip={trip} />
<TripTimeControlStrip trip={trip} />
<TripHero trip={trip} />
```

- [ ] **Step 3: Run targeted checks**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web lint
```

Expected: both commands pass.

- [ ] **Step 4: Commit time strip**

Run:

```bash
git add apps/web/app/trip/_components/trip-time-control-strip.tsx apps/web/app/trip/_components/trip-intro-page.tsx
git commit -m "feat: 전주 인트로 여행 시계 추가"
```

Expected: commit includes the countdown/elapsed strip only.

## Task 3: Convert Intro Header To Shrinking Mobile Header

**Files:**

- Modify: `apps/web/app/trip/_components/trip-intro-header.tsx`

- [ ] **Step 1: Replace static sticky header with scroll CSS variables**

Replace `TripIntroHeader` with a version that writes CSS variables from scroll progress:

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import type { Trip } from "../_data/trips";

export function TripIntroHeader({
  compactVisible,
  trip,
}: {
  compactVisible: boolean;
  trip: Trip;
}) {
  const headerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    let frame: number | undefined;
    let lastProgress = -1;

    const setProgress = (progress: number) => {
      const target = headerRef.current;
      if (!target || progress === lastProgress) return;
      lastProgress = progress;
      const lerp = (from: number, to: number) => from + (to - from) * progress;

      target.style.setProperty("--trip-intro-header-pt", `${lerp(12, 6)}px`);
      target.style.setProperty("--trip-intro-header-px", `${lerp(12, 10)}px`);
      target.style.setProperty("--trip-intro-header-py", `${lerp(8, 6)}px`);
      target.style.setProperty(
        "--trip-intro-header-radius",
        `${lerp(999, 18)}px`,
      );
      target.style.setProperty("--trip-intro-title-size", `${lerp(14, 12)}px`);
      target.style.setProperty("--trip-intro-cta-height", `${lerp(36, 30)}px`);
    };

    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        const progress = Math.min(Math.max(window.scrollY / 128, 0), 1);
        setProgress(Number(progress.toFixed(3)));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 -mx-4 px-4 pt-[var(--trip-intro-header-pt)]"
      ref={headerRef}
      style={
        {
          "--trip-intro-cta-height": "36px",
          "--trip-intro-header-pt": "12px",
          "--trip-intro-header-px": "12px",
          "--trip-intro-header-py": "8px",
          "--trip-intro-header-radius": "999px",
          "--trip-intro-title-size": "14px",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between rounded-[var(--trip-intro-header-radius)] border border-white/70 bg-white/86 px-[var(--trip-intro-header-px)] py-[var(--trip-intro-header-py)] shadow-lg backdrop-blur-xl">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.28em] text-neutral-500 uppercase">
            Jeonju 2026
          </p>
          <AnimatePresence mode="popLayout" initial={false}>
            {compactVisible ? (
              <motion.p
                className="truncate font-black tracking-[-0.04em] text-neutral-950"
                layoutId="trip-intro-title"
                style={{ fontSize: "var(--trip-intro-title-size)" }}
                transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
              >
                <DiaTextReveal
                  colors={["#ef4444", "#f97316", "#2563eb"]}
                  duration={1.2}
                  text={trip.title}
                />
              </motion.p>
            ) : (
              <span className="block h-4" aria-hidden="true" />
            )}
          </AnimatePresence>
        </div>
        <Link
          className="bg-primary text-primary-foreground inline-flex h-[var(--trip-intro-cta-height)] shrink-0 items-center justify-center rounded-full px-3 text-xs font-black"
          href={`/trip/${trip.slug}/schedule`}
        >
          일정
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Run targeted checks**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web lint
```

Expected: both commands pass.

- [ ] **Step 3: Commit shrinking header**

Run:

```bash
git add apps/web/app/trip/_components/trip-intro-header.tsx
git commit -m "feat: 전주 인트로 축소 헤더 추가"
```

Expected: commit includes only the header change.

## Task 4: Rebuild Hero And Photo Marquee

**Files:**

- Modify: `apps/web/app/trip/_components/trip-hero.tsx`
- Create: `apps/web/app/trip/_components/trip-photo-marquee.tsx`
- Modify: `apps/web/app/trip/_components/trip-intro-page.tsx`

- [ ] **Step 1: Create photo marquee wrapper**

Create `apps/web/app/trip/_components/trip-photo-marquee.tsx`:

```tsx
"use client";

import { useReducedMotion } from "motion/react";

import { ThreeDMarquee } from "@/components/aceternity/3d-marquee";

import type { Trip } from "../_data/trips";

function getTripImages(trip: Trip) {
  const placeImages = trip.places
    .map((place) => place.imageUrl)
    .filter((image): image is string => Boolean(image));

  return [
    "/trips/jeonju-2026/intro/01-sea.jpg",
    "/trips/jeonju-2026/intro/02-fireworks.jpg",
    "/trips/jeonju-2026/intro/03-stars.jpg",
    "/trips/jeonju-2026/intro/04-field.jpg",
    ...placeImages,
  ];
}

export function TripPhotoMarquee({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const images = getTripImages(trip);

  if (images.length === 0) {
    return (
      <section className="rounded-[2rem] border bg-white p-5 shadow-sm">
        <p className="text-sm font-black text-neutral-950">
          전주 여행 사진을 준비 중입니다.
        </p>
      </section>
    );
  }

  if (prefersReducedMotion) {
    return (
      <section className="grid grid-cols-2 gap-2 rounded-[2rem] border bg-white p-2 shadow-sm">
        {images.slice(0, 4).map((image) => (
          <img
            alt=""
            className="aspect-[4/5] rounded-[1.4rem] object-cover"
            key={image}
            src={image}
          />
        ))}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-neutral-950 shadow-2xl">
      <ThreeDMarquee className="min-h-[28rem] opacity-88" images={images} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))] p-5 pt-24">
        <p className="text-xs font-black tracking-[0.22em] text-white/58 uppercase">
          photo field
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-[-0.08em] text-white">
          우리가 지나갈 장면들
        </h2>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace hero with invitation layout**

Replace `apps/web/app/trip/_components/trip-hero.tsx` with a smaller mobile invitation hero that keeps the title, KTX details, and CTA:

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { DiaTextReveal } from "@repo/ui/components/dia-text-reveal";

import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { BorderBeam } from "@/components/magicui/border-beam";

import type { Trip } from "../_data/trips";
import { TripParallaxLayer } from "./trip-parallax-layer";

export function TripHero({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  return (
    <section className="relative">
      <motion.div
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative min-h-[38rem] overflow-hidden rounded-[2.5rem] border border-white/60 bg-[radial-gradient(circle_at_12%_0%,rgba(248,113,113,0.38),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(59,130,246,0.28),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,247,237,0.88))] p-5 shadow-2xl"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
        transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
      >
        <BorderBeam
          borderWidth={1}
          colorFrom="#ef4444"
          colorTo="#2563eb"
          duration={9}
          size={170}
        />
        <TripParallaxLayer className="relative z-10" speed={10}>
          <p className="text-xs font-black tracking-[0.28em] text-red-500 uppercase">
            date invitation
          </p>
          <h1 className="mt-5 min-h-32 text-6xl font-black tracking-[-0.09em] text-balance text-neutral-950">
            {prefersReducedMotion ? (
              <span className="leading-[0.9]">{trip.title}</span>
            ) : (
              <DiaTextReveal
                className="leading-[0.9]"
                colors={["#ef4444", "#f97316", "#2563eb", "#111827"]}
                delay={0.2}
                duration={1.45}
                text={trip.title}
              />
            )}
          </h1>
          <p className="mt-4 max-w-[18rem] text-sm leading-6 font-semibold text-neutral-600">
            {trip.subtitle}
          </p>
        </TripParallaxLayer>

        <TripParallaxLayer className="relative z-10 mt-8" speed={-10}>
          <div className="rounded-[2rem] bg-neutral-950 p-5 text-white shadow-2xl">
            <p className="text-[10px] font-black tracking-[0.24em] text-white/46 uppercase">
              boarding pass
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-black tracking-[-0.08em]">
                  {outbound?.train?.from ?? "용산"}
                </p>
                <p className="text-xs font-bold text-white/50">
                  {outbound?.startsAt ?? "20:09"}
                </p>
              </div>
              <div className="mb-3 h-px flex-1 bg-white/20" />
              <div className="text-right">
                <p className="text-4xl font-black tracking-[-0.08em]">
                  {outbound?.train?.to ?? "전주"}
                </p>
                <p className="text-xs font-bold text-white/50">
                  {outbound?.endsAt ?? "21:47"}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-black">
              <span className="rounded-full bg-white px-3 py-1 text-neutral-950">
                {outbound?.train?.number ?? "KTX 521"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                {outbound?.train?.car ?? "14호차"}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                {outbound?.train?.seats.join(", ") ?? "1A, 1B"}
              </span>
            </div>
          </div>
        </TripParallaxLayer>

        <div className="absolute inset-x-5 bottom-5 z-10">
          <Link
            className="bg-primary text-primary-foreground inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-black shadow-lg"
            href={`/trip/${trip.slug}/schedule`}
          >
            <AnimatedGradientText colorFrom="#ffffff" colorTo="#fde68a">
              일정 자세히 보기
            </AnimatedGradientText>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Insert photo marquee into page**

Modify `apps/web/app/trip/_components/trip-intro-page.tsx`:

```tsx
import { TripPhotoMarquee } from "./trip-photo-marquee";
```

Then place it after hero:

```tsx
<TripHero trip={trip} />
<TripPhotoMarquee trip={trip} />
```

- [ ] **Step 4: Run targeted checks**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web lint
```

Expected: both commands pass. The Aceternity wrapper owns any generated export-name differences so `trip-photo-marquee.tsx` keeps the import shown above.

- [ ] **Step 5: Commit hero and marquee**

Run:

```bash
git add apps/web/app/trip/_components/trip-hero.tsx apps/web/app/trip/_components/trip-photo-marquee.tsx apps/web/app/trip/_components/trip-intro-page.tsx
git commit -m "feat: 전주 인트로 초대장 히어로 추가"
```

Expected: commit includes the invitation hero and photo marquee integration.

## Task 5: Add Auto Itinerary Stepper And Closing CTA

**Files:**

- Create: `apps/web/app/trip/_components/trip-auto-itinerary-stepper.tsx`
- Create: `apps/web/app/trip/_components/trip-closing-cta.tsx`
- Modify: `apps/web/app/trip/_components/trip-intro-page.tsx`

- [ ] **Step 1: Create auto itinerary stepper**

Create `apps/web/app/trip/_components/trip-auto-itinerary-stepper.tsx`:

```tsx
"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { Stepper } from "@/components/reactbits/stepper";

import type { ItineraryItem, Trip } from "../_data/trips";

const STEP_DURATION_MS = 5200;
const STEP_IDS = [
  "ktx-521-yongsan-to-jeonju",
  "jeonju-arrival",
  "jeonju-tourist-hotel",
  "day-2-jeondong-cathedral",
  "day-2-deokjin-park",
  "day-2-jinmijip",
  "ktx-510-jeonju-to-yongsan",
] as const;

function getStepperItems(trip: Trip): ItineraryItem[] {
  return STEP_IDS.map((id) =>
    trip.itinerary.find((item) => item.id === id),
  ).filter((item): item is ItineraryItem => Boolean(item));
}

export function TripAutoItineraryStepper({ trip }: { trip: Trip }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const steps = React.useMemo(() => getStepperItems(trip), [trip]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (steps.length <= 1) return;

    const startedAt = performance.now();
    let frame: number;

    const tick = (timestamp: number) => {
      const ratio = Math.min((timestamp - startedAt) / STEP_DURATION_MS, 1);
      setProgress(ratio);

      if (ratio >= 1) {
        setActiveIndex((current) => (current + 1) % steps.length);
        setProgress(0);
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, steps.length]);

  if (steps.length === 0) return null;

  const active = steps[activeIndex] ?? steps[0];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-4 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] text-blue-500 uppercase">
            auto itinerary
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.07em] text-neutral-950">
            다음 장면 미리보기
          </h2>
        </div>
        <span className="rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-black text-white">
          {activeIndex + 1}/{steps.length}
        </span>
      </div>

      <div className="mt-4">
        <Stepper
          activeStep={activeIndex}
          onStepChange={(index: number) => {
            setActiveIndex(index);
            setProgress(0);
          }}
          steps={steps.map((step) => step.title)}
        />
      </div>

      <article className="mt-4 rounded-[1.5rem] bg-neutral-950 p-4 text-white">
        <p className="text-xs font-black text-white/48">
          {active.startsAt ?? active.day.slice(5)}
        </p>
        <h3 className="mt-2 text-xl font-black tracking-[-0.05em]">
          {active.title}
        </h3>
        <p className="mt-2 text-sm leading-6 font-semibold text-white/68">
          {active.description}
        </p>
      </article>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-950/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#ef4444,#2563eb)]"
          style={{
            transform: `scaleX(${prefersReducedMotion ? 1 : progress})`,
            transformOrigin: "left",
          }}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create closing CTA**

Create `apps/web/app/trip/_components/trip-closing-cta.tsx`:

```tsx
import Link from "next/link";

import type { Trip } from "../_data/trips";

export function TripClosingCta({ trip }: { trip: Trip }) {
  return (
    <section className="rounded-[2rem] bg-neutral-950 p-5 text-white shadow-2xl">
      <p className="text-xs font-black tracking-[0.24em] text-white/48 uppercase">
        full schedule
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.08em]">
        지도와 일정은 다음 화면에서
      </h2>
      <p className="mt-3 text-sm leading-6 font-semibold text-white/62">
        날짜별 동선, 지도, 장소 카드는 전체 일정 화면에서 더 자세히 볼 수
        있어요.
      </p>
      <Link
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-black text-neutral-950"
        href={`/trip/${trip.slug}/schedule`}
      >
        전체 일정 열기
      </Link>
    </section>
  );
}
```

- [ ] **Step 3: Replace old support sections**

Modify `apps/web/app/trip/_components/trip-intro-page.tsx` imports:

```tsx
import { TripAutoItineraryStepper } from "./trip-auto-itinerary-stepper";
import { TripClosingCta } from "./trip-closing-cta";
```

Remove these imports:

```tsx
import { TripBentoGrid } from "./trip-bento-grid";
import { TripStoryStack } from "./trip-story-stack";
```

Then replace the old body order:

```tsx
<TripHero trip={trip} />
<TripPhotoMarquee trip={trip} />
<TripAutoItineraryStepper trip={trip} />
<TripClosingCta trip={trip} />
```

- [ ] **Step 4: Run targeted checks**

Run:

```bash
pnpm --filter @repo/web check-types
pnpm --filter @repo/web lint
```

Expected: both commands pass. The `apps/web/components/reactbits/stepper.tsx` wrapper owns generated Stepper prop differences so `trip-auto-itinerary-stepper.tsx` keeps the prop shape shown above.

- [ ] **Step 5: Commit stepper and CTA**

Run:

```bash
git add apps/web/app/trip/_components/trip-auto-itinerary-stepper.tsx apps/web/app/trip/_components/trip-closing-cta.tsx apps/web/app/trip/_components/trip-intro-page.tsx
git commit -m "feat: 전주 인트로 자동 일정 스텝퍼 추가"
```

Expected: commit includes auto stepper, progress bar, closing CTA, and page composition update.

## Task 6: Mobile QA And Final Verification

**Files:**

- Modify only if QA finds bugs in files touched by Tasks 1-5.

- [ ] **Step 1: Run full relevant gates**

Run:

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
git diff --check
```

Expected: all commands pass.

- [ ] **Step 2: Start web dev server**

Run:

```bash
pnpm --filter @repo/web dev
```

Expected: Next.js serves the web app on port `3000` unless the port is already in use.

- [ ] **Step 3: Browser QA at 390px**

Open `/trip/jeonju-2026` at `390x844`.

Expected:

- first-entry photo flash still appears
- page body is mobile width and has no horizontal overflow
- header sticks and shrinks gradually on scroll
- time strip shows `용산역 출발까지` before `2026-07-10 20:09`
- 3D Marquee images render without covering text
- Stepper advances automatically and progress bar resets

- [ ] **Step 4: Browser QA at 360px**

Open `/trip/jeonju-2026` at `360x800`.

Expected:

- hero title does not overflow
- countdown unit cards remain inside the viewport
- Stepper labels remain readable or gracefully wrap/truncate
- closing CTA is visible and navigates to `/trip/jeonju-2026/schedule`

- [ ] **Step 5: Reduced motion QA**

Enable reduced motion in the browser context or emulate it via Playwright.

Expected:

- countdown remains readable
- photo marquee falls back to static image grid or non-distracting motion
- Stepper content is still available
- no primary information depends on hover-only or continuous animation

- [ ] **Step 6: Final commit for QA fixes**

If QA required fixes, commit them:

```bash
git add apps/web/app/trip apps/web/components
git commit -m "fix: 전주 인트로 모바일 QA 반영"
```

Expected: final branch contains small implementation commits and all verification is passing.
