import { StatsCard } from "@/components/dashboard/StatsCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { KeyInsights } from "@/components/dashboard/KeyInsights";
import { SharedGoals } from "@/components/dashboard/SharedGoals";
import { IncomeExpenseTrend } from "@/components/dashboard/IncomeExpenseTrend";
import { BudgetComparisonChart } from "@/components/dashboard/BudgetComparisonChart";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";

import { CategoryTrendsChart } from "@/components/dashboard/CategoryTrendsChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Income This Month"
              amount="90,000"
              currency="Rs."
              change="+12% from last month"
              trend="up"
              type="income"
            />
            <StatsCard
              title="Total Expenses This Month"
              amount="24,500"
              currency="Rs."
              change="+8% from last month"
              trend="up"
              type="expense"
            />
            <StatsCard
              title="Net Savings"
              amount="65, 500"
              currency="Rs."
              change="17% savings rate"
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