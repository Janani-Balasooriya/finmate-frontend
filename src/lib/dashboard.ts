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

export interface CategoryTrends {
  data: {
    month: string;
    categories: Record<string, number>;
  }[];
  categoryNames: string[];
}

export interface SpendingByCategory {
  data: {
    categoryName: string;
    amount: number;
    percentage: number;
  }[];
}

export interface IncomeExpenseTrend {
  data: MonthlyTrendData[];
}

export interface InsightItem {
  id: string;
  title: string;
  detail: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  ctaLabel: string;
  ctaRoute: string;
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

  async getCategoryTrends(year?: number): Promise<CategoryTrends> {
    const yearParam = year ? `?year=${year}` : "";
    return httpClient.get(`/dashboard/category-trends${yearParam}`);
  },

  async getSpendingByCategory(): Promise<SpendingByCategory> {
    return httpClient.get("/dashboard/spending-by-category");
  },

  async getInsights(): Promise<InsightItem[]> {
    return httpClient.get("/insights");
  },
};