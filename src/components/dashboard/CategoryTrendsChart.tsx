import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { dashboardApi } from "@/lib/dashboard";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/currency";
import type { CategoryTrends } from "@/lib/dashboard";

const generateColor = (index: number) => {
  const colors = [
    "hsl(var(--success))",
    "hsl(var(--info))",
    "hsl(var(--warning))",
    "hsl(var(--destructive))",
    "hsl(var(--primary))",
    "#8B5CF6", // purple
    "#06B6D4", // cyan
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // red
  ];
  return colors[index % colors.length];
};

export function CategoryTrendsChart() {
  const { toast } = useToast();
  const { formatCurrencyValue } = useCurrency();
  const [categoryData, setCategoryData] = useState<CategoryTrends | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const data = await dashboardApi.getCategoryTrends(currentYear);
        setCategoryData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load category trends data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Spending Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = categoryData?.categoryNames.reduce((config, categoryName, index) => {
    config[categoryName.toLowerCase().replace(/\s+/g, '')] = {
      label: categoryName,
      color: generateColor(index),
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>) || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Category Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={categoryData?.data || []}
            width={320}
            height={180}
          >
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
              formatter={(value) => [formatCurrencyValue(Number(value)), ""]}
            />
            {categoryData?.categoryNames.map((categoryName, index) => {
              const dataKey = categoryName.toLowerCase().replace(/\s+/g, '');
              return (
                <Line
                  key={categoryName}
                  type="monotone"
                  dataKey={`categories.${categoryName}`}
                  stroke={generateColor(index)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              );
            })}
          </LineChart>
        </ChartContainer>

        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {categoryData?.categoryNames.map((categoryName, index) => (
            <div key={categoryName} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: generateColor(index) }}
              />
              <span className="text-sm text-muted-foreground">{categoryName}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}