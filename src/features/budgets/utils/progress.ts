// Helpers for the overview chart and messages

export function getProgressMessage(totalSpent: number, totalBudget: number) {
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  if (spentPercentage > 100) return "You're over budget this month. Consider reviewing your spending.";
  if (spentPercentage > 80)  return "You're approaching your budget limit. Monitor your spending.";
  return "You're well within your budget. Great job!";
}

export function getProgressMessageColor(totalSpent: number, totalBudget: number) {
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  return spentPercentage > 80 ? "text-destructive" : "text-muted-foreground";
}

// Doughnut chart dataset builder
export function createProgressChartData(totalSpent: number, totalBudget: number) {
  const spentPercentage = Math.min(totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0, 100);
  const remainingPercentage = Math.max(100 - spentPercentage, 0);
  const overBudgetPercentage =
    totalBudget > 0 && totalSpent > totalBudget
      ? ((totalSpent - totalBudget) / totalBudget) * 100
      : 0;

  return {
    datasets: [
      {
        data: overBudgetPercentage > 0
          ? [spentPercentage, overBudgetPercentage]
          : [spentPercentage, remainingPercentage],
        backgroundColor:
          overBudgetPercentage > 0 ? ["#f87171", "#ef4444"] : ["#f87171", "#22c55e"], // red-400/500, green-500
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };
}

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  animation: { animateRotate: true, duration: 1000, easing: "easeOutQuart" as const },
} as const;
