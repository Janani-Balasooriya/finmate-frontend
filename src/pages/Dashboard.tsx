import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { KeyInsights } from "@/components/dashboard/KeyInsights";
import { SharedGoals } from "@/components/dashboard/SharedGoals";
import { IncomeExpenseTrend } from "@/components/dashboard/IncomeExpenseTrend";
import { BudgetComparisonChart } from "@/components/dashboard/BudgetComparisonChart";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";

import { CategoryTrendsChart } from "@/components/dashboard/CategoryTrendsChart";
import { dashboardApi, DashboardStats } from "@/lib/dashboard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard stats",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Income This Month"
              amount={loading ? "..." : formatCurrency(stats?.totalIncomeThisMonth || 0)}
              currency=""
              change="+12% from last month"
              trend="up"
              type="income"
            />
            <StatsCard
              title="Total Expenses This Month"
              amount={loading ? "..." : formatCurrency(stats?.totalExpensesThisMonth || 0)}
              currency=""
              change="+8% from last month"
              trend="up"
              type="expense"
            />
            <StatsCard
              title="Net Savings"
              amount={loading ? "..." : formatCurrency(stats?.netSavings || 0)}
              currency=""
              change={`${stats?.savingsRate?.toFixed(1) || 0}% savings rate`}
              trend="up"
              type="savings"
            />
          </div>

          {/* Income Trends & Key Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IncomeExpenseTrend />
            </div>
            <KeyInsights />
          </div>

          {/* Budget Analysis & Cash Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetComparisonChart />
            <CashFlowChart />
          </div>

          {/* Category Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryTrendsChart />
            <SpendingChart />
          </div>

      {/* Shared Goals */}
      <SharedGoals />
    </div>
  );
};

export default Dashboard;