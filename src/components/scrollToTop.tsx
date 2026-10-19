"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      // Only reveal once the visitor has scrolled down a meaningful amount.
      setVisible(window.scrollY > 600);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-24 right-4 z-50 grid h-11 w-11 place-items-center rounded-full",
        "border border-border/70 bg-background/85 text-foreground shadow-lg backdrop-blur-md",
        "transition-all duration-300 hover:border-primary/60 hover:bg-primary/15 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        // On desktop there is no bottom bar, so the button drops to the corner.
        "sm:bottom-8 sm:right-8",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
