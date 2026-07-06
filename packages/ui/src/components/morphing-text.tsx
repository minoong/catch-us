"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@repo/ui/lib/utils";

const morphTime = 1.5;
const cooldownTime = 0.5;

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  // Detect mobile viewport and mounting
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100,
      )}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
      setTextIndex(textIndexRef.current);
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  // Animation loop (only for desktop and non-reduced-motion)
  useEffect(() => {
    if (!mounted || prefersReducedMotion || isMobile) return;

    let animationFrameId: number;
    timeRef.current = new Date(); // reset time on mount/config change

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, prefersReducedMotion, isMobile, doMorph, doCooldown]);

  // Fallback simple interval animation for mobile / reduced-motion
  useEffect(() => {
    if (!mounted || (!prefersReducedMotion && !isMobile)) return;

    const interval = setInterval(
      () => {
        setTextIndex((prev) => (prev + 1) % texts.length);
      },
      (morphTime + cooldownTime) * 1000,
    );

    return () => clearInterval(interval);
  }, [mounted, prefersReducedMotion, isMobile, texts.length]);

  const useFallback = !mounted || prefersReducedMotion || isMobile;

  return (
    <div
      className={cn(
        "relative mx-auto h-16 w-full max-w-3xl text-center font-sans text-[40pt] leading-none font-bold md:h-24 lg:text-[6rem]",
        !useFallback && "filter-[url(#threshold)_blur(0.6px)]",
        className,
      )}
    >
      {useFallback ? (
        // Simple fade cross-over for mobile safety
        <div className="absolute inset-0 flex items-center justify-center">
          {texts.map((text, idx) => (
            <span
              key={text}
              className={cn(
                "absolute inset-x-0 top-0 m-auto inline-block w-full transition-opacity duration-700 ease-in-out",
                idx === textIndex
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              )}
            >
              {text}
            </span>
          ))}
        </div>
      ) : (
        <>
          <span
            className="absolute inset-x-0 top-0 m-auto inline-block w-full"
            ref={text1Ref}
          />
          <span
            className="absolute inset-x-0 top-0 m-auto inline-block w-full"
            ref={text2Ref}
          />
          <svg
            id="filters"
            className="fixed h-0 w-0"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="threshold">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 255 -140"
                />
              </filter>
            </defs>
          </svg>
        </>
      )}
    </div>
  );
};
