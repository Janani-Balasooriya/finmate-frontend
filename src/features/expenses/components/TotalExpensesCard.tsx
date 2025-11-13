import { Card, CardContent } from "@/components/ui/card";
import { ExpenseTransactionSummary } from "@/lib/expenses";
import { ExpenseItem } from "../types";
import { useCurrency } from "@/lib/currency";

export function TotalExpensesCard({
  summary,
  rows,
  useFiltered = false,
}: {
  summary?: ExpenseTransactionSummary | null;
  rows?: ExpenseItem[] | undefined;
  useFiltered?: boolean;
}) {
  const { formatCurrency } = useCurrency();
  const hasRows = Array.isArray(rows) && rows.length > 0;

  const totalFromRows = hasRows ? rows!.reduce((acc, r) => acc + (r.amountValue ?? 0), 0) : 0;
  const countFromRows = hasRows ? rows!.length : 0;
  const avgFromRows = countFromRows ? totalFromRows / countFromRows : 0;

  const showFiltered = useFiltered && hasRows;

  const total = showFiltered ? totalFromRows : (summary?.totalAmount ?? 0);
  const count = showFiltered ? countFromRows : (summary?.transactionCount ?? 0);
  const avg   = showFiltered ? avgFromRows   : (summary?.averageAmount ?? 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Total Expenses</h3>
            <p className="text-sm text-muted-foreground">
              {showFiltered ? "Sum of filtered expenses" : "All-time total"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-destructive">{formatCurrency(total)}</div>
            <p className="text-sm text-muted-foreground">
              {count} expense{count !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(avg)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}