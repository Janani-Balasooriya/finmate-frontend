import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { accountsApi, AccountItemDto, AccountBalanceDto, CurrencyCodeDto } from "@/lib/accounts";
import { useToast } from "@/hooks/use-toast";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountItemDto[]>([]);
  const [accountBalances, setAccountBalances] = useState<AccountBalanceDto[]>([]);
  const [currencyCodes, setCurrencyCodes] = useState<CurrencyCodeDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountItemDto | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<AccountItemDto | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    currencyCodesId: 0,
    openingBalance: 0,
    active: true
  });
  
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsData, balancesData, currencyData] = await Promise.all([
        accountsApi.getActive(),
        accountsApi.getBalances(),
        accountsApi.getCurrencyCodes()
      ]);
      setAccounts(accountsData);
      setAccountBalances(balancesData);
      setCurrencyCodes(currencyData);
    } catch (error) {
      toast({
        title: "Failed to load accounts",
        description: "Could not load account data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAccount = async () => {
    try {
      const createdAccount = await accountsApi.create({
        name: formData.name,
        currencyCodesId: formData.currencyCodesId,
        openingBalance: formData.openingBalance
      });
      setAccounts(prev => [...prev, createdAccount]);
      setIsAddModalOpen(false);
      resetForm();
      toast({
        title: "Account created",
        description: "New account has been created successfully"
      });
      await fetchData(); // Refresh balances
    } catch (error: any) {
      toast({
        title: "Failed to create account",
        description: error?.message || "Could not create account",
        variant: "destructive"
      });
    }
  };

  const handleEditAccount = async () => {
    if (!editingAccount) return;
    
    try {
      const updatedAccount = await accountsApi.update(editingAccount.id, {
        name: formData.name,
        currencyCodesId: formData.currencyCodesId,
        openingBalance: formData.openingBalance,
        active: formData.active
      });
      setAccounts(prev => prev.map(acc => acc.id === editingAccount.id ? updatedAccount : acc));
      setIsEditModalOpen(false);
      setEditingAccount(null);
      resetForm();
      toast({
        title: "Account updated",
        description: "Account has been updated successfully"
      });
      await fetchData(); // Refresh balances
    } catch (error: any) {
      toast({
        title: "Failed to update account",
        description: error?.message || "Could not update account",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return;
    
    try {
      await accountsApi.archive(deletingAccount.id);
      setAccounts(prev => prev.filter(acc => acc.id !== deletingAccount.id));
      setIsDeleteModalOpen(false);
      setDeletingAccount(null);
      toast({
        title: "Account archived",
        description: "Account has been archived successfully"
      });
      await fetchData(); // Refresh balances
    } catch (error: any) {
      toast({
        title: "Failed to archive account",
        description: error?.message || "Could not archive account",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      currencyCodesId: 0,
      openingBalance: 0,
      active: true
    });
  };

  const openEditModal = (account: AccountItemDto) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      currencyCodesId: currencyCodes.find(cc => cc.code === account.currencyCode)?.id || 0,
      openingBalance: account.openingBalance,
      active: true
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (account: AccountItemDto) => {
    setDeletingAccount(account);
    setIsDeleteModalOpen(true);
  };

  const getCurrentBalance = (accountId: number) => {
    const balance = accountBalances.find(b => b.id === accountId);
    return balance?.currentBalance || 0;
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', 'Rs.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Account Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading accounts...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Account Management</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Opening Balance</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(account => {
                const currentBalance = getCurrentBalance(account.id);
                return (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.currencyCode}</TableCell>
                    <TableCell>{formatCurrency(account.openingBalance, account.currencyCode)}</TableCell>
                    <TableCell className={currentBalance >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(currentBalance, account.currencyCode)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditModal(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => openDeleteModal(account)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Account Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Create a new account to track your income and expenses.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Account Name</Label>
              <Input
                id="add-name"
                placeholder="e.g. Main Bank Account"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-currency">Currency</Label>
              <Select
                value={formData.currencyCodesId.toString()}
                onValueChange={(value) => setFormData({ ...formData, currencyCodesId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyCodes.map(currency => (
                    <SelectItem key={currency.id} value={currency.id.toString()}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-balance">Opening Balance</Label>
              <Input
                id="add-balance"
                type="number"
                placeholder="0.00"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAccount}
              disabled={!formData.name || formData.currencyCodesId === 0}
            >
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update your account information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Account Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Main Bank Account"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-currency">Currency</Label>
              <Select
                value={formData.currencyCodesId.toString()}
                onValueChange={(value) => setFormData({ ...formData, currencyCodesId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyCodes.map(currency => (
                    <SelectItem key={currency.id} value={currency.id.toString()}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-balance">Opening Balance</Label>
              <Input
                id="edit-balance"
                type="number"
                placeholder="0.00"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditAccount}
              disabled={!formData.name || formData.currencyCodesId === 0}
            >
              Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{deletingAccount?.name}"? This will make it inactive and remove it from active account lists. This action can be undone by editing the account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleDeleteAccount}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

