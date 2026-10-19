"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Direction the content travels in from. */
  from?: RevealDirection;
  /** Delay in milliseconds before the reveal starts. */
  delay?: number;
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number;
  /** Extra class applied while the element is still hidden. */
  as?: "div" | "section" | "li" | "article" | "span";
}

/**
 * Reveals its children once they scroll into view.
 *
 * The element starts hidden (translated + faded) and animates to its final
 * position. `prefers-reduced-motion` is respected, and the content is
 * always visible to screen readers.
 */
export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced-motion: show immediately, no animation.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={shown ? "shown" : "hidden"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", `reveal-from-${from}`, className)}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
