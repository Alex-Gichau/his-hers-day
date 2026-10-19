"use client"

import React from "react";
import { Calendar } from "./ui/calendar";
import { siteData } from "@/data";

const WeddingCalendar = () => {
  const weddingDate = React.useMemo(
    () => new Date(siteData.wedding.date),
    []
  );
  const [date, setDate] = React.useState<Date | undefined>(weddingDate);

  return (
    <div>
      <Calendar
        animate
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={weddingDate}
        className="rounded-xl border border-border bg-card shadow-sm"
      />
    </div>
  );
};

export default WeddingCalendar;