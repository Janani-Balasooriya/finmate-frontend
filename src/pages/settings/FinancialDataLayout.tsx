import { Outlet, useLocation } from "react-router-dom";
import { Settings, CreditCard, TrendingUp, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const financialDataNavItems = [
  {
    id: "accounts",
    label: "Accounts",
    icon: CreditCard,
    path: "/settings/financial-data/accounts"
  },
  {
    id: "income-sources",
    label: "Income Sources",
    icon: TrendingUp,
    path: "/settings/financial-data/income-sources"
  }
];

export function FinancialDataLayout() {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[3] || "accounts";

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Financial Data</h1>
          <p className="text-muted-foreground">
            Manage your accounts and income sources
          </p>
        </div>
      </div>

      {/* Financial Data Navigation */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <Tabs value={currentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-t-xl h-auto p-1">
            {financialDataNavItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                asChild
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </Tabs>
      </Card>
    </div>
  );
}