import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { dashboardApi } from "@/lib/dashboard";
import { useToast } from "@/hooks/use-toast";
import type { IncomeExpenseTrend } from "@/lib/dashboard";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--success))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--destructive))",
  },
};

export function IncomeExpenseTrend() {
  const { toast } = useToast();
  const [trendData, setTrendData] = useState<IncomeExpenseTrend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const data = await dashboardApi.getIncomeExpenseTrend(currentYear);
        setTrendData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load income vs expenses trend",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrendData();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Income vs Expenses Trend</CardTitle>
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
        <CardTitle className="text-lg font-semibold">Income vs Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData?.data || []}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                tickFormatter={(value) => `Rs.${value / 1000}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [`Rs.${value.toLocaleString()}`, ""]}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="var(--color-expenses)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}