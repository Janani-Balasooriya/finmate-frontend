import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { KeyInsights } from "@/components/dashboard/KeyInsights";
import { SharedGoals } from "@/components/dashboard/SharedGoals";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="p-6 space-y-6">
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

          {/* Charts and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingChart />
            <KeyInsights />
          </div>

          {/* Shared Goals */}
          <SharedGoals />
        </main>
      </div>
    </div>
  );
};

export default Index;
