import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import * as Icons from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "../utils/formatCurrency";
import { BudgetsResponseDto, BudgetItemDto } from "@/lib/budgets";

export function BudgetGrid({
  items,
  onEdit,
  onDelete,
}: {
  items: BudgetItemDto[];
  onEdit: (budget: BudgetItemDto) => void;
  onDelete: (budgetId: number, name: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(items || []).map((category) => {
        const IconComponent = (Icons as any)[category.icon || "PiggyBank"] || (Icons as any)["PiggyBank"];
        const percentage =
          category.budgetAmount > 0 ? (category.spentAmount / category.budgetAmount) * 100 : 0;
        const remaining = (category.budgetAmount ?? 0) - (category.spentAmount ?? 0);
        const isOverBudget = (category.spentAmount ?? 0) > (category.budgetAmount ?? 0);

        const chipBg = category.color || "bg-muted";
        const barBg = category.color || "bg-muted";

        return (
          <Card key={category.id} className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow relative">
            <CardContent className="p-6">
              <div className="absolute top-4 right-4 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the "{category.name}" budget category.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => onDelete(category.id, category.name)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full text-white", chipBg)}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">{formatCurrency(category.spentAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">{formatCurrency(category.budgetAmount)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {Math.round(percentage)}%
                  </span>
                </div>
                <div
                  className="h-2.5 w-full rounded-full bg-muted overflow-hidden"
                  role="progressbar"
                  aria-valuenow={Math.min(percentage, 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Budget usage"
                >
                  <div
                    className={cn("h-full rounded-full transition-all", isOverBudget ? "bg-destructive" : barBg)}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-muted-foreground">{isOverBudget ? "Over by" : "Remaining"}</span>
                <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
                  {formatCurrency(Math.abs(remaining))}
                </span>
              </div>

              {isOverBudget && (
                <p className="text-destructive text-sm mt-2">
                  Over by {formatCurrency((category.spentAmount ?? 0) - (category.budgetAmount ?? 0))}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
