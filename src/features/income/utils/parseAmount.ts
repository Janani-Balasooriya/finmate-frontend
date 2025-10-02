export function parseAmountLkr(text: string): number {
  // "Rs. 80,000" -> 80000
  const cleaned = text.replace(/[^\d.]/g, ""); // remove non-digits except dot
  // Also handle single commas: "20,000" -> "20000"
  return Number(cleaned.replace(/,/g, "")) || 0;
}
