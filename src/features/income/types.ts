export type IncomeItem = {
  id: number;
  date: string;        // e.g. "Jan 15, 2025"
  source: string;      // e.g. "Salary"
  note: string;
  amount: string;      // e.g. "Rs. 80,000"
  account: string;     // e.g. "Bank Account"
  type: string;        // e.g. "salary" | "freelance" | ...
};

export type DateRange = { from?: Date; to?: Date };
