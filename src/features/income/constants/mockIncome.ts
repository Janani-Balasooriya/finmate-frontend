import { IncomeItem } from "../types";

export const incomeData: IncomeItem[] = [
  {
    id: 1,
    date: "Jan 15, 2025",
    source: "Salary",
    note: "Monthly salary for January",
    amount: "Rs. 80,000",
    account: "Bank Account",
    type: "salary",
  },
  {
    id: 2,
    date: "Feb 15, 2025",
    source: "Freelance",
    note: "Freelance project payment",
    amount: "Rs. 50,000",
    account: "PayPal",
    type: "freelance",
  },
  {
    id: 3,
    date: "Mar 15, 2025",
    source: "Investment",
    note: "Dividends from stocks",
    amount: "Rs. 20,000",
    account: "Brokerage Account",
    type: "investment",
  },
];
