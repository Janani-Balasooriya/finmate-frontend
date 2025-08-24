import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const healthScore = 78; // Out of 100
const data = [
  { name: 'Health Score', value: healthScore },
  { name: 'Remaining', value: 100 - healthScore }
];

const getHealthColor = (score: number) => {
  if (score >= 80) return "hsl(var(--success))";
  if (score >= 60) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
};

const getHealthStatus = (score: number) => {
  if (score >= 80) return { status: "Excellent", color: "text-success" };
  if (score >= 60) return { status: "Good", color: "text-warning" };
  if (score >= 40) return { status: "Fair", color: "text-warning" };
  return { status: "Poor", color: "text-destructive" };
};

const chartConfig = {
  score: {
    label: "Financial Health",
  },
};

export function FinancialHealthGauge() {
  const { status, color } = getHealthStatus(healthScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                <Cell fill={getHealthColor(healthScore)} />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="text-center mt-4 space-y-2">
          <div className="text-3xl font-bold" style={{ color: getHealthColor(healthScore) }}>
            {healthScore}/100
          </div>
          <div className={`text-sm font-medium ${color}`}>
            {status}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Emergency Fund: 6 months ✓</div>
            <div>• Debt-to-Income: 15% ✓</div>
            <div>• Savings Rate: 17% ✓</div>
            <div>• Investment Diversity: Good ✓</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}