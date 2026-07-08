"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

type TextEffectElement = keyof Pick<
  React.JSX.IntrinsicElements,
  "div" | "h1" | "h2" | "h3" | "p" | "span"
>;

const motionElements = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
};

interface TextEffectProps extends Omit<
  React.ComponentProps<typeof motion.p>,
  "children" | "variants"
> {
  as?: TextEffectElement;
  children: string;
  per?: "line" | "word" | "char";
  segmentWrapperClassName?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
}

const defaultVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  },
} satisfies Required<TextEffectProps["variants"]>;

export function TextEffect({
  as = "p",
  children,
  className,
  per = "line",
  segmentWrapperClassName,
  variants,
  ...props
}: TextEffectProps) {
  const MotionElement = motionElements[as];
  const segments = getSegments(children, per);
  const containerVariants = variants?.container ?? defaultVariants.container;
  const itemVariants = variants?.item ?? defaultVariants.item;

  return (
    <MotionElement
      animate="visible"
      className={className}
      initial="hidden"
      variants={containerVariants}
      {...props}
    >
      {segments.map((segment, index) => (
        <span
          className={cn(
            per === "line" ? "block overflow-hidden" : "inline-block",
            segmentWrapperClassName,
          )}
          key={`${segment}-${index}`}
        >
          <motion.span
            className={per === "line" ? "block" : "inline-block"}
            variants={itemVariants}
          >
            {segment}
            {per === "word" && index < segments.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </MotionElement>
  );
}

function getSegments(text: string, per: NonNullable<TextEffectProps["per"]>) {
  if (per === "char") return Array.from(text);
  if (per === "word") return text.split(/\s+/).filter(Boolean);

  return text.split(/\r?\n/);
}
