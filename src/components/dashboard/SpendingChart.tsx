import { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardApi } from "@/lib/dashboard";
import { useToast } from "@/hooks/use-toast";
import type { SpendingByCategory } from "@/lib/dashboard";

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColor = (index: number) => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
  ];
  return colors[index % colors.length];
};

export function SpendingChart() {
  const { toast } = useToast();
  const [spendingData, setSpendingData] = useState<SpendingByCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpendingData = async () => {
      try {
        const data = await dashboardApi.getSpendingByCategory();
        setSpendingData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load spending by category data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSpendingData();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = {
    labels: spendingData?.data.map(item => item.categoryName) || [],
    datasets: [
      {
        data: spendingData?.data.map(item => item.percentage) || [],
        backgroundColor: spendingData?.data.map((_, index) => generateColor(index)) || [],
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          }
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative w-48 h-48">
            <Doughnut data={data} options={options} />
          </div>

          <div className="space-y-4 flex-1">
            {spendingData?.data.map((category, index) => (
              <div key={category.categoryName} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: generateColor(index) }}
                  />
                  <span className="text-sm text-muted-foreground">{category.categoryName}</span>
                </div>
                <span className="text-sm font-medium">{category.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}