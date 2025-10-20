import { httpClient } from "./http";

export interface DashboardStats {
  totalIncomeThisMonth: number;
  totalExpensesThisMonth: number;
  netSavings: number;
  savingsRate: number;
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    return httpClient.get("/dashboard/stats");
  },
};