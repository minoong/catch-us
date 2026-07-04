"use client";

import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

export function MorphingText({
  className,
  interval = 2400,
  texts,
}: {
  className?: string;
  interval?: number;
  texts: string[];
}) {
  const longestText = texts.reduce(
    (longest, text) => (text.length > longest.length ? text : longest),
    "",
  );
  const cycleDuration = interval * Math.max(texts.length, 1);

  return (
    <span
      aria-live="polite"
      className={cn(
        "relative inline-grid min-w-0 overflow-hidden align-bottom leading-none",
        className,
      )}
    >
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longestText}
      </span>
      {texts.map((text, index) => (
        <span
          className="trip-morphing-text-item col-start-1 row-start-1 whitespace-nowrap text-inherit will-change-transform"
          data-index={index}
          key={text}
          style={
            {
              "--trip-morph-cycle": `${cycleDuration}ms`,
              animationDelay: `${index * -interval}ms`,
            } as React.CSSProperties
          }
        >
          {text}
        </span>
      ))}
    </span>
  );
}
