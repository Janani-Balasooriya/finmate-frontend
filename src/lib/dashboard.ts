import { httpClient } from "./http";

export interface DashboardStats {
  totalIncomeThisMonth: number;
  totalExpensesThisMonth: number;
  netSavings: number;
  savingsRate: number;
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
}

export interface IncomeExpenseTrend {
  data: MonthlyTrendData[];
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    return httpClient.get("/dashboard/stats");
  },

  async getIncomeExpenseTrend(year?: number): Promise<IncomeExpenseTrend> {
    const yearParam = year ? `?year=${year}` : "";
    return httpClient.get(`/dashboard/income-expense-trend${yearParam}`);
  },
};