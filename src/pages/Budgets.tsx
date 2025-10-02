// src/pages/budgets.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useBudgets } from "@/features/budgets/hooks/useBudgets";
import { BudgetsOverviewCard } from "@/features/budgets/components/BudgetsOverviewCard";
import { BudgetGrid } from "@/features/budgets/components/BudgetGrid";
import { AddBudgetDialog } from "@/features/budgets/components/AddBudgetDialog";
import { EditBudgetDialog } from "@/features/budgets/components/EditBudgetDialog";

import { BudgetItemDto } from "@/lib/budgets";

export default function Budgets() {
  const { toast } = useToast();
  const { data, loading, error, fetchBudgets, create, update, remove } = useBudgets((o) => toast(o));

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetItemDto | null>(null);

  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    category: "",
    icon: "Utensils",
    color: "bg-orange-500",
  });

  const totalSpent = data?.summary.totalSpent || 0;
  const totalBudget = data?.summary.totalBudget || 0;

  const handleAddBudget = async () => {
    const nameLower = newBudget.name.trim().toLowerCase();
    if ((data?.items || []).some((i) => i.name.trim().toLowerCase() === nameLower)) {
      toast({
        title: "Duplicate name",
        description: "A budget category with this name already exists.",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        name: newBudget.name,
        icon: newBudget.icon,
        color: newBudget.color,
        budgetAmount: Number(newBudget.amount),
      };
      await create(payload);
      toast({ title: "Budget Added", description: "Your new budget category has been created successfully." });
      setIsAddModalOpen(false);
      setNewBudget({ name: "", amount: "", category: "", icon: "Utensils", color: "bg-orange-500" });
      await fetchBudgets();
    } catch (e: any) {
      toast({ title: "Add failed", description: String(e?.message || e), variant: "destructive" });
    }
  };

  const handleEditBudget = (budget: BudgetItemDto) => {
    setEditingBudget(budget);
    setNewBudget({
      name: budget.name,
      amount: String(budget.budgetAmount ?? 0),
      category: budget.name.toLowerCase(),
      icon: budget.icon ?? "Utensils",
      color: budget.color ?? "bg-orange-500",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBudget = async () => {
    const nameLower = newBudget.name.trim().toLowerCase();
    if ((data?.items || []).some((i) => i.name.trim().toLowerCase() === nameLower && i.id !== editingBudget?.id)) {
      toast({
        title: "Duplicate name",
        description: "A budget category with this name already exists.",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        name: newBudget.name,
        icon: newBudget.icon,
        color: newBudget.color,
        budgetAmount: Number(newBudget.amount),
      };
      if (!editingBudget) return;
      await update(Number(editingBudget.id), payload);
      toast({ title: "Budget Updated", description: "Your budget category has been updated successfully." });
      setIsEditModalOpen(false);
      setEditingBudget(null);
      setNewBudget({ name: "", amount: "", category: "", icon: "Utensils", color: "bg-orange-500" });
      await fetchBudgets();
    } catch (e: any) {
      toast({ title: "Update failed", description: String(e?.message || e), variant: "destructive" });
    }
  };

  const handleDeleteBudget = async (budgetId: number, budgetName: string) => {
    try {
      await remove(budgetId);
      toast({ title: "Budget Deleted", description: `${budgetName} budget has been removed.` });
      await fetchBudgets();
    } catch (e: any) {
      toast({ title: "Delete failed", description: String(e?.message || e), variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <BudgetsOverviewCard totalSpent={totalSpent} totalBudget={totalBudget} />

      {/* Add Budget Button + Controlled Dialog */}
      <div className="flex justify-end mb-6">
        <Button size="lg" className="h-10" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
        <AddBudgetDialog
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          value={newBudget}
          onChange={setNewBudget}
          onSubmit={handleAddBudget}
        />
      </div>

      {/* Category Budgets Grid */}
      <div className="mb-6">
        <BudgetGrid items={data?.items || []} onEdit={handleEditBudget} onDelete={handleDeleteBudget} />
      </div>

      {/* Edit Dialog (controlled) */}
      <EditBudgetDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        value={newBudget}
        onChange={setNewBudget}
        onSubmit={handleUpdateBudget}
      />
    </div>
  );
}
