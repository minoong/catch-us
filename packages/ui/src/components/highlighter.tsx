"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

type HighlighterAction =
  | "highlight"
  | "circle"
  | "box"
  | "bracket"
  | "crossed-off"
  | "strike-through"
  | "underline";

interface HighlighterProps {
  action?: HighlighterAction;
  animationDuration?: number;
  children: ReactNode;
  className?: string;
  color?: string;
  isView?: boolean;
  iterations?: number;
  multiline?: boolean;
  padding?: number;
  strokeWidth?: number;
}

export function Highlighter({
  action = "highlight",
  animationDuration = 500,
  children,
  className,
  color = "#ffd1dc",
  isView = false,
  iterations = 2,
  multiline = true,
  padding = 2,
  strokeWidth = 1.5,
}: HighlighterProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const initial = reduceMotion ? false : { opacity: 0, scaleX: 0 };
  const animate = reduceMotion ? { opacity: 1 } : { opacity: 1, scaleX: 1 };
  const transition = {
    duration: animationDuration / 1000,
    ease: "easeOut" as const,
  };
  const strokeCount = Math.max(1, iterations);

  return (
    <span
      className={cn(
        "relative isolate inline-block",
        multiline && "box-decoration-clone decoration-clone",
        className,
      )}
      style={{ "--highlighter-color": color } as CSSProperties}
    >
      {children}
      {Array.from({ length: strokeCount }).map((_, index) => (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-[-1] origin-left",
            action === "highlight" &&
              "inset-x-[-0.08em] bottom-[0.02em] h-[0.58em] rounded-sm bg-[var(--highlighter-color)] opacity-70",
            action === "underline" &&
              "inset-x-[-0.04em] bottom-[-0.12em] h-[0.16em] rounded-full bg-[var(--highlighter-color)]",
            action === "strike-through" &&
              "inset-x-[-0.04em] top-1/2 h-[0.14em] -translate-y-1/2 rounded-full bg-[var(--highlighter-color)]",
            action === "crossed-off" &&
              "inset-x-[-0.1em] top-1/2 h-[0.16em] -translate-y-1/2 rotate-[-7deg] rounded-full bg-[var(--highlighter-color)]",
            action === "box" &&
              "inset-[-0.2em] rounded-md border-[var(--highlighter-color)] border-[var(--stroke-width)]",
            action === "circle" &&
              "inset-[-0.22em] rounded-[50%] border-[var(--highlighter-color)] border-[var(--stroke-width)]",
            action === "bracket" &&
              "inset-y-[-0.16em] right-[-0.28em] w-[0.32em] border-[var(--highlighter-color)] border-y-[var(--stroke-width)] border-r-[var(--stroke-width)]",
          )}
          initial={initial}
          key={index}
          {...(isView ? { whileInView: animate } : { animate })}
          style={
            {
              padding,
              rotate: index % 2 === 0 ? "-0.6deg" : "0.8deg",
              translateY: `${index * 0.03}em`,
              "--stroke-width": `${strokeWidth}px`,
            } as CSSProperties
          }
          transition={{ ...transition, delay: index * 0.045 }}
          viewport={{ amount: 0.7, once: true }}
        />
      ))}
    </span>
  );
}
