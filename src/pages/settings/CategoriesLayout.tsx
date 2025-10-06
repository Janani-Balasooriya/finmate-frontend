import { Outlet, useLocation } from "react-router-dom";
import { Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const categoriesNavItems = [
  {
    id: "categories",
    label: "Categories",
    icon: Tag,
    path: "/settings/categories/categories"
  }
];

export function CategoriesLayout() {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[3] || "categories";

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Tag className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>
          <p className="text-muted-foreground">
            Organize and manage your expense categories and subcategories
          </p>
        </div>
      </div>

      {/* Categories Navigation */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <Tabs value={currentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 rounded-t-xl h-auto p-1">
            {categoriesNavItems.map((item) => (
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