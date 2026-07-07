"use client";

import { Children, cloneElement, isValidElement, useId, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import type { Transition } from "motion/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { cn } from "@repo/ui/lib/utils";

interface AnimatedBackgroundChildProps {
  "data-id": string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface AnimatedBackgroundProps {
  children:
    | ReactElement<AnimatedBackgroundChildProps>
    | ReactElement<AnimatedBackgroundChildProps>[];
  className?: string;
  defaultValue?: string;
  enableHover?: boolean;
  onValueChange?: (newActiveId: string | null) => void;
  transition?: Transition;
}

export function AnimatedBackground({
  children,
  className,
  defaultValue,
  enableHover = false,
  onValueChange,
  transition,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultValue ?? null);
  const uniqueId = useId();

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id);
    onValueChange?.(id);
  };

  return (
    <LayoutGroup id={`background-group-${uniqueId}`}>
      {Children.map(children, (child, index) => {
        if (!isValidElement<AnimatedBackgroundChildProps>(child)) return child;

        const id = child.props["data-id"];
        const interactionProps = enableHover
          ? {
              onMouseEnter: () => handleSetActiveId(id),
              onMouseLeave: () => handleSetActiveId(null),
            }
          : {
              onClick: () => {
                handleSetActiveId(id);
                child.props.onClick?.();
              },
            };

        return cloneElement(
          child,
          {
            className: cn("relative inline-flex", child.props.className),
            "data-checked": activeId === id ? "true" : "false",
            key: index,
            ...interactionProps,
          } as Partial<AnimatedBackgroundChildProps> & {
            "data-checked": string;
            key: number;
          },
          <>
            <AnimatePresence initial={false}>
              {activeId === id ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  className={cn("absolute inset-0", className)}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: defaultValue ? 1 : 0 }}
                  layoutId={`background-${uniqueId}`}
                  transition={transition}
                />
              ) : null}
            </AnimatePresence>
            <div className="z-10">{child.props.children}</div>
          </>,
        );
      })}
    </LayoutGroup>
  );
}
