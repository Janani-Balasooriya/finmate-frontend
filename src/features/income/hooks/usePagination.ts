import { useMemo } from "react";

export function usePagination<T>(rows: T[], page: number, perPage: number) {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const current = useMemo(() => rows.slice(start, end), [rows, start, end]);

  return { total, totalPages, start, end, current };
}
