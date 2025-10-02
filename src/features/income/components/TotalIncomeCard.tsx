import { Card, CardContent } from "@/components/ui/card";
import { parseAmountLkr } from "../utils/parseAmount";
import { IncomeItem } from "../types";

export function TotalIncomeCard({ rows }: { rows: IncomeItem[] }) {
  const total = rows.reduce((sum, r) => sum + parseAmountLkr(r.amount), 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Total Income</h3>
            <p className="text-sm text-muted-foreground">Sum of all incomes in range</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">Rs. {total.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              {rows.length} income{rows.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
