import { useEffect, useRef, useState } from "react";
import { budgetsApi, BudgetsResponseDto, BudgetItemDto } from "@/lib/budgets";
import { useUser } from "@/contexts/UserContext";

type ToastFn = (o: { title: string; description?: string; variant?: string }) => void;

export function useBudgets(toast?: ToastFn) {
  const { user } = useUser();
  const [data, setData] = useState<BudgetsResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toastRef = useRef(toast);
  toastRef.current = toast;

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      if (!user || !user.families?.id) {
        throw new Error("User family information not available");
      }
      const familyId = user.families.id.toString();
      const res = await budgetsApi.get(familyId);
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
    if (user) {
      fetchBudgets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Directly expose create/update/remove, but the page can decide when to refetch.
  const create = (payload: { name: string; icon: string; color: string; budgetAmount: number }) =>
    budgetsApi.create(payload);

  const update = (id: number, payload: { name: string; icon: string; color: string; budgetAmount: number }) =>
    budgetsApi.update(id, payload);

  const remove = (id: number) => budgetsApi.remove(id);

  return { data, loading, error, fetchBudgets, create, update, remove };
}
