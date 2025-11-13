import { useCurrency } from "@/lib/currency";

export function formatCurrency(amount: number) {
  // This function is used in components that may not have access to React hooks
  // For now, we'll use a fallback approach, but ideally this should be replaced
  // with the useCurrency hook in the components that use this function
  const baseCurrencyCode = 'LKR'; // Fallback - should be replaced with dynamic currency

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: baseCurrencyCode === 'LKR' ? 'INR' : baseCurrencyCode,
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("₹", "Rs.");
}
