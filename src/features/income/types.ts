export type IncomeItem = {
  id: number;
  date: string;        // e.g. "Jan 15, 2025"
  dateIso: string;     // e.g. "2025-01-15"
  source: string;      // e.g. "Salary"
  sourceId: number;    // e.g. 1
  sourceColor: string; // e.g. "#FF5733"
  note: string;
  amountDisplay: string;      // e.g. "Rs. 80,000"
  amountValue: number;        // e.g. 80000 (pure number in rupees)
  account: string;     // e.g. "Bank Account"
  accountId: number;   // e.g. 1
  type: string;        // e.g. "salary" | "freelance" | ...
};

export type DateRange = { from?: Date; to?: Date };
