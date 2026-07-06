"use client";

import "lenis/dist/lenis.css";

import * as React from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

export function TripLenisProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    // Skip Lenis on mobile devices for smooth native touch scrolling
    const isMobile =
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) return;

    const lenis = new Lenis({
      anchors: {
        offset: 80,
      },
      autoRaf: true,
      stopInertiaOnNavigate: true,
    });

    return () => lenis.destroy();
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
