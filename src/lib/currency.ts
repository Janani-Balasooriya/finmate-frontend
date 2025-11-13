// utils/formatCurrency.ts
export function formatCurrency(amount: number, currencyCode: string, locale = 'en-LK') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

export function formatCurrencyValue(amount: number, currencyCode: string, locale = 'en-LK') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return amount.toFixed(2);
  }
}

// React hook for currency management
import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';

export function useCurrency() {
  const { user } = useUser();

  // Get base currency from user's family
  const baseCurrencyCode = useMemo(() => {
    return user?.families?.baseCurrencyCode || 'LKR';
  }, [user?.families?.baseCurrencyCode]);

  return {
    baseCurrencyCode,
    formatCurrency: (amount: number, currencyCode?: string) =>
      formatCurrency(amount, currencyCode || baseCurrencyCode),
    formatCurrencyValue: (amount: number, currencyCode?: string) =>
      formatCurrencyValue(amount, currencyCode || baseCurrencyCode),
  };
}