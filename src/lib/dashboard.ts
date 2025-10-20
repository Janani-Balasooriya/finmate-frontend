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

export interface BudgetComparisonData {
  category: string;
  budget: number;
  actual: number;
  status: string;
}

export interface BudgetComparison {
  data: BudgetComparisonData[];
}

export interface CashFlowData {
  month: string;
  cashFlow: number;
  cumulative: number;
}

export interface CashFlowAnalysis {
  data: CashFlowData[];
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

  async getBudgetComparison(): Promise<BudgetComparison> {
    return httpClient.get("/dashboard/budget-comparison");
  },

  async getCashFlowAnalysis(year?: number): Promise<CashFlowAnalysis> {
    const yearParam = year ? `?year=${year}` : "";
    return httpClient.get(`/dashboard/cash-flow-analysis${yearParam}`);
  },
};