"use client";

import { createElement, type CSSProperties, type HTMLAttributes } from "react";

import { cn } from "@repo/ui/lib/utils";

type LineShadowTextElement =
  | "article"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "li"
  | "p"
  | "section"
  | "span";

interface LineShadowTextProps extends HTMLAttributes<HTMLElement> {
  as?: LineShadowTextElement;
  children: string;
  shadowColor?: string;
}

export function LineShadowText({
  as,
  children,
  className,
  shadowColor = "black",
  style,
  ...props
}: LineShadowTextProps) {
  const component = as ?? "span";

  return createElement(
    component,
    {
      className: cn("animate-line-shadow-text whitespace-nowrap", className),
      style: {
        "--line-shadow-color": shadowColor,
        ...style,
      } as CSSProperties,
      ...props,
    },
    children,
  );
}
