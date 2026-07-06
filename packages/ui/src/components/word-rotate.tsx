"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@repo/ui/lib/utils";

interface WordRotateProps {
  className?: string;
  duration?: number;
  motionProps?: HTMLMotionProps<"span">;
  transitionDuration?: number;
  words: string[];
}

export function WordRotate({
  className,
  duration = 2500,
  motionProps,
  transitionDuration = 420,
  words,
}: WordRotateProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const safeWords = words.length > 0 ? words : [""];
  const rollingWords =
    safeWords.length > 1 ? [...safeWords, safeWords[0]] : safeWords;

  useEffect(() => {
    if (reduceMotion || safeWords.length < 2) return;

    const interval = window.setInterval(() => {
      setIndex((previousIndex) => previousIndex + 1);
    }, duration);

    return () => window.clearInterval(interval);
  }, [duration, reduceMotion, safeWords.length]);

  useEffect(() => {
    if (reduceMotion || safeWords.length < 2 || index < safeWords.length) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShouldAnimate(false);
      setIndex(0);
      window.requestAnimationFrame(() => setShouldAnimate(true));
    }, transitionDuration);

    return () => window.clearTimeout(timeout);
  }, [index, reduceMotion, safeWords.length, transitionDuration]);

  return (
    <span
      aria-label={safeWords.join(", ")}
      className={cn(
        "relative inline-grid h-[1.2em] overflow-hidden align-bottom leading-normal",
        className,
      )}
    >
      <motion.span
        aria-hidden
        animate={reduceMotion ? undefined : { y: `-${index * 1.2}em` }}
        className="col-start-1 row-start-1 flex flex-col will-change-transform"
        initial={false}
        transition={
          shouldAnimate
            ? {
                duration: transitionDuration / 1000,
                ease: [0.22, 1, 0.36, 1],
              }
            : { duration: 0 }
        }
        {...motionProps}
      >
        {rollingWords.map((word, wordIndex) => (
          <span
            className="block h-[1.2em] overflow-hidden leading-normal"
            key={`${word}-${wordIndex}`}
          >
            {word}
          </span>
        ))}
      </motion.span>

      <span aria-hidden className="invisible col-start-1 row-start-1">
        {safeWords.reduce(
          (longest, word) => (word.length > longest.length ? word : longest),
          safeWords[0],
        )}
      </span>
    </span>
  );
}
