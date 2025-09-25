import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Icons from "lucide-react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { assignDistinctAccents } from "@/lib/accents";
import { cn } from "@/lib/utils";
import IconPicker from "@/components/IconPicker";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);
import { budgetsApi, BudgetsResponseDto, BudgetItemDto } from "@/lib/budgets";
export default function Budgets() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [data, setData] = useState<BudgetsResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    category: "",
    icon: "Utensils",
    color: "bg-orange-500"
  });
  // No local icon search here; IconPicker provides its own search
  const { toast } = useToast();
  
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetsApi.get();
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load budgets");
      toast({ title: "Failed to load budgets", description: String(e?.message || e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const accents = useMemo(() => assignDistinctAccents((data?.items || [])), [data]);

  const handleAddBudget = async () => {
    try {
      const payload = { name: newBudget.name, icon: newBudget.icon, color: newBudget.color, budgetAmount: Number(newBudget.amount) };
      await budgetsApi.create(payload);
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
      icon: (budget.icon ?? "Utensils"),
      color: budget.color ?? "bg-orange-500"
    });
    setIsEditModalOpen(true);
  };
  const handleUpdateBudget = async () => {
    try {
      const payload = { name: newBudget.name, icon: newBudget.icon, color: newBudget.color, budgetAmount: Number(newBudget.amount) };
      await budgetsApi.update(Number(editingBudget.id), payload);
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
      await budgetsApi.remove(budgetId);
      toast({ title: "Budget Deleted", description: `${budgetName} budget has been removed.` });
      await fetchBudgets();
    } catch (e: any) {
      toast({ title: "Delete failed", description: String(e?.message || e), variant: "destructive" });
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount).replace('₹', 'Rs.');
  };
  const totalSpent = data?.summary.totalSpent || 0;
  const totalBudget = data?.summary.totalBudget || 0;
  const remaining = totalBudget - totalSpent;

  const getProgressMessage = () => {
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;
    if (spentPercentage > 100) {
      return "You're over budget this month. Consider reviewing your spending.";
    } else if (spentPercentage > 80) {
      return "You're approaching your budget limit. Monitor your spending.";
    } else {
      return "You're well within your budget. Great job!";
    }
  };
  const getProgressMessageColor = () => {
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;
    return spentPercentage > 80 ? "text-destructive" : "text-muted-foreground";
  };

  // Chart.js configuration for animated progress bar
  const createProgressChartData = () => {
    const spentPercentage = Math.min(totalBudget > 0 ? ((totalSpent / totalBudget) * 100) : 0, 100);
    const remainingPercentage = Math.max(100 - spentPercentage, 0);
    const overBudgetPercentage = totalBudget > 0 && totalSpent > totalBudget ? ((totalSpent - totalBudget) / totalBudget) * 100 : 0;

    return {
      datasets: [{
        data: overBudgetPercentage > 0 
          ? [spentPercentage, overBudgetPercentage]
          : [spentPercentage, remainingPercentage],
      backgroundColor: overBudgetPercentage > 0
        ? ['#f87171', '#ef4444'] // red-400, red-500
        : ['#f87171', '#22c55e'], // red-400, green-500
        borderWidth: 0,
        cutout: '75%',
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    animation: {
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart' as const
    }
  } as const;

  // Icon options are handled by IconPicker

  const colorOptions = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-red-500",
    "bg-indigo-500",
  ];

  return <div className="space-y-8">
      {/* Page Header */}
      

      {/* Budget Overview */}
      <section aria-labelledby="budgets-summary">
        <Card className="rounded-xl border bg-gradient-to-b from-background to-muted/50 shadow-lg ring-1 ring-primary/10">
          <CardContent className="p-6 md:p-8">
            {/* Mobile/Tablet Layout - Vertical */}
            <div className="lg:hidden space-y-8">
              {/* Total Budget - Full Width */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Monthly Budget</p>
                <p className="text-3xl md:text-4xl font-extrabold tracking-tight">{formatCurrency(totalBudget)}</p>
              </div>

              {/* Spent and Remaining - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Spent</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-red-500 break-all">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-green-600 break-all">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>
              
              {/* Chart - Centered */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <Doughnut data={createProgressChartData()} options={chartOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
                    <span className="text-xs text-muted-foreground">Used</span>
                  </div>
                </div>
              </div>
              
              {/* Legend - Responsive */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-muted-foreground">Spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-muted-foreground">Remaining</span>
                </div>
                {totalSpent > totalBudget && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span className="text-destructive">Over budget</span>
                  </div>
                )}
              </div>
              
              {/* Status Message */}
              <p className={`text-sm text-center ${getProgressMessageColor()} animate-fade-in`}>
                {totalSpent > totalBudget 
                  ? `Over by ${formatCurrency(totalSpent - totalBudget)}` 
                  : getProgressMessage()
                }
              </p>
            </div>

            {/* Desktop Layout - Three Column */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center">
              {/* Left Section - Total Budget */}
              <div className="flex flex-col items-center lg:items-start space-y-4">
                <div className="text-center lg:text-left">
                  <p className="text-sm text-muted-foreground mb-2">Total Monthly Budget</p>
                  <p className="text-3xl xl:text-4xl font-extrabold tracking-tight">{formatCurrency(totalBudget)}</p>
                </div>
                
                {/* Status Message */}
                <p className={`text-sm text-center lg:text-left ${getProgressMessageColor()} animate-fade-in`}>
                  {totalSpent > totalBudget 
                    ? `Over by ${formatCurrency(totalSpent - totalBudget)}` 
                    : getProgressMessage()
                  }
                </p>
              </div>

              {/* Center Section - Chart */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-40 h-40 xl:w-48 xl:h-48">
                  <Doughnut data={createProgressChartData()} options={chartOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl xl:text-4xl font-bold">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
                    <span className="text-sm text-muted-foreground">Used</span>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-muted-foreground">Spent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground">Remaining</span>
                  </div>
                  {totalSpent > totalBudget && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-destructive">Over budget</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Spent & Remaining */}
              <div className="flex flex-col items-center lg:items-end space-y-6">
                <div className="text-center lg:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Spent</p>
                  <p className="text-2xl xl:text-3xl font-extrabold tracking-tight text-red-500">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className="text-2xl xl:text-3xl font-extrabold tracking-tight text-green-600">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Add Budget Button */}
      <div className="flex justify-end mb-6">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-10">
              <Plus className="w-4 h-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
              <DialogDescription>
                Create a new budget category to track your spending.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="budget-name">Category Name</Label>
                <Input id="budget-name" placeholder="e.g. Healthcare, Education" value={newBudget.name} onChange={e => setNewBudget({
                ...newBudget,
                name: e.target.value
              })} autoFocus />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget-amount">Target Amount (Rs.)</Label>
                <Input id="budget-amount" type="number" placeholder="Enter amount" value={newBudget.amount} onChange={e => setNewBudget({
                ...newBudget,
                amount: e.target.value
              })} />
              </div>

              {/* Icon selector */}
              <div className="space-y-2">
                <Label>Category Icon</Label>
                <IconPicker
                  value={newBudget.icon}
                  onChange={(icon) => setNewBudget({ ...newBudget, icon })}
                />
              </div>

              {/* Color selector */}
              <div className="space-y-2">
                <Label>Category Color</Label>
                <div className="grid grid-cols-9 gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewBudget({ ...newBudget, color: c })}
                      className={cn(
                        "h-8 w-8 rounded-full border",
                        c,
                        newBudget.color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                      )}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
              
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBudget} disabled={!newBudget.name || !newBudget.amount || Number(newBudget.amount) <= 0}>
                Add Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Budgets */}
      <div className="mb-6">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.items || []).map(category => {
          const IconComponent = (Icons as any)[category.icon || 'PiggyBank'] || (Icons as any)['PiggyBank'];
          const percentage = category.budgetAmount > 0 ? (category.spentAmount / category.budgetAmount * 100) : 0;
          const remaining = (category.budgetAmount ?? 0) - (category.spentAmount ?? 0);
          const isOverBudget = (category.spentAmount ?? 0) > (category.budgetAmount ?? 0);
          
          // Get assigned accent colors for this category
          const key = String(category.id ?? category.name);
          const { icon, bar } = accents.get(key) ?? { icon: "bg-muted", bar: "bg-muted" };
          return <Card key={category.id} className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow relative">
                <CardContent className="p-6">
                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEditBudget(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteBudget(category.id, category.name)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Icon and Category */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full", icon)}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                    </div>
                  </div>

                  {/* Budget vs Spent */}
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

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden" role="progressbar"
                         aria-valuenow={Math.min(percentage, 100)} aria-valuemin={0} aria-valuemax={100} 
                         aria-label="Budget usage">
                      <div className={cn("h-full rounded-full transition-all", isOverBudget ? "bg-destructive" : bar)} 
                           style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-muted-foreground">
                      {isOverBudget ? "Over by" : "Remaining"}
                    </span>
                    <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {formatCurrency(Math.abs(remaining))}
                    </span>
                  </div>
                  
                  {/* Over budget warning */}
                  {isOverBudget && (
                    <p className="text-destructive text-sm mt-2">Over by {formatCurrency((category.spentAmount ?? 0) - (category.budgetAmount ?? 0))}</p>
                  )}
                </CardContent>
              </Card>;
        })}
        </div>
      </div>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget category settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-budget-name">Category Name</Label>
              <Input id="edit-budget-name" placeholder="e.g. Healthcare, Education" value={newBudget.name} onChange={e => setNewBudget({
              ...newBudget,
              name: e.target.value
            })} autoFocus />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-budget-amount">Target Amount</Label>
              <Input id="edit-budget-amount" type="number" placeholder="Enter amount" value={newBudget.amount} onChange={e => setNewBudget({
              ...newBudget,
              amount: e.target.value
            })} />
            </div>

          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBudget} disabled={!newBudget.name || !newBudget.amount || Number(newBudget.amount) <= 0}>
              Update Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}