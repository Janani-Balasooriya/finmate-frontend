import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", food: 7200, transport: 3800, entertainment: 2800, shopping: 4200 },
  { month: "Feb", food: 7500, transport: 3600, entertainment: 3200, shopping: 3800 },
  { month: "Mar", food: 6800, transport: 4000, entertainment: 2900, shopping: 4500 },
  { month: "Apr", food: 7800, transport: 3900, entertainment: 4200, shopping: 4000 },
  { month: "May", food: 7200, transport: 3800, entertainment: 3500, shopping: 4200 },
  { month: "Jun", food: 7600, transport: 4100, entertainment: 3800, shopping: 3900 },
];

const chartConfig = {
  food: {
    label: "Food",
    color: "hsl(var(--success))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--info))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--warning))",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--destructive))",
  },
};

export function CategoryTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Category Spending Trends</CardTitle>
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
                dataKey="food" 
                stroke="var(--color-food)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="transport" 
                stroke="var(--color-transport)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="entertainment" 
                stroke="var(--color-entertainment)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="shopping" 
                stroke="var(--color-shopping)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}