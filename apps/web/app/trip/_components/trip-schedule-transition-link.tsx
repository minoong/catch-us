"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { InteractiveHoverButton } from "@repo/ui/components/interactive-hover-button";
import { cn } from "@repo/ui/lib/utils";

const BUTTON_RELAY_MS = 620;
const CUT_PREVIEW_MS = 720;
const CUT_FLY_MS = 460;

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

type CutPhase = "fly" | "preview";

export function TripScheduleTransitionLink({
  children,
  className,
  href,
  size = "default",
  variant = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  size?: "compact" | "default";
  variant?: "dark" | "light" | "primary";
}) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [activeCut, setActiveCut] =
    React.useState<(typeof LOADING_CUTS)[number]>();
  const [cutPhase, setCutPhase] = React.useState<CutPhase>("preview");
  const [forceHover, setForceHover] = React.useState(false);
  const isNavigatingRef = React.useRef(false);
  const timeoutRefs = React.useRef<number[]>([]);

  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  function queueTimeout(callback: () => void, delay: number) {
    const timeout = window.setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter(
        (queuedTimeout) => queuedTimeout !== timeout,
      );
      callback();
    }, delay);

    timeoutRefs.current.push(timeout);
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (event.button !== 0 || isNavigatingRef.current) {
      return;
    }

    event.preventDefault();
    isNavigatingRef.current = true;
    setForceHover(true);

    const cut = LOADING_CUTS[Math.floor(Math.random() * LOADING_CUTS.length)];

    queueTimeout(() => {
      setForceHover(false);
      setCutPhase("preview");
      setActiveCut(cut);

      queueTimeout(
        () => {
          setCutPhase("fly");
        },
        prefersReducedMotion ? 80 : CUT_PREVIEW_MS,
      );

      queueTimeout(
        () => {
          router.push(href);
        },
        prefersReducedMotion ? 180 : CUT_PREVIEW_MS + CUT_FLY_MS,
      );
    }, BUTTON_RELAY_MS);
  }

  const overlay = (
    <AnimatePresence>
      {activeCut ? (
        <motion.div
          animate={{
            backdropFilter: cutPhase === "fly" ? "blur(4px)" : "blur(12px)",
            opacity: 1,
          }}
          className="fixed inset-0 z-[90] bg-neutral-950/72 px-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
        >
          <motion.div
            animate={
              cutPhase === "fly"
                ? {
                    borderRadius: 30,
                    height: 228,
                    left: "50%",
                    top: "4.25rem",
                    width: "min(calc(100vw - 2rem), 28rem)",
                    x: "-50%",
                    y: 0,
                  }
                : {
                    borderRadius: 32,
                    height: 224,
                    left: "50%",
                    top: "50%",
                    width: "min(calc(100vw - 3rem), 24rem)",
                    x: "-50%",
                    y: "-50%",
                  }
            }
            className="absolute overflow-hidden border border-white/20 bg-neutral-950 shadow-2xl"
            initial={
              prefersReducedMotion
                ? false
                : {
                    borderRadius: 32,
                    height: 224,
                    left: "50%",
                    scale: 0.92,
                    top: "50%",
                    width: "min(calc(100vw - 3rem), 24rem)",
                    x: "-50%",
                    y: "calc(-50% + 18px)",
                  }
            }
            transition={{
              damping: cutPhase === "fly" ? 26 : 20,
              stiffness: cutPhase === "fly" ? 210 : 260,
              type: "spring",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="h-full w-full object-cover"
              src={activeCut.image}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <InteractiveHoverButton
        className={cn(
          "border-0 font-black",
          "data-[force-hover=true]:scale-[0.96] data-[force-hover=true]:ring-4 data-[force-hover=true]:ring-red-400/40",
          "group-active:[&>div:first-child>div]:scale-[100.8] group-active:[&>div:first-child>span]:opacity-0 group-active:[&>div:last-child]:opacity-100",
          size === "default" &&
            "h-full w-full px-4 py-0 text-sm group-active:[&>div:first-child>span]:translate-x-12 group-active:[&>div:last-child]:-translate-x-5",
          size === "compact" &&
            "h-full w-full px-2 py-0 text-xs [&>div:first-child]:gap-1.5 [&>div:first-child>div]:size-1.5 [&>div:first-child>span]:whitespace-nowrap group-active:[&>div:first-child>span]:translate-x-12 [&>div:last-child]:translate-x-0 [&>div:last-child]:gap-0 group-hover:[&>div:last-child]:translate-x-0 group-active:[&>div:last-child]:translate-x-0 group-data-[force-hover=true]:[&>div:last-child]:translate-x-0 [&>div:last-child>span]:hidden [&>div:last-child>svg]:size-4",
          variant === "dark" &&
            "bg-neutral-950 text-white [--primary-foreground:#111111] [--primary:#ffffff]",
          variant === "light" &&
            "bg-white text-neutral-950 [--primary-foreground:#ffffff] [--primary:#111111]",
          variant === "primary" &&
            "bg-primary text-primary-foreground [--primary-foreground:#111111] [--primary:#ffffff]",
          className,
        )}
        onClick={handleClick}
        data-force-hover={forceHover}
        type="button"
      >
        {children}
      </InteractiveHoverButton>
      {activeCut ? createPortal(overlay, document.body) : null}
    </>
  );
}
