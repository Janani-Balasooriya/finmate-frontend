import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", cashFlow: 63000, cumulative: 63000 },
  { month: "Feb", cashFlow: 63500, cumulative: 126500 },
  { month: "Mar", cashFlow: 71000, cumulative: 197500 },
  { month: "Apr", cashFlow: 61000, cumulative: 258500 },
  { month: "May", cashFlow: 65500, cumulative: 324000 },
  { month: "Jun", cashFlow: 67000, cumulative: 391000 },
];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cash Flow Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
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
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `₹${value.toLocaleString()}`, 
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