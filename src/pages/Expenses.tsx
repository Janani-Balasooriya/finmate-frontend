import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/currency";
import { useExpenseTransactions } from "@/features/expenses/hooks/useExpenseTransactions";
import { useExpenseCategories } from "@/features/expenses/hooks/useExpenseCategories";
import { ExpenseTable } from "@/features/expenses/components/ExpenseTable";
import { TotalExpensesCard } from "@/features/expenses/components/TotalExpensesCard";
import { AddExpenseDialog } from "@/features/expenses/components/AddExpenseDialog";
import { EditExpenseDialog } from "@/features/expenses/components/EditExpenseDialog";
import { DeleteExpenseDialog } from "@/features/expenses/components/DeleteExpenseDialog";
import { ExpenseItem, DateRange } from "@/features/expenses/types";
import { accountsApi, AccountItemDto } from "@/lib/accounts";
import { expenseCategoriesApi } from "@/lib/expenses";

const Expenses = () => {
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const { transactions, loading, loadTransactions, loadTransactionsByDateRange, summary, updateTransaction, deleteTransaction } = useExpenseTransactions(formatCurrency);
  const { categories, items, loadCategories, loadItems } = useExpenseCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [amountSortOrder, setAmountSortOrder] = useState("recent");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [accounts, setAccounts] = useState<AccountItemDto[]>([]);

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadTransactions();
    accountsApi.getActive().then(setAccounts).catch(console.error);
  }, [loadCategories, loadTransactions]);

  // Update items when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setSelectedItem("all");
    } else {
      const categoryId = parseInt(selectedCategory);
      loadItems(categoryId);
      setSelectedItem("all");
    }
  }, [selectedCategory, loadItems]);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(t => t.categoryId === categoryId);
    }

    // Filter by category item
    if (selectedItem !== "all") {
      const itemId = parseInt(selectedItem);
      filtered = filtered.filter(t => t.categoryItemId === itemId);
    }

    // Filter by account
    if (selectedAccount !== "all") {
      const accountId = parseInt(selectedAccount);
      filtered = filtered.filter(t => t.accountId === accountId);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const A = a.amountValue ?? 0;
      const B = b.amountValue ?? 0;
      if (amountSortOrder === "high-to-low") return B - A;
      if (amountSortOrder === "low-to-high") return A - B;
      // "recent" - sort by date desc
      return new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime();
    });

    return sorted;
  }, [transactions, selectedCategory, selectedItem, selectedAccount, amountSortOrder]);

  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Select date range";
    if (dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
    } else if (dateRange.from) {
      return `From ${dateRange.from.toLocaleDateString()}`;
    } else if (dateRange.to) {
      return `Until ${dateRange.to.toLocaleDateString()}`;
    }
    return "Select date range";
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      const startDate = range.from.toISOString().split('T')[0];
      const endDate = range.to.toISOString().split('T')[0];
      loadTransactionsByDateRange(startDate, endDate);
    } else {
      loadTransactions();
    }
    setIsDateRangePickerOpen(false);
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    loadTransactions();
  };

  const handleEdit = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setIsEditExpenseOpen(true);
  };

  const handleDelete = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setIsDeleteExpenseOpen(true);
  };

  const handleUpdateExpense = async (id: number, payload: { amount: number; transactionDate: string; accountId: number; categoryId: number; categoryItemId: number }) => {
    try {
      await updateTransaction(id, payload);
      loadTransactions();
      setIsEditExpenseOpen(false);
      setSelectedExpense(null);
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedExpense) return;
    try {
      await deleteTransaction(selectedExpense.id);
      loadTransactions();
      setIsDeleteExpenseOpen(false);
      setSelectedExpense(null);
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Expense Management</h2>
        <Button className="bg-success hover:bg-success/90 text-white" onClick={() => setIsAddExpenseOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                {items.map(item => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={isDateRangePickerOpen} onOpenChange={setIsDateRangePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-80 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="rounded-md border"
                />
                <div className="flex justify-end gap-2 p-3 border-t">
                  <Button variant="outline" size="sm" onClick={clearDateRange}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setIsDateRangePickerOpen(false)}>
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={amountSortOrder} onValueChange={setAmountSortOrder}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by Amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="high-to-low">Amount: High to Low</SelectItem>
                <SelectItem value="low-to-high">Amount: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading expenses...</div>
          ) : (
            <ExpenseTable
              rows={filteredAndSortedTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <TotalExpensesCard
        summary={summary}
        rows={filteredAndSortedTransactions}
        useFiltered={selectedCategory !== "all" || selectedItem !== "all" || selectedAccount !== "all" || !!(dateRange.from || dateRange.to)}
      />

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onExpenseAdded={() => loadTransactions()}
      />

      {/* Edit Expense Dialog */}
      <EditExpenseDialog
        open={isEditExpenseOpen}
        onOpenChange={setIsEditExpenseOpen}
        row={selectedExpense}
        accounts={accounts}
        categories={categories.map(c => ({ id: c.id, name: c.name, icon: '', color: '', budgetAmount: 0 }))}
        onUpdate={handleUpdateExpense}
      />

      {/* Delete Expense Dialog */}
      <DeleteExpenseDialog
        open={isDeleteExpenseOpen}
        onOpenChange={setIsDeleteExpenseOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Expenses;