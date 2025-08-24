import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Food', 'Utilities', 'Entertainment', 'Shopping'],
  datasets: [
    {
      data: [35, 25, 20, 20],
      backgroundColor: [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#8B5CF6', // Purple
      ],
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
        label: function(context: any) {
          return `${context.label}: ${context.parsed}%`;
        }
      }
    }
  },
};

export function SpendingChart() {
  const categories = [
    { name: 'Food', color: '#3B82F6', percentage: 35 },
    { name: 'Utilities', color: '#10B981', percentage: 25 },
    { name: 'Entertainment', color: '#F59E0B', percentage: 20 },
    { name: 'Shopping', color: '#8B5CF6', percentage: 20 },
  ];

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
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-muted-foreground">{category.name}</span>
                </div>
                <span className="text-sm font-medium">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}