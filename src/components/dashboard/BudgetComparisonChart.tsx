import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { dashboardApi } from "@/lib/dashboard";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/currency";
import type { BudgetComparison } from "@/lib/dashboard";

const chartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--info))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--primary))",
  },
};

export function BudgetComparisonChart() {
  const { toast } = useToast();
  const { formatCurrencyValue } = useCurrency();
  const [budgetData, setBudgetData] = useState<BudgetComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        const data = await dashboardApi.getBudgetComparison();
        setBudgetData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load budget comparison data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData?.data || []} barCategoryGap="20%">
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                tickFormatter={(value) => `${formatCurrencyValue(value / 1000)}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [formatCurrencyValue(Number(value)), ""]}
              />
              <Bar
                dataKey="budget"
                fill="var(--color-budget)"
                radius={[2, 2, 0, 0]}
                opacity={0.7}
              />
              <Bar
                dataKey="actual"
                fill="var(--color-actual)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}