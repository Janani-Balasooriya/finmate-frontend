import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { category: "Food", budget: 8000, actual: 7200, status: "under" },
  { category: "Transport", budget: 4000, actual: 3800, status: "under" },
  { category: "Entertainment", budget: 3000, actual: 4200, status: "over" },
  { category: "Shopping", budget: 5000, actual: 4500, status: "under" },
  { category: "Bills", budget: 6000, actual: 6000, status: "exact" },
];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barCategoryGap="20%">
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
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
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