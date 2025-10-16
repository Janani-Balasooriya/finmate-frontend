import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useExpenseTransactions } from "@/features/expenses/hooks/useExpenseTransactions";
import { useExpenseCategories } from "@/features/expenses/hooks/useExpenseCategories";
import { ExpenseTable } from "@/features/expenses/components/ExpenseTable";
import { TotalExpensesCard } from "@/features/expenses/components/TotalExpensesCard";
import { AddExpenseDialog } from "@/features/expenses/components/AddExpenseDialog";
import { ExpenseItem, DateRange } from "@/features/expenses/types";

const Expenses = () => {
  const { toast } = useToast();
  const { transactions, loading, loadTransactions, loadTransactionsByDateRange, summary } = useExpenseTransactions();
  const { categories, items, loadCategories, loadItems } = useExpenseCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [amountSortOrder, setAmountSortOrder] = useState("recent");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadTransactions();
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
  }, [transactions, selectedCategory, selectedItem, amountSortOrder]);

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
    // TODO: Implement edit functionality
    toast({
      title: "Edit",
      description: `Edit expense ${expense.id}`,
    });
  };

  const handleDelete = (expense: ExpenseItem) => {
    // TODO: Implement delete functionality
    toast({
      title: "Delete",
      description: `Delete expense ${expense.id}`,
    });
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
        useFiltered={true}
      />

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onExpenseAdded={() => loadTransactions()}
      />
    </div>
  );
};

export default Expenses;