"use client";

import * as React from "react";
import { CalendarHeart } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CountdownData } from "@/types/data";

interface CountdownProps {
  date: string;
  content: CountdownData;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  const isPast = diff <= 0;
  const abs = Math.abs(diff);

  return {
    days: Math.floor(abs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((abs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((abs / (1000 * 60)) % 60),
    seconds: Math.floor((abs / 1000) % 60),
    isPast,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function Countdown({ date, content, className }: CountdownProps) {
  const target = React.useMemo(() => new Date(date), [date]);
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(null);

  React.useEffect(() => {
    setTimeLeft(calculateTimeLeft(target));

    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [target]);

  if (!timeLeft) {
    return null;
  }

  if (timeLeft.isPast) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center",
          className
        )}
      >
        <CalendarHeart className="mx-auto h-5 w-5 text-primary" />
        <p className="mt-2 font-wedding-alt text-2xl uppercase tracking-[0.1em] text-foreground">
          {content.pastTitle}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{content.pastMessage}</p>
      </div>
    );
  }

  const units = [
    { label: "Days", value: pad(timeLeft.days) },
    { label: "Hours", value: pad(timeLeft.hours) },
    { label: "Minutes", value: pad(timeLeft.minutes) },
    { label: "Seconds", value: pad(timeLeft.seconds) },
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/80 p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <CalendarHeart className="h-4 w-4 text-primary" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {content.title}
          </p>
          <p className="font-wedding-alt text-2xl text-foreground">{content.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-xl border border-border/70 bg-background/70 px-2 py-3 text-center"
          >
            <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
              {unit.value}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Countdown;
