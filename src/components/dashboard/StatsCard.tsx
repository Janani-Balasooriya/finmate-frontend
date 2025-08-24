import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  amount: string;
  currency: string;
  change: string;
  trend: "up" | "down";
  type: "income" | "expense" | "savings";
}

export function StatsCard({ title, amount, currency, change, trend, type }: StatsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  
  const getAmountColor = () => {
    switch (type) {
      case "income":
        return "text-foreground";
      case "expense":
        return "text-destructive";
      case "savings":
        return "text-success";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <TrendIcon 
            className={cn(
              "h-4 w-4",
              trend === "up" ? "text-success" : "text-destructive"
            )} 
          />
        </div>
        
        <div className="space-y-1">
          <p className={cn("text-2xl font-bold", getAmountColor())}>
            {type === "savings" && "+"}
            {currency} {amount}
          </p>
          <p className="text-xs text-muted-foreground">{change}</p>
          {type === "savings" && (
            <p className="text-xs text-success font-medium">17% savings rate</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}