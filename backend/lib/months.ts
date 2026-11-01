// Month grouping for the finance lists. Pure module: no imports.

// "2026-10" for a date, or "" when it is missing or invalid. Dates stored as a
// day (such as the date a payment was received) are UTC midnight, so they are
// read in UTC; timestamps are read in the viewer's own time zone.
export function monthKey(
  value: string | Date | undefined,
  utc = false,
): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const year = utc ? d.getUTCFullYear() : d.getFullYear();
  const month = (utc ? d.getUTCMonth() : d.getMonth()) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

const NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// "2026-10" becomes "October 2026"
export function monthLabel(key: string): string {
  const [year, month] = key.split("-");
  return `${NAMES[Number(month) - 1] ?? month} ${year}`;
}

// The months that appear in a list, newest first
export function monthOptions<T>(
  items: T[],
  getDate: (item: T) => string | Date | undefined,
  utc = false,
): string[] {
  const keys = new Set<string>();
  for (const item of items) {
    const key = monthKey(getDate(item), utc);
    if (key) keys.add(key);
  }
  return [...keys].sort().reverse();
}
