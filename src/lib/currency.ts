// Currency conversion utilities

// USD to LKR exchange rate (this should ideally come from an API in production)
const USD_TO_LKR_RATE = 290; // Approximate rate: 1 USD = 290 LKR

export function convertUSDToLKR(usdAmount: number): number {
  return usdAmount * USD_TO_LKR_RATE;
}

export function formatCurrency(amount: number, currency: string = 'LKR'): string {
  const symbol = currency === 'LKR' ? 'Rs.' : '$';
  return `${symbol} ${amount.toLocaleString()}`;
}