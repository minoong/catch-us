import Link from "next/link";

import Noise from "@/components/Noise";
import SplitText from "@/components/SplitText";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Backlight } from "@/components/magicui/backlight";

import type { Trip } from "../_data/trips";
import { TripTicketCard } from "./trip-ticket-card";

export function TripHero({ trip }: { trip: Trip }) {
  const outbound = trip.itinerary.find(
    (item) => item.id === "ktx-521-yongsan-to-jeonju",
  );

  return (
    <section className="relative min-h-[42rem] overflow-hidden rounded-[2.5rem] border bg-[radial-gradient(circle_at_20%_0%,rgba(248,113,113,0.36),transparent_38%),radial-gradient(circle_at_80%_12%,rgba(59,130,246,0.28),transparent_35%),linear-gradient(180deg,var(--card),var(--background))] p-5 shadow-2xl">
      <Noise patternAlpha={10} patternRefreshInterval={4} />
      <div className="absolute inset-x-8 top-6 h-40 rounded-full bg-white/30 blur-3xl" />

      <div className="relative z-10">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
          Jeonju 2026
        </p>
        <h1 className="mt-5 min-h-36 text-6xl font-semibold tracking-[-0.09em] text-balance">
          <SplitText
            className="leading-[0.9]"
            delay={55}
            duration={0.7}
            ease="power3.out"
            splitType="chars"
            tag="span"
            text={trip.title}
          />
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-6">
          {trip.subtitle}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
            Private trip board
          </span>
          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            KTX · 전주 · 2박 3일
          </span>
        </div>
        <Link
          className="bg-primary text-primary-foreground mt-6 inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-lg"
          href={`/trip/${trip.slug}/schedule`}
        >
          일정 탐색 열기
        </Link>
      </div>

      <div className="absolute inset-x-5 bottom-5 z-10">
        <Backlight blur={12}>
          <div>{outbound ? <TripTicketCard item={outbound} /> : null}</div>
        </Backlight>
      </div>

      <div className="absolute right-5 bottom-72 z-10 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur">
        <AnimatedGradientText colorFrom="#ef4444" colorTo="#2563eb">
          용산에서 전주까지
        </AnimatedGradientText>
      </div>
    </section>
  );
}
