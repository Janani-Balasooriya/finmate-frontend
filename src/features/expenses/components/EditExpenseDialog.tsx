import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AccountItemDto } from "@/lib/accounts";
import { ExpenseCategoryDto } from "@/lib/categories";
import { ExpenseItem } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row?: ExpenseItem | null;
  accounts: AccountItemDto[];
  categories: ExpenseCategoryDto[];
  categoryItems?: any[];
  onUpdate: (id: number, payload: any) => Promise<any>;
};

export function EditExpenseDialog({ open, onOpenChange, row, accounts, categories, categoryItems = [], onUpdate }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categoryItem, setCategoryItem] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState("");
  const [isDateOpen, setIsDateOpen] = useState(false);

  useEffect(() => {
    if (!row) return;
    setAmount(row.amountDisplay ? String(row.amountDisplay).replace("Rs. ", "") : "");
    setCategory(String(row.categoryId));
    setCategoryItem(String(row.categoryItemId));
    setAccount(String(row.accountId));
    setDate(row.dateIso);
  }, [row]);

  const submit = async () => {
    if (!row) return;
    const payload = {
      amount: parseFloat(amount.replace(/,/g, '')),
      transactionDate: date,
      accountId: parseInt(account),
      categoryId: parseInt(category),
      categoryItemId: parseInt(categoryItem),
    };
    await onUpdate(row.id, payload);
    onOpenChange(false);
  };

  if (!row) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader><DialogTitle>Edit Expense</DialogTitle></DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input id="edit-amount" placeholder="1500" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Groceries" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-item">Category Item</Label>
              <Select value={categoryItem} onValueChange={setCategoryItem}>
                <SelectTrigger><SelectValue placeholder="Veggies" /></SelectTrigger>
                <SelectContent>
                  {categoryItems.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-account">Account</Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name} ({a.currencyCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button id="edit-date" variant="outline" className="w-full justify-start text-left font-normal">
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
                      const year = selected.getFullYear();
                      const month = String(selected.getMonth() + 1).padStart(2, '0');
                      const day = String(selected.getDate()).padStart(2, '0');
                      setDate(`${year}-${month}-${day}`);
                    }
                  }}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-success hover:bg-success/90 text-white" onClick={submit}>Update Expense</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}