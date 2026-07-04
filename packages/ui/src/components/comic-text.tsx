"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

interface ComicTextProps {
  accentColor?: string;
  children: string;
  className?: string;
  fillColor?: string;
  fontSize?: number;
  shadowColor?: string;
  style?: CSSProperties;
  strokeColor?: string;
}

export function ComicText({
  accentColor = "#facc15",
  children,
  className,
  fillColor = "#ffffff",
  fontSize = 4,
  shadowColor = "#ef4444",
  style,
  strokeColor = "#111827",
}: ComicTextProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.span
      animate={
        reduceMotion
          ? undefined
          : {
              rotate: [-1.5, 1.5, -1.5],
              scale: [1, 1.04, 1],
            }
      }
      className={cn(
        "inline-block font-black tracking-normal",
        "[text-shadow:0.045em_0.045em_0_var(--comic-stroke),0.09em_0.09em_0_var(--comic-shadow),0.135em_0.135em_0_var(--comic-accent)]",
        "[-webkit-text-stroke:0.035em_var(--comic-stroke)]",
        className,
      )}
      style={
        {
          "--comic-accent": accentColor,
          "--comic-fill": fillColor,
          "--comic-shadow": shadowColor,
          "--comic-stroke": strokeColor,
          color: "var(--comic-fill)",
          fontSize: `${fontSize}rem`,
          lineHeight: 0.86,
          ...style,
        } as CSSProperties
      }
      transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
}
