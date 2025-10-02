import { DateRange, IncomeItem } from "../types";

export function filterByDateRange(rows: IncomeItem[], range: DateRange): IncomeItem[] {
  if (!range?.from && !range?.to) return rows;
  return rows.filter((row) => {
    const d = new Date(row.date);
    const from = range.from ? new Date(range.from) : null;
    const to   = range.to   ? new Date(range.to)   : null;
    if (from && to)   return d >= from && d <= to;
    if (from)         return d >= from;
    if (to)           return d <= to;
    return true;
  });
}
