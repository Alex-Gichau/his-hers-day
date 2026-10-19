"use client"

import React from "react";
import { Calendar } from "./ui/calendar";

const WeddingCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 11, 5));

  return (
    <div>
      <Calendar
        animate
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-xl border border-border bg-card shadow-sm"
      />
    </div>
  );
};

export default WeddingCalendar;