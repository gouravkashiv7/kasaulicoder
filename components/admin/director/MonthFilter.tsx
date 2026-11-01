"use client";

import { useState } from "react";
import { monthKey, monthLabel, monthOptions } from "@/backend/lib/months";
import { fieldClass } from "./modals/FinanceFormModal";

// Narrows a list to one month, or shows everything. `utc` is for dates saved
// as a plain day (such as the date a payment was received).
export function useMonthFilter<T>(
  items: T[],
  getDate: (item: T) => string | Date | undefined,
  utc = false,
) {
  const [month, setMonth] = useState("all");
  const months = monthOptions(items, getDate, utc);
  const filtered =
    month === "all"
      ? items
      : items.filter((item) => monthKey(getDate(item), utc) === month);
  return { month, setMonth, months, filtered };
}

interface MonthFilterProps {
  months: string[];
  value: string;
  onChange: (month: string) => void;
  // For example "12 payments · ₹4,20,000.00" for what is on screen
  summary?: string;
}

const MonthFilter = ({
  months,
  value,
  onChange,
  summary,
}: MonthFilterProps) => {
  // Nothing to filter until there are records
  if (months.length === 0) return null;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <label htmlFor="month-filter" className="sr-only">
        Show records from
      </label>
      <select
        id="month-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} w-auto py-2`}
      >
        <option value="all">All time</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {monthLabel(m)}
          </option>
        ))}
      </select>
      {summary && (
        <span className="text-xs font-bold text-foreground/50">{summary}</span>
      )}
    </div>
  );
};

export default MonthFilter;
