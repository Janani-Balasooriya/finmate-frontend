import { Card, CardContent } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { ensureChartRegistration } from "../charts/register";
import { chartOptions, createProgressChartData, getProgressMessage, getProgressMessageColor } from "../utils/progress";
import { formatCurrency } from "../utils/formatCurrency";

ensureChartRegistration();

export function BudgetsOverviewCard({
  totalSpent,
  totalBudget,
}: {
  totalSpent: number;
  totalBudget: number;
}) {
  const remaining = totalBudget - totalSpent;

  return (
    <section aria-labelledby="budgets-summary">
      <Card className="rounded-xl border bg-gradient-to-b from-background to-muted/50 shadow-lg ring-1 ring-primary/10">
        <CardContent className="p-6 md:p-8">
          {/* Mobile / Tablet */}
          <div className="lg:hidden space-y-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Monthly Budget</p>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {formatCurrency(totalBudget)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Spent</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-red-500 break-all">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-green-600 break-all">
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <Doughnut data={createProgressChartData(totalSpent, totalBudget)} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">
                    {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                  </span>
                  <span className="text-xs text-muted-foreground">Used</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-muted-foreground">Spent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">Remaining</span>
              </div>
              {totalSpent > totalBudget && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-destructive">Over budget</span>
                </div>
              )}
            </div>

            <p className={`text-sm text-center ${getProgressMessageColor(totalSpent, totalBudget)} animate-fade-in`}>
              {totalSpent > totalBudget
                ? `Over by ${formatCurrency(totalSpent - totalBudget)}`
                : getProgressMessage(totalSpent, totalBudget)}
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center">
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground mb-2">Total Monthly Budget</p>
                <p className="text-3xl xl:text-4xl font-extrabold tracking-tight">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
              <p className={`text-sm text-center lg:text-left ${getProgressMessageColor(totalSpent, totalBudget)} animate-fade-in`}>
                {totalSpent > totalBudget
                  ? `Over by ${formatCurrency(totalSpent - totalBudget)}`
                  : getProgressMessage(totalSpent, totalBudget)}
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40 xl:w-48 xl:h-48">
                <Doughnut data={createProgressChartData(totalSpent, totalBudget)} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl xl:text-4xl font-bold">
                    {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                  </span>
                  <span className="text-sm text-muted-foreground">Used</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-muted-foreground">Spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">Remaining</span>
                </div>
                {totalSpent > totalBudget && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span className="text-destructive">Over budget</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end space-y-6">
              <div className="text-center lg:text-right">
                <p className="text-sm text-muted-foreground mb-1">Spent</p>
                <p className="text-2xl xl:text-3xl font-extrabold tracking-tight text-red-500">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                <p className="text-2xl xl:text-3xl font-extrabold tracking-tight text-green-600">
                  {formatCurrency(totalBudget - totalSpent)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
