"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export function TripParallaxLayer({
  children,
  className,
  speed = 24,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div
      className={className}
      ref={ref}
      style={prefersReducedMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
