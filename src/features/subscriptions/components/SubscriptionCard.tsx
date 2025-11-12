import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, DollarSign, Edit, Trash2 } from "lucide-react";
import { formatDate } from "../utils/format";
import type { Subscription } from "../types";
import type { SubscriptionItem } from "@/lib/subscriptions";
import { useMemo } from "react";
import { convertUSDToLKR } from "@/lib/currency";

type Props = {
  subscription: SubscriptionItem;
  onEdit: (sub: SubscriptionItem) => void;
  onDelete: (id: number | string) => void;
};

export default function SubscriptionCard({ subscription, onEdit, onDelete }: Props) {
  // Convert LKR back to USD for display
  const usdAmount = subscription.amount / 290;
  const lkrAmount = subscription.amount;

  const nextBillingDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const nextDate = new Date(subscription.nextBilling);

    // Keep advancing the date until it's after today
    while (nextDate <= today) {
      switch (subscription.billingCycle) {
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          break;
      }
    }

    return nextDate;
  }, [subscription.nextBilling, subscription.billingCycle]);

  return (
    <Card className="rounded-xl border border-border/70 bg-card shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{subscription.name}</h3>

              <Badge
                className={`${subscription.categoryColor}`}
              >
                {subscription.categoryName}
              </Badge>
              {/* {subscription.isActive && <Badge variant="default">Active</Badge>} */}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  USD {usdAmount.toFixed(2)} (LKR {lkrAmount.toLocaleString()}) /{subscription.billingCycle}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Next billing: {formatDate(nextBillingDate)}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">Account: {subscription.accountName}</div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground"
              onClick={() => onEdit(subscription)}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(subscription.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
