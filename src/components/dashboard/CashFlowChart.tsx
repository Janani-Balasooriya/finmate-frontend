import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { dashboardApi } from "@/lib/dashboard";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/currency";
import type { CashFlowAnalysis } from "@/lib/dashboard";

const chartConfig = {
  cashFlow: {
    label: "Monthly Cash Flow",
    color: "hsl(var(--success))",
  },
  cumulative: {
    label: "Cumulative Savings",
    color: "hsl(var(--primary))",
  },
};

export function CashFlowChart() {
  const { toast } = useToast();
  const { formatCurrencyValue } = useCurrency();
  const [cashFlowData, setCashFlowData] = useState<CashFlowAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCashFlowData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const data = await dashboardApi.getCashFlowAnalysis(currentYear);
        setCashFlowData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load cash flow analysis data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCashFlowData();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Cash Flow Analysis</CardTitle>
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
        <CardTitle className="text-lg font-semibold">Cash Flow Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cashFlowData?.data || []}>
              <defs>
                <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `${formatCurrencyValue(value / 1000)}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  formatCurrencyValue(Number(value)),
                  name === "cashFlow" ? "Monthly Cash Flow" : "Cumulative Savings"
                ]}
              />
              <Area
                type="monotone"
                dataKey="cashFlow"
                stroke="hsl(var(--success))"
                fill="url(#cashFlowGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}