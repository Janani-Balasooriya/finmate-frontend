import { Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import CategoriesPage from "./CategoriesPage";

export function CategoriesLayout() {
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

      {/* Categories Content */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <CategoriesPage />
        </div>
      </Card>
    </div>
  );
}