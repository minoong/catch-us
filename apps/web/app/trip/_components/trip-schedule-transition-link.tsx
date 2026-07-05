"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

const TRANSITION_DELAY_MS = 1000;

const LOADING_CUTS = [
  {
    image: "/trips/jeonju-2026/loader-gifs/monogatari-purple.gif",
    label: "바케모노가타리 컷신 로딩",
    line: "전주행 괴이 루트, 지금 개방합니다.",
  },
  {
    image: "/trips/jeonju-2026/loader-gifs/monogatari-gold.gif",
    label: "오타쿠 투어 체크",
    line: "센조가하라식 태세 정돈. 일정으로 갑니다.",
  },
  {
    image: "/trips/jeonju-2026/loader-gifs/tour-cat.gif",
    label: "좀비랜드사가 모드",
    line: "사가 말고 전주로 부활 라이브 출발!",
  },
  {
    image: "/trips/jeonju-2026/loader-gifs/monogatari-purple.gif",
    label: "은혼식 급출발",
    line: "대충 멋있게 외치고 일정 화면으로 돌격.",
  },
] as const;

export function TripScheduleTransitionLink({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [activeCut, setActiveCut] =
    React.useState<(typeof LOADING_CUTS)[number]>();
  const isNavigatingRef = React.useRef(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      isNavigatingRef.current
    ) {
      return;
    }

    event.preventDefault();
    isNavigatingRef.current = true;

    const cut = LOADING_CUTS[Math.floor(Math.random() * LOADING_CUTS.length)];
    setActiveCut(cut);

    timeoutRef.current = window.setTimeout(() => {
      router.push(href);
    }, TRANSITION_DELAY_MS);
  }

  const overlay = (
    <AnimatePresence>
      {activeCut ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-neutral-950/72 px-6 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { scale: 1, y: 0 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/20 bg-white p-3 text-neutral-950 shadow-2xl"
            initial={prefersReducedMotion ? undefined : { scale: 0.92, y: 18 }}
            transition={{ damping: 18, stiffness: 260, type: "spring" }}
          >
            <div className="overflow-hidden rounded-[1.45rem] bg-neutral-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="h-44 w-full object-cover"
                src={activeCut.image}
              />
            </div>
            <div className="p-3">
              <p className="text-[10px] font-black tracking-[0.22em] text-red-500 uppercase">
                otaku tour loading
              </p>
              <h2 className="mt-1 text-2xl leading-7 font-black tracking-[-0.06em]">
                {activeCut.label}
              </h2>
              <p className="mt-2 text-sm leading-5 font-bold text-neutral-500">
                {activeCut.line}
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-950/10">
                <motion.div
                  animate={{ scaleX: 1 }}
                  className={cn(
                    "h-full origin-left rounded-full",
                    "bg-[linear-gradient(90deg,#ef4444,#f97316,#2563eb)]",
                  )}
                  initial={{ scaleX: 0 }}
                  transition={{
                    duration: prefersReducedMotion
                      ? 0.1
                      : TRANSITION_DELAY_MS / 1000,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <Link className={className} href={href} onClick={handleClick}>
        {children}
      </Link>
      {activeCut ? createPortal(overlay, document.body) : null}
    </>
  );
}
