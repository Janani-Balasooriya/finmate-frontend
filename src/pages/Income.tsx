import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useAccounts } from "@/features/income/hooks/useAccounts";
import { useIncomeSources } from "@/features/income/hooks/useIncomeSources";
import { useIncomeTransactions } from "@/features/income/hooks/useIncomeTransactions";
import { IncomeToolbar } from "@/features/income/components/IncomeToolbar";
import { IncomeTable } from "@/features/income/components/IncomeTable";
import { TotalIncomeCard } from "@/features/income/components/TotalIncomeCard";
import { NewAccountDialog } from "@/features/income/components/NewAccountDialog";
import { NewIncomeSourceDialog } from "@/features/income/components/NewIncomeSourceDialog";
import { AddIncomeDialog } from "@/features/income/components/AddIncomeDialog";
import { EditIncomeDialog } from "@/features/income/components/EditIncomeDialog";
import { DeleteIncomeDialog } from "@/features/income/components/DeleteIncomeDialog";

import { DateRange, IncomeItem } from "@/features/income/types";
import { filterByDateRange } from "@/features/income/utils/filterByDateRange";
import { usePagination } from "@/features/income/hooks/usePagination";

export default function IncomePage() {
  const { toast } = useToast();
  const { accounts, currencyCodes, createAccount } = useAccounts((o) => toast(o));
  const { incomeSources, createIncomeSource } = useIncomeSources((o) => toast(o));
  const { 
    incomeItems, 
    summary, 
    loading, 
    loadTransactions, 
    loadSummary, 
    loadTransactionsByDateRange,
    createTransaction,
    getCurrentMonthIncome 
  } = useIncomeTransactions();

  // Toolbar state
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [amountSortOrder, setAmountSortOrder] = useState("recent");
  const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);

  // Filter + sort
  const filtered = filterByDateRange(incomeItems, dateRange);
  const sorted = [...filtered].sort((a, b) => {
    const A = Number(a.amount.replace(/[^\d.]/g, "").replace(/,/g, "")) || 0;
    const B = Number(b.amount.replace(/[^\d.]/g, "").replace(/,/g, "")) || 0;
    if (amountSortOrder === "high-to-low") return B - A;
    if (amountSortOrder === "low-to-high") return A - B;
    return 0; // "recent" – keep backend order
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { total, totalPages, start, end, current } = usePagination(sorted, currentPage, itemsPerPage);

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);

  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isNewSourceOpen, setIsNewSourceOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadTransactions();
    loadSummary();
    loadCurrentMonthIncome();
  }, [loadTransactions, loadSummary]);

  const loadCurrentMonthIncome = async () => {
    try {
      const income = await getCurrentMonthIncome();
      setCurrentMonthIncome(income);
    } catch (error) {
      console.error('Failed to load current month income:', error);
    }
  };

  // Handle date range changes
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      const startDate = range.from.toISOString().split('T')[0];
      const endDate = range.to.toISOString().split('T')[0];
      loadTransactionsByDateRange(startDate, endDate);
    } else {
      loadTransactions();
    }
  };

  // Handlers
  const onEdit = (row: IncomeItem) => { setEditingIncome(row); setIsEditDialogOpen(true); };
  const onDelete = (_row: IncomeItem) => { setIsDeleteDialogOpen(true); };

  const handleCreateTransaction = async (payload: any) => {
    await createTransaction(payload);
    await loadCurrentMonthIncome(); // Refresh current month income
  };

  const selectNewAccount = (id: number) => {
    toast({ title: "Account created", description: "New account has been created successfully" });
    // You can set a selected account state if you maintain one in Add dialog
  };

  const selectNewSource = (id: number) => {
    toast({ title: "Income Source created", description: "New income source has been created successfully" });
    // You can set a selected source state if you maintain one in Add dialog
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Income Management</h2>
        <Button className="bg-success hover:bg-success/90 text-white" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Income History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-end">
            <div className="bg-success/10 text-success border-success/20 text-sm px-3 py-1 rounded-md">
              You've earned ${currentMonthIncome.toLocaleString()} this month
            </div>
          </div>

          <IncomeToolbar
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onClearRange={() => {
              setDateRange({});
              loadTransactions();
            }}
            amountSortOrder={amountSortOrder}
            onAmountSortChange={setAmountSortOrder}
          />
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading income transactions...</div>
            </div>
          ) : (
            <IncomeTable rows={current} onEdit={onEdit} onDelete={onDelete} />
          )}
        </CardContent>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-top border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">Show</Label>
              <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {start + 1} to {Math.min(end, total)} of {total} incomes
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button key={page}
                        variant={currentPage === page ? "secondary" : "outline"}
                        size="sm" className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(page)}>
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Total */}
      <TotalIncomeCard summary={summary} rows={sorted} />

      {/* Dialogs */}
      <AddIncomeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        accounts={accounts}
        incomeSources={incomeSources}
        onOpenNewAccount={() => setIsNewAccountOpen(true)}
        onOpenNewSource={() => setIsNewSourceOpen(true)}
        onCreateTransaction={handleCreateTransaction}
      />

      <EditIncomeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        row={editingIncome}
        accounts={accounts}
        incomeSources={incomeSources}
      />

      <DeleteIncomeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => setIsDeleteDialogOpen(false)}
      />

      <NewAccountDialog
        open={isNewAccountOpen}
        onOpenChange={setIsNewAccountOpen}
        currencyCodes={currencyCodes}
        onCreate={createAccount}
        onCreated={selectNewAccount}
      />

      <NewIncomeSourceDialog
        open={isNewSourceOpen}
        onOpenChange={setIsNewSourceOpen}
        onCreate={createIncomeSource}
        onCreated={selectNewSource}
      />
    </div>
  );
}
