"use client";

import React, {
  type MouseEventHandler,
  type ReactNode,
  type UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  disableScale?: boolean;
  index: number;
  viewportAmount?: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  className = "",
  delay = 0,
  disableScale = false,
  index,
  onClick,
  onMouseEnter,
  viewportAmount = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: viewportAmount, once: false });
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, scale: disableScale ? 1 : 0.96, y: 22 }
      }
      animate={
        reduceMotion || inView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: disableScale ? 1 : 0.96, y: 22 }
      }
      transition={{
        delay,
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps<TItem> {
  items: TItem[];
  renderItem: (
    item: TItem,
    index: number,
    selected: boolean,
  ) => React.ReactNode;
  getItemKey?: (item: TItem, index: number) => React.Key;
  onItemSelect?: (item: TItem, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  disableItemScale?: boolean;
  initialSelectedIndex?: number;
  itemViewportAmount?: number;
  listClassName?: string;
}

function AnimatedList<TItem>({
  className = "",
  displayScrollbar = true,
  disableItemScale = false,
  enableArrowNavigation = true,
  getItemKey,
  initialSelectedIndex = -1,
  itemClassName = "",
  itemViewportAmount = 0.5,
  items,
  listClassName = "",
  onItemSelect,
  renderItem,
  showGradients = true,
}: AnimatedListProps<TItem>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleItemMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback(
    (item: TItem, index: number) => {
      setSelectedIndex(index);
      if (onItemSelect) {
        onItemSelect(item, index);
      }
    },
    [onItemSelect],
  );

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1),
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`,
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={listRef}
        className={`${listClassName} ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent"
            : "scrollbar-hide"
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarColor: "rgb(203 213 225) transparent",
          scrollbarWidth: displayScrollbar ? "thin" : "none",
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            className={itemClassName}
            key={getItemKey?.(item, index) ?? index}
            delay={index * 0.045}
            disableScale={disableItemScale}
            index={index}
            viewportAmount={itemViewportAmount}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            {renderItem(item, index, selectedIndex === index)}
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="ease pointer-events-none absolute top-0 right-0 left-0 h-[50px] bg-gradient-to-b from-slate-50 to-transparent transition-opacity duration-300"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="ease pointer-events-none absolute right-0 bottom-0 left-0 h-[100px] bg-gradient-to-t from-slate-50 to-transparent transition-opacity duration-300"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
}

export default AnimatedList;
