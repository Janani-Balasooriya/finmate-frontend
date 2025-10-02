import { useEffect, useRef, useState } from "react";
import { accountsApi, AccountItemDto, CurrencyCodeDto } from "@/lib/accounts";

type ToastFn = (o: { title: string; description?: string; variant?: string }) => void;

export function useAccounts(toast?: ToastFn) {
  const [accounts, setAccounts] = useState<AccountItemDto[]>([]);
  const [currencyCodes, setCurrencyCodes] = useState<CurrencyCodeDto[]>([]);
  const [loading, setLoading] = useState(true);

    // keep latest toast in a ref so effect deps can be []
  const toastRef = useRef(toast);
  toastRef.current = toast;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [acc, cur] = await Promise.all([
          accountsApi.getActive(),
          accountsApi.getCurrencyCodes(),
        ]);
        if (!active) return;
        setAccounts(acc);
        setCurrencyCodes(cur);
      } catch (e: any) {
        toast?.({
          title: "Failed to load accounts",
          description: e?.message || "Could not load account data",
          variant: "destructive",
        });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const createAccount = async (payload: {
    name: string; currencyCodesId: number; openingBalance: number;
  }) => {
    const created = await accountsApi.create(payload);
    setAccounts(prev => [...prev, created]);
    return created;
  };

  return { accounts, currencyCodes, loading, createAccount };
}
