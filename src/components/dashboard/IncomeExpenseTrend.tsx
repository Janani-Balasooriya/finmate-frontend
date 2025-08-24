import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", income: 85000, expenses: 22000 },
  { month: "Feb", income: 88000, expenses: 24500 },
  { month: "Mar", income: 92000, expenses: 21000 },
  { month: "Apr", income: 87000, expenses: 26000 },
  { month: "May", income: 90000, expenses: 24500 },
  { month: "Jun", income: 95000, expenses: 28000 },
];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Income vs Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
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