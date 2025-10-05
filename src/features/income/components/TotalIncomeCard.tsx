import { Card, CardContent } from "@/components/ui/card";
import { IncomeTransactionSummary } from "@/lib/incomes";

export function TotalIncomeCard({ 
  summary, 
  rows 
}: { 
  summary?: IncomeTransactionSummary | null;
  rows?: any[];
}) {
  // Use backend summary if available, otherwise fallback to local calculation
  const total = summary?.totalAmount || 0;
  const count = summary?.transactionCount || rows?.length || 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Total Income</h3>
            <p className="text-sm text-muted-foreground">
              {summary ? "All-time total" : "Sum of all incomes in range"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">Rs. {total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              {count} income{count !== 1 ? "s" : ""}
            </p>
            {summary && (
              <p className="text-xs text-muted-foreground">
                Avg: Rs. {summary.averageAmount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
