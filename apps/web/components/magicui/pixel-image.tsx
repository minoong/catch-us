"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@repo/ui/lib/utils";

interface Grid {
  cols: number;
  rows: number;
}

const DEFAULT_GRIDS = {
  "4x6": { cols: 4, rows: 6 },
  "6x4": { cols: 6, rows: 4 },
  "8x8": { cols: 8, rows: 8 },
} satisfies Record<string, Grid>;

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

export interface PixelImageProps {
  alt: string;
  className?: string;
  customGrid?: Grid;
  grid?: PredefinedGridKey;
  grayscaleAnimation?: boolean;
  imageClassName?: string;
  maxAnimationDelay?: number;
  pixelFadeInDuration?: number;
  src: string;
}

function createPieces({ cols, rows }: Grid, maxAnimationDelay: number) {
  return Array.from({ length: rows * cols }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const normalized = index / Math.max(1, rows * cols - 1);
    const wave = Math.sin((row + col) * 1.7) * 0.5 + 0.5;

    return {
      clipPath: `polygon(${col * (100 / cols)}% ${row * (100 / rows)}%, ${
        (col + 1) * (100 / cols)
      }% ${row * (100 / rows)}%, ${(col + 1) * (100 / cols)}% ${
        (row + 1) * (100 / rows)
      }%, ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%)`,
      delay: Math.round((normalized * 0.65 + wave * 0.35) * maxAnimationDelay),
    };
  });
}

export function PixelImage({
  alt,
  className,
  customGrid,
  grid = "6x4",
  grayscaleAnimation = true,
  imageClassName,
  maxAnimationDelay = 260,
  pixelFadeInDuration = 360,
  src,
}: PixelImageProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const resolvedGrid = customGrid ?? DEFAULT_GRIDS[grid];
  const pieces = React.useMemo(
    () => createPieces(resolvedGrid, maxAnimationDelay),
    [maxAnimationDelay, resolvedGrid],
  );

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        "relative size-full overflow-hidden select-none",
        className,
      )}
    >
      {pieces.map((piece, index) => (
        <div
          className={cn(
            "absolute inset-0 transition-all ease-out",
            isVisible ? "opacity-100" : "opacity-0",
          )}
          key={`${src}-${index}`}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${piece.delay}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        >
          <Image
            alt={index === 0 ? alt : ""}
            aria-hidden={index === 0 ? undefined : true}
            className={cn(
              "size-full object-cover",
              grayscaleAnimation && "transition-[filter]",
              grayscaleAnimation && isVisible ? "grayscale-0" : "grayscale",
              imageClassName,
            )}
            draggable={false}
            fill
            sizes="100vw"
            src={src}
            style={{
              transitionDuration: `${pixelFadeInDuration}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
