import { Card, CardContent } from "@/components/ui/card";
import { IncomeTransactionSummary } from "@/lib/incomes";
import { IncomeItem } from "../types";

export function TotalIncomeCard({
  summary,
  rows,
  useFiltered = false,
}: {
  summary?: IncomeTransactionSummary | null;
  rows?: IncomeItem[] | undefined;
  useFiltered?: boolean;
}) {
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
            <h3 className="text-lg font-semibold text-foreground">Total Income</h3>
            <p className="text-sm text-muted-foreground">
              {showFiltered ? "Sum of filtered incomes" : "All-time total"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">Rs. {total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              {count} income{count !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              Avg: Rs. {avg.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
