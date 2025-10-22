import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import type { Subscription } from "../types";

export default function MonthlyOverview({ subscriptions }: { subscriptions: Subscription[] }) {
  const totalMonthly = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const activeCount = subscriptions.filter((s) => s.isActive).length;

  return (
    <div className="lg:sticky lg:top-20 z-10 mb-6 md:mb-8">
      <Card className="rounded-xl border bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-muted/30 shadow-lg ring-1 ring-primary/10 relative before:absolute before:inset-x-0 before:-top-px before:h-1 before:bg-gradient-to-r before:from-primary/40 before:via-primary/20 before:to-transparent before:rounded-t-xl">
        <CardContent className="p-6 md:p-8 flex items-start justify-between gap-6">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-3 flex items-center gap-1.5 w-fit">
              <DollarSign className="h-3 w-3" />
              Monthly Overview
            </Badge>
            <p className="text-4xl font-extrabold tracking-tight text-foreground mb-1">
              ${totalMonthly.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
          </div>
          <div className="rounded-lg bg-background/60 backdrop-blur px-4 py-3 shadow-sm border">
            <p className="text-3xl font-bold text-center">{activeCount}</p>
            <p className="text-sm text-muted-foreground text-center">Active Subscriptions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
