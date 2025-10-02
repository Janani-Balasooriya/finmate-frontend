import { useEffect, useState } from "react";
import { incomeSourceApi, IncomeSourceItemDto } from "@/lib/incomeSource";

type ToastFn = (o: { title: string; description?: string; variant?: string }) => void;

export function useIncomeSources(toast?: ToastFn) {
  const [incomeSources, setIncomeSources] = useState<IncomeSourceItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await incomeSourceApi.getActive();
        if (active) setIncomeSources(data);
      } catch (e: any) {
        toast?.({
          title: "Failed to load income sources",
          description: e?.message || "Could not load income source data",
          variant: "destructive",
        });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const createIncomeSource = async (payload: { name: string; color: string }) => {
    const created = await incomeSourceApi.create(payload);
    setIncomeSources(prev => [...prev, created]);
    return created;
  };

  return { incomeSources, loading, createIncomeSource };
}
