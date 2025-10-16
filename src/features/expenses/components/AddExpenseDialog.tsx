import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useExpenseCategories } from "../hooks/useExpenseCategories";
import { useExpenseTransactions } from "../hooks/useExpenseTransactions";
import { accountsApi, AccountItemDto, CurrencyCodeDto } from "@/lib/accounts";
import { categoriesApi } from "@/lib/categories";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseDialog({ open, onOpenChange, onExpenseAdded }: AddExpenseDialogProps & { onExpenseAdded?: () => void }) {
  const { toast } = useToast();
  const { categories, items, loadCategories, loadItems } = useExpenseCategories();
  const { createTransaction } = useExpenseTransactions();

  const [accounts, setAccounts] = useState<AccountItemDto[]>([]);
  const [currencyCodes, setCurrencyCodes] = useState<CurrencyCodeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddCategoryItemOpen, setIsAddCategoryItemOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({ name: "", currencyCodesId: 0, openingBalance: 0 });
  const [newItemForm, setNewItemForm] = useState({ name: "" });

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    categoryItemId: "",
    accountId: "",
    transactionDate: new Date().toISOString().split('T')[0],
  });

  // Load accounts, currency codes and categories when dialog opens
  React.useEffect(() => {
    if (open) {
      Promise.all([
        accountsApi.getActive(),
        accountsApi.getCurrencyCodes()
      ]).then(([accountsData, currencyData]) => {
        setAccounts(accountsData);
        setCurrencyCodes(currencyData);
      }).catch(console.error);
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
      onExpenseAdded?.();
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
              <div className="flex gap-2">
                <Select
                  value={formData.accountId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
                >
                  <SelectTrigger className="flex-1">
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
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAddAccountOpen(true)}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
              <div className="flex gap-2">
                <Select
                  value={formData.categoryItemId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryItemId: value }))}
                  disabled={!formData.categoryId}
                >
                  <SelectTrigger className="flex-1">
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
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAddCategoryItemOpen(true)}
                  disabled={!formData.categoryId}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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

        {/* Add Account Modal */}
        <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>Create a new account to track your income and expenses.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  placeholder="e.g. Main Bank Account"
                  value={newAccountForm.name}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newAccountForm.currencyCodesId ? String(newAccountForm.currencyCodesId) : ""}
                  onValueChange={(v) => setNewAccountForm({ ...newAccountForm, currencyCodesId: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyCodes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening-balance">Opening Balance</Label>
                <Input
                  id="opening-balance"
                  type="number"
                  placeholder="0.00"
                  value={newAccountForm.openingBalance}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, openingBalance: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  try {
                    const created = await accountsApi.create(newAccountForm);
                    setAccounts(prev => [...prev, created]);
                    setFormData(prev => ({ ...prev, accountId: created.id.toString() }));
                    setIsAddAccountOpen(false);
                    setNewAccountForm({ name: "", currencyCodesId: 0, openingBalance: 0 });
                  } catch (error) {
                    console.error("Failed to create account:", error);
                  }
                }}
                disabled={!newAccountForm.name || newAccountForm.currencyCodesId === 0}
              >
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Item Modal */}
        <Dialog open={isAddCategoryItemOpen} onOpenChange={setIsAddCategoryItemOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category Item</DialogTitle>
              <DialogDescription>
                Add a new item to the "{categories.find(c => c.id.toString() === formData.categoryId)?.name}" category.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-item-name">Item Name</Label>
                <Input
                  id="add-item-name"
                  placeholder="e.g. Groceries"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCategoryItemOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!formData.categoryId || !newItemForm.name) return;

                  try {
                    const categoryId = parseInt(formData.categoryId);
                    const createdItem = await categoriesApi.createCategoryItem(categoryId, newItemForm);
                    // Refresh items for the selected category
                    loadItems(categoryId);
                    setFormData(prev => ({ ...prev, categoryItemId: createdItem.id.toString() }));
                    setIsAddCategoryItemOpen(false);
                    setNewItemForm({ name: "" });
                  } catch (error) {
                    console.error("Failed to create category item:", error);
                  }
                }}
                disabled={!newItemForm.name}
              >
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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