import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
const incomeData = [{
  id: 1,
  date: "Jan 15, 2025",
  source: "Salary",
  note: "Monthly Salary",
  amount: "Rs. 80,000",
  account: "Credit Card",
  type: "salary"
}, {
  id: 2,
  date: "Jan 14, 2025",
  source: "Freelance",
  note: "Web Design",
  amount: "Rs. 20,000",
  account: "Bank Account",
  type: "freelance"
}, {
  id: 3,
  date: "Jan 13, 2025",
  source: "Freelance",
  note: "App Design",
  amount: "Rs. 20,000",
  account: "Bank Account",
  type: "freelance"
}];
const Income = () => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [accountNote, setAccountNote] = useState("");
  const [isAddDatePickerOpen, setIsAddDatePickerOpen] = useState(false);

  // Date range and sorting (matching Expenses page controls)
  const [dateRange, setDateRange] = useState({ from: undefined as Date | undefined, to: undefined as Date | undefined });
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  const [amountSortOrder, setAmountSortOrder] = useState("recent");

  // Pagination states (matching Expenses page)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deletingIncomeId, setDeletingIncomeId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editAccount, setEditAccount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [isEditDatePickerOpen, setIsEditDatePickerOpen] = useState(false);
  
  // Date range display formatting (same as Expenses)
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

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range as { from: Date | undefined; to: Date | undefined });
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  // Date range filtering logic for incomes (mirrors Expenses behavior)
  const filteredIncomes = incomeData.filter(income => {
    if (!dateRange.from && !dateRange.to) return true;
    const incomeDate = new Date(income.date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    if (fromDate && toDate) {
      return incomeDate >= fromDate && incomeDate <= toDate;
    } else if (fromDate) {
      return incomeDate >= fromDate;
    } else if (toDate) {
      return incomeDate <= toDate;
    }
    return true;
  });

  // Pagination helpers
  const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIncomes = filteredIncomes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    setItemsPerPage(parseInt(newItemsPerPage));
    setCurrentPage(1);
  };
  const handleEditClick = income => {
    setEditingIncome(income);
    setEditAmount(income.amount.replace("Rs. ", ""));
    setEditSource(income.source.toLowerCase());
    setEditAccount(income.account.toLowerCase().replace(" ", ""));
    setEditDate(new Date(income.date).toISOString().split('T')[0]);
    setEditNote(income.note);
    setIsEditDialogOpen(true);
  };
  return <div className="space-y-6">
          {/* Add Income Button */}
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
              <div className="flex items-center justify-end ">
                
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  You've earned $1,580 this month
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>

                <Popover open={isDateRangePickerOpen} onOpenChange={setIsDateRangePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-80 justify-start text-left font-normal"
                    >
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDateRange}
                      >
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsDateRangePickerOpen(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Select
                  value={amountSortOrder}
                  onValueChange={setAmountSortOrder}
                >
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentIncomes.map(income => <TableRow key={income.id}>
                      <TableCell className="font-medium">{income.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={income.type === 'salary' ? 'bg-blue-100 text-blue-700' : 'bg-success/10 text-success'}>
                          {income.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{income.amount}</TableCell>
                      <TableCell>{income.account}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10" onClick={() => handleEditClick(income)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => {
                    setDeletingIncomeId(income.id);
                    setIsDeleteDialogOpen(true);
                  }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-top border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="items-per-page" className="text-sm">Show</Label>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
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
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredIncomes.length)} of {filteredIncomes.length} incomes
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "secondary" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
      </Card>

      {/* Total Income Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">Total Income</h3>
              <p className="text-sm text-muted-foreground">Sum of all incomes in range</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">
                Rs. {filteredIncomes.reduce((total, income) => {
                  const amount = parseFloat(income.amount.replace("Rs. ", "").replace(",", ""));
                  return total + amount;
                }, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{filteredIncomes.length} income{filteredIncomes.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Income Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Income</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" placeholder="1500" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Salary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover open={isAddDatePickerOpen} onOpenChange={setIsAddDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? new Date(date).toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={date ? new Date(date) : undefined}
                      onSelect={(selected) => {
                        if (selected) {
                          const iso = new Date(selected).toISOString().split('T')[0];
                          setDate(iso);
                        }
                      }}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
                        
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-success hover:bg-success/90 text-white">
                Add Income
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Income Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <Input id="edit-amount" placeholder="1500" value={editAmount} onChange={e => setEditAmount(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-source">Source</Label>
                <Select value={editSource} onValueChange={setEditSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Salary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-account">Account</Label>
                <Select value={editAccount} onValueChange={setEditAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Popover open={isEditDatePickerOpen} onOpenChange={setIsEditDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editDate ? new Date(editDate).toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={editDate ? new Date(editDate) : undefined}
                      onSelect={(selected) => {
                        if (selected) {
                          const iso = new Date(selected).toISOString().split('T')[0];
                          setEditDate(iso);
                        }
                      }}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
           
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-success hover:bg-success/90 text-white">
                Update Income
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Income</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this income entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Income;