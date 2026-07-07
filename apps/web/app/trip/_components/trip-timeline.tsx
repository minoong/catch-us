"use client";

import * as React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";

import AnimatedList from "@/components/AnimatedList";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
} from "@/components/motion-primitives/carousel";

import { AnimatedShinyText } from "@repo/ui/components/animated-shiny-text";
import { ComicText } from "@repo/ui/components/comic-text";
import { Highlighter } from "@repo/ui/components/highlighter";
import { LineShadowText } from "@repo/ui/components/line-shadow-text";
import { TextAnimate } from "@repo/ui/components/text-animate";
import { WordRotate } from "@repo/ui/components/word-rotate";
import { cn } from "@repo/ui/lib/utils";

import type { ItineraryItem, Trip } from "../_data/trips";
import { getPlace } from "../_lib/itinerary";
import { TripTicketCard } from "./trip-ticket-card";

const KAKAO_MAP_ICON_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAMFBMVEVHcEz74gD64QD74QD/5gCmt5dWlNoBff+7wX8Aev8Adf/X0FXv3CKBprs6iultncpB9jfEAAAAA3RSTlMAFrQq4gacAAAAtUlEQVR4AWNgVDaGAyMBBmFjJGDIAJJESDOAKRMXF2cwgwHMM00vC0FwPWZOL1++BcY16SoHgtUwrs3ychCAcX2nl697VV4VAuV6lldtcV1e+QTKPVU+39nkZfkSOHeus0kmkAtTXH7EG6gYYVTtzfLKEIRFldPLy52xOQOkenk50Fo4F2gs0HA419i8HGguguuxvGozEtfk5XyY98GgC2Quguv5BIVr2gzjogC0gEULdrRIAQAJ728UWgz10AAAAABJRU5ErkJggg==";
const MONKEY_HANGING_LOTTIE_SRC = "/trips/jeonju-2026/monkey-hanging.lottie";
const LOVE_LOTTIE_SRC = "/trips/jeonju-2026/love.lottie";

const kindMeta: Record<
  ItineraryItem["kind"],
  { label: string; marker: string; tone: string; dot: string; chip: string }
> = {
  cafe: {
    chip: "bg-amber-500 text-white",
    dot: "border-amber-500 text-amber-500",
    label: "Cafe",
    marker: "CA",
    tone: "bg-amber-500",
  },
  hotel: {
    chip: "bg-sky-600 text-white",
    dot: "border-sky-600 text-sky-600",
    label: "Stay",
    marker: "ST",
    tone: "bg-sky-600",
  },
  meal: {
    chip: "bg-rose-600 text-white",
    dot: "border-rose-600 text-rose-600",
    label: "Meal",
    marker: "ME",
    tone: "bg-rose-600",
  },
  place: {
    chip: "bg-violet-600 text-white",
    dot: "border-violet-600 text-violet-600",
    label: "Plan",
    marker: "SP",
    tone: "bg-violet-600",
  },
  station: {
    chip: "bg-zinc-900 text-white",
    dot: "border-zinc-900 text-zinc-900",
    label: "Station",
    marker: "AR",
    tone: "bg-zinc-900",
  },
  train: {
    chip: "bg-teal-600 text-white",
    dot: "border-teal-600 text-teal-600",
    label: "KTX",
    marker: "TX",
    tone: "bg-teal-600",
  },
  transport: {
    chip: "bg-emerald-600 text-white",
    dot: "border-emerald-600 text-emerald-600",
    label: "Move",
    marker: "MV",
    tone: "bg-emerald-600",
  },
  walk: {
    chip: "bg-lime-700 text-white",
    dot: "border-lime-700 text-lime-700",
    label: "Walk",
    marker: "WK",
    tone: "bg-lime-700",
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (index = 0) => ({
    opacity: 1,
    transition: {
      delay: 0.06 + index * 0.04,
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
    y: 0,
  }),
};

const uiVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 6 },
  visible: (index = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.04 + index * 0.035,
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1],
    },
    y: 0,
  }),
};

const railVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (index = 0) => ({
    opacity: 1,
    transition: {
      delay: 0.04 + index * 0.04,
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const timelineRailViewport = { amount: 0.35, once: true };
const timelineCardViewport = { amount: 0.28, once: true };

interface ItineraryDayGroup {
  day: ItineraryItem["day"];
  entries: TimelineEntry[];
  items: ItineraryItem[];
}

interface TimelineEntry {
  day: ItineraryItem["day"];
  id: string;
  items: ItineraryItem[];
  startsAt?: string;
}

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
  const scheduleRef = React.useRef<HTMLElement>(null);
  const daySectionRefs = React.useRef(new Map<string, HTMLElement>());
  const dayGroups = React.useMemo(() => groupItemsByDay(items), [items]);
  const [monkeyDay, setMonkeyDay] = React.useState(dayGroups[0]?.day ?? "");

  React.useEffect(() => {
    let frame: number | undefined;

    const updateMonkeyDay = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        const stickyThreshold = 18.25 * 16 + 16;
        let nextMonkeyDay = dayGroups[0]?.day ?? "";

        dayGroups.forEach((group) => {
          const section = daySectionRefs.current.get(group.day);
          if (!section) return;
          if (section.getBoundingClientRect().top <= stickyThreshold) {
            nextMonkeyDay = group.day;
          }
        });

        setMonkeyDay((currentDay) =>
          currentDay === nextMonkeyDay ? currentDay : nextMonkeyDay,
        );
      });
    };

    updateMonkeyDay();
    window.addEventListener("scroll", updateMonkeyDay, { passive: true });
    window.addEventListener("resize", updateMonkeyDay);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateMonkeyDay);
      window.removeEventListener("resize", updateMonkeyDay);
    };
  }, [dayGroups]);

  useGSAP(
    () => {
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (motionQuery.matches) return;

      gsap.fromTo(
        ".trip-timeline-line",
        { scaleY: 0, transformOrigin: "top center" },
        { duration: 0.9, ease: "power3.out", scaleY: 1 },
      );

      gsap.fromTo(
        ".trip-timeline-dot-core[data-active='true']",
        { boxShadow: "0 0 0 0 rgba(20,184,166,0.36)", scale: 0.92 },
        {
          boxShadow: "0 0 0 16px rgba(20,184,166,0)",
          duration: 1.1,
          ease: "power2.out",
          repeat: 1,
          scale: 1.18,
          yoyo: true,
        },
      );
    },
    { dependencies: [items, activeItemId], scope: scheduleRef },
  );

  return (
    <section
      aria-label="날짜별 여행 일정"
      className="bg-slate-50 pt-2 pb-6"
      ref={scheduleRef}
    >
      <div className="grid gap-1 px-3 py-1">
        {dayGroups.map((group, groupIndex) => (
          <TimelineDaySection
            activeItemId={activeItemId}
            group={group}
            groupIndex={groupIndex}
            key={group.day}
            monkeyActive={monkeyDay === group.day}
            onActiveItemChange={onActiveItemChange}
            sectionRef={(section) => {
              if (section) {
                daySectionRefs.current.set(group.day, section);
              } else {
                daySectionRefs.current.delete(group.day);
              }
            }}
            trip={trip}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineDaySection({
  activeItemId,
  group,
  groupIndex,
  monkeyActive,
  onActiveItemChange,
  sectionRef,
  trip,
}: {
  activeItemId: string;
  group: ItineraryDayGroup;
  groupIndex: number;
  monkeyActive: boolean;
  onActiveItemChange: (itemId: string) => void;
  sectionRef: (section: HTMLElement | null) => void;
  trip: Trip;
}) {
  const activeIndex = Math.max(
    0,
    group.entries.findIndex((entry) =>
      entry.items.some((item) => item.id === activeItemId),
    ),
  );

  return (
    <section
      className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-1"
      ref={sectionRef}
    >
      <StickyDateRail
        day={group.day}
        groupIndex={groupIndex}
        monkeyActive={monkeyActive}
        tripStart={trip.startsOn}
      />
      <AnimatedList
        className="min-w-0"
        displayScrollbar={false}
        disableItemScale
        enableArrowNavigation={false}
        getItemKey={(entry) => entry.id}
        initialSelectedIndex={activeIndex}
        itemClassName="timeline-row"
        itemViewportAmount={0.18}
        items={group.entries}
        listClassName="overflow-visible"
        onItemSelect={(entry) => onActiveItemChange(entry.items[0]?.id ?? "")}
        renderItem={(entry, index, selected) => (
          <TimelineRow
            active={
              entry.items.some((item) => item.id === activeItemId) || selected
            }
            activeItemId={activeItemId}
            entry={entry}
            index={index}
            onActiveItemChange={onActiveItemChange}
            trip={trip}
          />
        )}
        showGradients={false}
      />
    </section>
  );
}

function StickyDateRail({
  day,
  groupIndex,
  monkeyActive,
  tripStart,
}: {
  day: ItineraryItem["day"];
  groupIndex: number;
  monkeyActive: boolean;
  tripStart: string;
}) {
  const dateParts = formatTimelineDate(day, tripStart);

  return (
    <div className="relative min-h-full">
      <motion.div
        className="trip-sticky-date sticky top-[18.25rem] z-20 flex w-10 flex-col items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50/95 py-2 shadow-[0_8px_18px_rgba(15,23,42,0.08)] backdrop-blur"
        custom={groupIndex}
        initial="hidden"
        variants={railVariants}
        whileInView="visible"
        viewport={timelineRailViewport}
      >
        <span className="text-[10px] leading-none font-black tracking-[0.08em] text-slate-400">
          {dateParts.month}
        </span>
        <ComicText
          accentColor="#e2e8f0"
          className="text-center"
          fillColor="#0f172a"
          fontSize={1.22}
          shadowColor="#cbd5e1"
          strokeColor="#ffffff"
        >
          {dateParts.date}
        </ComicText>
        {monkeyActive ? (
          <motion.span
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-hidden="true"
            className="pointer-events-none absolute top-full left-1/2 grid size-10 -translate-x-1/2 place-items-center overflow-visible"
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="absolute -top-1 left-1/2 h-4 w-px -translate-x-1/2 bg-slate-300/80" />
            <DotLottieReact
              autoplay
              className="relative z-10 size-10"
              loop
              src={MONKEY_HANGING_LOTTIE_SRC}
            />
            <span className="absolute top-11 left-1/2 grid size-4 -translate-x-1/2 place-items-center overflow-visible">
              <DotLottieReact
                autoplay
                className="size-[18px]"
                loop
                src={LOVE_LOTTIE_SRC}
              />
            </span>
          </motion.span>
        ) : null}
      </motion.div>
    </div>
  );
}

function TimelineRow({
  active,
  activeItemId,
  entry,
  index,
  onActiveItemChange,
  trip,
}: {
  active: boolean;
  activeItemId: string;
  entry: TimelineEntry;
  index: number;
  onActiveItemChange: (itemId: string) => void;
  trip: Trip;
}) {
  const item = entry.items[0];
  if (!item) return null;

  const meta = kindMeta[item.kind];

  return (
    <div className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-1.5 py-3">
      <EventRail active={active} index={index} item={item} meta={meta} />
      <ScheduleEntryCards
        activeItemId={activeItemId}
        entry={entry}
        groupActive={active}
        onActiveItemChange={onActiveItemChange}
        trip={trip}
      />
    </div>
  );
}

function ScheduleEntryCards({
  activeItemId,
  entry,
  groupActive,
  onActiveItemChange,
  trip,
}: {
  activeItemId: string;
  entry: TimelineEntry;
  groupActive: boolean;
  onActiveItemChange: (itemId: string) => void;
  trip: Trip;
}) {
  const activeIndex = Math.max(
    0,
    entry.items.findIndex((item) => item.id === activeItemId),
  );

  if (entry.items.length === 1) {
    const item = entry.items[0];
    if (!item) return null;

    return (
      <ScheduleCard
        active={groupActive}
        item={item}
        meta={kindMeta[item.kind]}
        onActiveItemChange={onActiveItemChange}
        place={getPlace(trip, item.placeId)}
      />
    );
  }

  return (
    <Carousel
      className="min-w-0"
      index={activeIndex}
      onIndexChange={(nextIndex) => {
        const nextItem = entry.items[nextIndex];
        if (nextItem) onActiveItemChange(nextItem.id);
      }}
    >
      <CarouselContent className="items-stretch">
        {entry.items.map((item) => (
          <CarouselItem className="pr-0" key={item.id}>
            <ScheduleCard
              active={groupActive || activeItemId === item.id}
              item={item}
              meta={kindMeta[item.kind]}
              onActiveItemChange={onActiveItemChange}
              place={getPlace(trip, item.placeId)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselIndicator
        className="pointer-events-none bottom-2"
        classNameButton="pointer-events-auto h-1.5 w-5 rounded-full bg-slate-300 data-[active=true]:bg-rose-500"
      />
    </Carousel>
  );
}

function EventRail({
  active,
  index,
  item,
  meta,
}: {
  active: boolean;
  index: number;
  item: ItineraryItem;
  meta: (typeof kindMeta)[ItineraryItem["kind"]];
}) {
  return (
    <div className="relative flex min-h-full flex-col items-center pt-1.5">
      <div className="trip-timeline-line absolute top-0 bottom-[-2rem] left-1/2 w-px -translate-x-1/2 bg-slate-200" />
      <motion.span
        className="trip-timeline-dot relative z-10 grid size-4 place-items-center bg-slate-50"
        custom={index + 1}
        initial="hidden"
        variants={railVariants}
        whileInView="visible"
        viewport={timelineRailViewport}
      >
        <span
          className={cn(
            "trip-timeline-dot-core block size-3 rounded-full border-2 bg-white shadow-sm",
            active ? meta.dot : "border-slate-300 text-slate-300",
          )}
          data-active={active}
        />
        <span className="sr-only">{meta.marker}</span>
      </motion.span>
      <motion.p
        className="relative z-10 mt-2 rounded-full bg-slate-50 px-0.5 text-center text-[9px] leading-none font-black text-slate-500 [writing-mode:vertical-rl]"
        custom={index + 2}
        initial="hidden"
        variants={textVariants}
        whileInView="visible"
        viewport={timelineRailViewport}
      >
        {item.startsAt ?? meta.label}
      </motion.p>
    </div>
  );
}

function ScheduleCard({
  active,
  item,
  meta,
  onActiveItemChange,
  place,
}: {
  active: boolean;
  item: ItineraryItem;
  meta: (typeof kindMeta)[ItineraryItem["kind"]];
  onActiveItemChange: (itemId: string) => void;
  place?: ReturnType<typeof getPlace>;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const titleParts = getTitleParts(item.title);
  const labelWords = getLabelWords(item, meta);
  const hotelStay = getHotelStay(item);

  return (
    <motion.article
      className={cn(
        "relative min-w-0 overflow-hidden rounded-lg border bg-white shadow-[0_7px_18px_rgba(15,23,42,0.08)]",
        active ? "border-slate-300" : "border-white",
        item.train && "bg-[linear-gradient(180deg,#ffffff_0%,#f8fffd_100%)]",
      )}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
    >
      <button
        className="relative block w-full px-3 pt-3 pb-2.5 text-left"
        onClick={() => onActiveItemChange(item.id)}
        type="button"
      >
        <div
          className={cn(
            "grid min-w-0 items-start gap-2.5",
            place?.imageUrl
              ? "grid-cols-[minmax(0,1fr)_4.75rem] sm:grid-cols-[minmax(0,1fr)_5.25rem]"
              : "grid-cols-1",
          )}
        >
          <div className="min-w-0">
            <motion.span
              className={cn(
                "inline-flex rounded-md px-2 py-1 text-[12px] leading-none font-black",
                meta.chip,
              )}
              custom={0}
              initial="hidden"
              variants={uiVariants}
              whileInView="visible"
              viewport={timelineCardViewport}
            >
              <AnimatedShinyText className="mx-0 max-w-none text-white">
                <WordRotate
                  className="min-w-[3.25rem] text-left"
                  duration={1900}
                  words={labelWords}
                />
              </AnimatedShinyText>
            </motion.span>

            <motion.h3
              className="mt-2 text-[1.02rem] leading-tight font-black text-slate-950"
              custom={1}
              initial="hidden"
              variants={uiVariants}
              viewport={timelineCardViewport}
              whileInView="visible"
            >
              {titleParts.prefix ? (
                <TextAnimate
                  accessible={false}
                  animation="blurInUp"
                  as="span"
                  by="word"
                  className="inline"
                  duration={0.42}
                  once
                >
                  {titleParts.prefix}
                </TextAnimate>
              ) : null}
              <LineShadowText
                className={cn("italic", item.train && "text-teal-700")}
                shadowColor={item.train ? "#99f6e4" : "#cbd5e1"}
              >
                {titleParts.highlight}
              </LineShadowText>
            </motion.h3>

            <TextAnimate
              animation="slideUp"
              as="p"
              by="line"
              className="mt-1 line-clamp-2 text-[13px] leading-[1.25rem] font-semibold text-slate-500"
              delay={0.06}
              duration={0.35}
              once
            >
              {item.description}
            </TextAnimate>
          </div>

          {place?.imageUrl ? (
            <motion.div
              className="relative mt-0.5 aspect-square w-[4.75rem] shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-[0_6px_14px_rgba(15,23,42,0.09),inset_0_0_0_1px_rgba(15,23,42,0.05)] sm:w-[5.25rem]"
              custom={1}
              initial="hidden"
              variants={uiVariants}
              viewport={timelineCardViewport}
              whileInView="visible"
            >
              <Image
                alt={place.name}
                className="object-cover"
                fill
                sizes="(max-width: 640px) 76px, 84px"
                src={place.imageUrl}
              />
            </motion.div>
          ) : null}
        </div>

        {hotelStay ? (
          <motion.div
            className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
            custom={3}
            initial="hidden"
            variants={uiVariants}
            viewport={timelineCardViewport}
            whileInView="visible"
          >
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <HotelStayCell
                date={hotelStay.checkIn.date}
                day={hotelStay.checkIn.day}
                label="체크인"
                time={hotelStay.checkIn.time}
              />
              <HotelStayCell
                date={hotelStay.checkOut.date}
                day={hotelStay.checkOut.day}
                label="체크아웃"
                time={hotelStay.checkOut.time}
              />
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-2.5 py-1.5">
              <span className="text-[10px] font-black tracking-[0.08em] text-slate-400">
                STAY
              </span>
              <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-[11px] font-black text-white">
                {hotelStay.nights}박
              </span>
            </div>
          </motion.div>
        ) : null}

        <motion.div
          className="mt-2.5 flex flex-wrap gap-1"
          custom={hotelStay ? 4 : 3}
          initial="hidden"
          variants={uiVariants}
          viewport={timelineCardViewport}
          whileInView="visible"
        >
          {item.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              className="text-[11px] font-black text-slate-600"
              key={`${item.id}-${tag}`}
            >
              <Highlighter
                action={tagIndex === 0 ? "highlight" : "underline"}
                animationDuration={420}
                color={tagIndex === 0 ? "#fde68a" : "#93c5fd"}
                isView
                padding={1}
                strokeWidth={2}
              >
                #{tag}
              </Highlighter>
            </span>
          ))}
        </motion.div>

        {item.train ? (
          <motion.div
            className="mt-3 rounded-[1.25rem] bg-white p-3 text-neutral-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]"
            custom={hotelStay ? 5 : 4}
            initial="hidden"
            variants={uiVariants}
            whileInView="visible"
            viewport={timelineCardViewport}
          >
            <TripTicketCard item={item} compact />
          </motion.div>
        ) : null}
      </button>

      <footer className="relative flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-3 py-2">
        {place?.kakaoPlaceUrl ? (
          <motion.a
            aria-label={`${place.name} 카카오맵 열기`}
            className="inline-grid size-8 place-items-center rounded-full bg-white shadow-[0_5px_12px_rgba(15,23,42,0.08)] transition active:scale-[0.96]"
            custom={5}
            href={place.kakaoPlaceUrl}
            initial="hidden"
            rel="noreferrer"
            target="_blank"
            variants={uiVariants}
            viewport={timelineCardViewport}
            whileInView="visible"
          >
            <Image
              alt=""
              aria-hidden="true"
              height={28}
              src={KAKAO_MAP_ICON_SRC}
              width={28}
            />
          </motion.a>
        ) : null}
      </footer>
    </motion.article>
  );
}

function HotelStayCell({
  date,
  day,
  label,
  time,
}: {
  date: string;
  day: string;
  label: string;
  time: string;
}) {
  return (
    <div className="px-2.5 py-2.5">
      <p className="text-[10px] font-black tracking-[0.08em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-base leading-none font-black text-slate-950">
        {date}
      </p>
      <p className="mt-0.5 text-[11px] font-bold text-slate-500">
        {day} · {time}
      </p>
    </div>
  );
}

function formatTimelineDate(day: string, tripStart: string) {
  const date = new Date(`${day}T00:00:00`);
  const start = new Date(`${tripStart}T00:00:00`);
  const diff = date.getTime() - start.getTime();
  const dayNumber = Math.max(1, Math.round(diff / 86_400_000) + 1);

  return {
    date: String(date.getDate()).padStart(2, "0"),
    dayNumber,
    month: String(date.getMonth() + 1).padStart(2, "0"),
  };
}

function groupItemsByDay(items: ItineraryItem[]) {
  return items.reduce<ItineraryDayGroup[]>((groups, item) => {
    const latestGroup = groups.at(-1);
    if (latestGroup?.day === item.day) {
      latestGroup.items.push(item);
      latestGroup.entries = groupItemsByTime(latestGroup.items);
    } else {
      groups.push({
        day: item.day,
        entries: groupItemsByTime([item]),
        items: [item],
      });
    }

    return groups;
  }, []);
}

function groupItemsByTime(items: ItineraryItem[]) {
  return items.reduce<TimelineEntry[]>((entries, item) => {
    const latestEntry = entries.at(-1);
    const startsAt = item.startsAt ?? item.id;

    if (latestEntry?.day === item.day && latestEntry.startsAt === startsAt) {
      latestEntry.items.push(item);
      latestEntry.id = latestEntry.items
        .map((entryItem) => entryItem.id)
        .join("--");
    } else {
      entries.push({
        day: item.day,
        id: item.id,
        items: [item],
        startsAt,
      });
    }

    return entries;
  }, []);
}

function getLabelWords(
  item: ItineraryItem,
  meta: (typeof kindMeta)[ItineraryItem["kind"]],
) {
  if (item.train) return [meta.label, item.train.number, item.train.car];
  if (item.startsAt) return [meta.label, item.startsAt];
  return [meta.label, meta.marker];
}

function getTitleParts(title: string) {
  if (title.includes("·")) {
    const [prefix, ...rest] = title.split("·");
    return {
      highlight: rest.join("·").trim(),
      prefix: `${prefix.trim()} · `,
    };
  }

  const words = title.split(" ");
  const highlight = words.pop() ?? title;
  return {
    highlight,
    prefix: words.length > 0 ? `${words.join(" ")} ` : "",
  };
}

function getHotelStay(item: ItineraryItem) {
  if (
    item.id !== "jeonju-tourist-hotel" ||
    item.kind !== "hotel" ||
    !item.startsAt ||
    !item.endsAt
  ) {
    return null;
  }

  const checkIn = parseStayDateTime(`${item.day} ${item.startsAt}`);
  const checkOut = parseStayDateTime(item.endsAt);
  const nights = Math.max(
    1,
    Math.round(
      (checkOut.dateTime.getTime() - checkIn.dateTime.getTime()) / 86_400_000,
    ),
  );

  return {
    checkIn,
    checkOut,
    nights,
  };
}

function parseStayDateTime(value: string) {
  const [datePart, timePart = "00:00"] = value.split(" ");
  const dateTime = new Date(`${datePart}T${timePart}:00`);
  const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(
    dateTime,
  );

  return {
    date: `${dateTime.getMonth() + 1}.${dateTime.getDate()}`,
    dateTime,
    day: weekday,
    time: timePart,
  };
}
