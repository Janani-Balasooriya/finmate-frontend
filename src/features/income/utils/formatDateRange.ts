import { DateRange } from "../types";

export function formatDateRange(range: DateRange): string {
  const { from, to } = range || {};
  if (!from && !to) return "Select date range";
  if (from && to) return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
  if (from) return `From ${from.toLocaleDateString()}`;
  if (to) return `Until ${to.toLocaleDateString()}`;
  return "Select date range";
}
