import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, AlertCircle, Bell, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { dashboardApi, InsightItem } from "@/lib/dashboard";
import { useToast } from "@/hooks/use-toast";

export function KeyInsights() {
  const { toast } = useToast();
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await dashboardApi.getInsights();
        setInsights(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to load insights",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [toast]);

  const getInsightStyles = (severity: string) => {
    switch (severity) {
      case 'warning':
        return {
          bg: 'bg-warning/10 border-warning/20 hover:bg-warning/15',
          icon: 'text-warning',
          badge: 'bg-warning text-warning-foreground'
        };
      case 'danger':
        return {
          bg: 'bg-destructive/10 border-destructive/20 hover:bg-destructive/15',
          icon: 'text-destructive',
          badge: 'bg-destructive text-destructive-foreground'
        };
      case 'success':
        return {
          bg: 'bg-success/10 border-success/20 hover:bg-success/15',
          icon: 'text-success',
          badge: 'bg-success text-success-foreground'
        };
      case 'info':
        return {
          bg: 'bg-primary/10 border-primary/20 hover:bg-primary/15',
          icon: 'text-primary',
          badge: 'bg-primary text-primary-foreground'
        };
      default:
        return {
          bg: 'bg-muted/50 border-muted hover:bg-muted',
          icon: 'text-muted-foreground',
          badge: 'bg-muted text-muted-foreground'
        };
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
      case 'danger':
        return AlertTriangle;
      case 'success':
        return TrendingUp;
      case 'info':
        return Info;
      default:
        return AlertCircle;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5 text-primary animate-pulse" />
          Key Insights
          <Badge variant="secondary" className="ml-auto">
            {insights.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading insights...</div>
        ) : insights.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No insights available</div>
        ) : (
          insights.map((insight, index) => {
            const styles = getInsightStyles(insight.severity);
            const IconComponent = getIcon(insight.severity);
            return (
              <div
                key={insight.id}
                className={cn(
                  "group relative p-3 rounded-lg border transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-md",
                  styles.bg
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-1.5 rounded-full bg-background/80", styles.icon)}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {insight.title}
                    </p>
                    {insight.detail && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.detail}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", styles.badge)}
                  >
                    {insight.severity}
                  </Badge>
                </div>

                {/* Notification dot animation */}
                <div className={cn(
                  "absolute top-2 right-2 w-2 h-2 rounded-full opacity-60 animate-pulse",
                  insight.severity === 'danger' ? 'bg-destructive' :
                  insight.severity === 'warning' ? 'bg-warning' :
                  insight.severity === 'success' ? 'bg-success' : 'bg-primary'
                )} />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}