import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useExpenseCategories } from "../hooks/useExpenseCategories";
import { useExpenseTransactions } from "../hooks/useExpenseTransactions";
import { accountsApi, AccountItemDto } from "@/lib/accounts";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  const { toast } = useToast();
  const { categories, items, loadCategories, loadItems } = useExpenseCategories();
  const { createTransaction } = useExpenseTransactions();

  const [accounts, setAccounts] = useState<AccountItemDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    categoryItemId: "",
    accountId: "",
    transactionDate: new Date().toISOString().split('T')[0],
  });

  // Load accounts and categories when dialog opens
  React.useEffect(() => {
    if (open) {
      accountsApi.getActive().then(setAccounts).catch(console.error);
      loadCategories();
    }
  }, [open, loadCategories]);

  // Load category items when category changes
  React.useEffect(() => {
    if (formData.categoryId) {
      loadItems(parseInt(formData.categoryId));
      setFormData(prev => ({ ...prev, categoryItemId: "" }));
    }
  }, [formData.categoryId, loadItems]);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.categoryItemId || !formData.accountId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createTransaction({
        amount: parseFloat(formData.amount),
        transactionDate: formData.transactionDate,
        accountId: parseInt(formData.accountId),
        categoryItemId: parseInt(formData.categoryItemId),
      });

      // Reset form
      setFormData({
        amount: "",
        categoryId: "",
        categoryItemId: "",
        accountId: "",
        transactionDate: new Date().toISOString().split('T')[0],
      });

      onOpenChange(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: "",
      categoryId: "",
      categoryItemId: "",
      accountId: "",
      transactionDate: new Date().toISOString().split('T')[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account *</Label>
              <Select
                value={formData.accountId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryItem">Category Item *</Label>
              <Select
                value={formData.categoryItemId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryItemId: value }))}
                disabled={!formData.categoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.transactionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.amount || !formData.categoryItemId || !formData.accountId}
            className="bg-success hover:bg-success/90 text-white"
          >
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}