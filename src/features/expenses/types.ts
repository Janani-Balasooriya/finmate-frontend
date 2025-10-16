export type ExpenseItem = {
  id: number;
  date: string;        // e.g. "Jan 15, 2025"
  dateIso: string;     // e.g. "2025-01-15"
  category: string;    // e.g. "Groceries"
  categoryId: number;  // e.g. 1
  categoryItem: string; // e.g. "Veggies"
  categoryItemId: number; // e.g. 1
  categoryColor: string; // e.g. "#FF5733"
  amountDisplay: string;      // e.g. "Rs. 80,000"
  amountValue: number;        // e.g. 80000 (pure number in rupees)
  account: string;     // e.g. "Bank Account"
  accountId: number;   // e.g. 1
  subscriptionId?: number;
  subscriptionName?: string;
};

export type DateRange = { from: Date | undefined; to: Date | undefined };