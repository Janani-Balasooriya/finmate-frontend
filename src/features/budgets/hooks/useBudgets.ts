import { useEffect, useRef, useState } from "react";
import { budgetsApi, BudgetsResponseDto, BudgetItemDto } from "@/lib/budgets";

type ToastFn = (o: { title: string; description?: string; variant?: string }) => void;

export function useBudgets(toast?: ToastFn) {
  const [data, setData] = useState<BudgetsResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toastRef = useRef(toast);
  toastRef.current = toast;

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetsApi.get();
      setData(res);
      setError(null);
    } catch (e: any) {
      const msg = e?.message || "Failed to load budgets";
      setError(msg);
      toastRef.current?.({
        title: "Failed to load budgets",
        description: String(msg),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Directly expose create/update/remove, but the page can decide when to refetch.
  const create = (payload: { name: string; icon: string; color: string; budgetAmount: number }) =>
    budgetsApi.create(payload);

  const update = (id: number, payload: { name: string; icon: string; color: string; budgetAmount: number }) =>
    budgetsApi.update(id, payload);

  const remove = (id: number) => budgetsApi.remove(id);

  return { data, loading, error, fetchBudgets, create, update, remove };
}
