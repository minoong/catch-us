"use client";

import type * as React from "react";
import type { MotionProps, Transition, Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

export type TransitionPanelProps = {
  children: React.ReactNode[];
  className?: string;
  transition?: Transition;
  activeIndex: number;
  custom?: number;
  variants?: Variants;
} & Omit<MotionProps, "custom">;

export function TransitionPanel({
  children,
  className,
  transition,
  variants,
  activeIndex,
  custom,
  ...motionProps
}: TransitionPanelProps) {
  return (
    <div className={cn("relative", className)}>
      <AnimatePresence custom={custom} initial={false} mode="popLayout">
        <motion.div
          key={activeIndex}
          custom={custom}
          variants={variants}
          transition={transition}
          initial="enter"
          animate="center"
          exit="exit"
          {...motionProps}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
