"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface GuestsSliderProps {
  id: string;
  min?: number;
  max?: number;
  /** The current value. The component is fully controlled. */
  value: number;
  /** Called whenever the value changes. */
  onValueChange: (value: number) => void;
  className?: string;
}

/**
 * A compact numeric slider used for the "Guests" RSVP field.
 * The track is styled from scratch so it matches the dark theme.
 *
 * The slider is fully controlled so the number shown here can never drift
 * from the value the form submits.
 */
export function GuestsSlider({
  id,
  min = 1,
  max = 5,
  value,
  onValueChange,
  className,
}: GuestsSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = (next: number) => {
    onValueChange(next);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span
          aria-live="polite"
          className="font-wedding-alt text-2xl leading-none text-foreground"
        >
          {value}
          <span className="ml-1 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {value === 1 ? "guest" : "guests"}
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          {min}–{max}
        </span>
      </div>

      <input
        id={id}
        name={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => handleChange(Number(event.target.value))}
        aria-label="Number of guests"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent",
          "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full",
          "[&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary",
          "[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background",
        )}
        style={{
          // Filled portion of the track up to the current value.
          background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`,
        }}
      />

      <div className="flex justify-between px-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {Array.from({ length: max - min + 1 }, (_, index) => {
          const tick = min + index;
          return (
            <span
              key={tick}
              className={cn(
                "transition-colors",
                tick <= value && "text-primary",
              )}
            >
              {tick}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default GuestsSlider;
