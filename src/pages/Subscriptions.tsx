import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccounts } from "@/features/income/hooks/useAccounts";
import { useExpenseCategories } from "@/features/expenses/hooks/useExpenseCategories";
import { useSubscriptions } from "@/features/subscriptions/hooks/useSubscriptions";
interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  account: string;
  category: string;
  nextBilling: string;
  isActive: boolean;
}
const initialSubscriptions: Subscription[] = [{
  id: "1",
  name: "Netflix",
  amount: 15.99,
  currency: "USD",
  billingCycle: "monthly",
  account: "Main Account",
  category: "Entertainment",
  nextBilling: "2024-09-15",
  isActive: true
}, {
  id: "2",
  name: "Spotify Premium",
  amount: 9.99,
  currency: "USD",
  billingCycle: "monthly",
  account: "Main Account",
  category: "Entertainment",
  nextBilling: "2024-09-10",
  isActive: true
}, {
  id: "3",
  name: "Adobe Creative Cloud",
  amount: 52.99,
  currency: "USD",
  billingCycle: "monthly",
  account: "Main Account",
  category: "Software",
  nextBilling: "2024-09-20",
  isActive: true
}];
export default function Subscriptions() {
  const { accounts, currencyCodes } = useAccounts();
  const { categories, loadCategories } = useExpenseCategories();
  const { subscriptions, createSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    currency: "USD",
    billingCycle: "monthly",
    account: "",
    category: "",
    nextBilling: ""
  });
  const {
    toast
  } = useToast();
  const totalMonthly = subscriptions.filter(sub => sub.isActive).reduce((total, sub) => total + sub.amount, 0);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      currency: "USD",
      billingCycle: "monthly",
      account: "",
      category: "",
      nextBilling: ""
    });
  };
  const handleAdd = async () => {
    if (!formData.name || !formData.amount || !formData.billingCycle || !formData.account || !formData.category || !formData.nextBilling) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Find category ID
      const categoryId = categories.find(cat => cat.name === formData.category)?.id;
      if (!categoryId) {
        toast({
          title: "Error",
          description: "Selected category not found",
          variant: "destructive"
        });
        return;
      }

      // Find account ID
      const account = accounts.find(acc => acc.name === formData.account);
      if (!account) {
        toast({
          title: "Error",
          description: "Selected account not found",
          variant: "destructive"
        });
        return;
      }

      // Create subscription (backend handles category item creation and validation)
      await createSubscription({
        serviceName: formData.name,
        categoryId: categoryId,
        accountId: account.id,
        amount: parseFloat(formData.amount),
        billingCycle: formData.billingCycle.toUpperCase(),
        nextBilling: formData.nextBilling
      });

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };
  const handleEdit = async () => {
    if (!editingSubscription || !formData.name || !formData.amount || !formData.billingCycle || !formData.account || !formData.category || !formData.nextBilling) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Find account ID
      const account = accounts.find(acc => acc.name === formData.account);
      if (!account) {
        toast({
          title: "Error",
          description: "Selected account not found",
          variant: "destructive"
        });
        return;
      }

      // Find category ID
      const category = categories.find(cat => cat.name === formData.category);
      if (!category) {
        toast({
          title: "Error",
          description: "Selected category not found",
          variant: "destructive"
        });
        return;
      }

      await updateSubscription(editingSubscription.id, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        billingCycle: formData.billingCycle.toUpperCase(),
        accountId: account.id,
        categoryId: category.id,
        nextBilling: formData.nextBilling,
        isActive: editingSubscription.isActive
      });

      setEditingSubscription(null);
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteSubscription(id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };
  const openEditDialog = (subscription: { id: number; name: string; amount: number; currency: string; billingCycle: string; accountName: string; categoryName: string; nextBilling: string; isActive: boolean }) => {
    setEditingSubscription(subscription);
    setFormData({
      name: subscription.name,
      amount: subscription.amount.toString(),
      currency: subscription.currency,
      billingCycle: subscription.billingCycle,
      account: subscription.accountName,
      category: subscription.categoryName,
      nextBilling: subscription.nextBilling
    });
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  return <div className="mx-auto max-w-screen-xl px-6 lg:px-8 space-y-6">

      {/* Monthly Overview Card */}
      <div className="lg:sticky lg:top-20 z-10 mb-6 md:mb-8">
        <Card className="rounded-xl border bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-muted/30 shadow-lg ring-1 ring-primary/10 relative before:absolute before:inset-x-0 before:-top-px before:h-1 before:bg-gradient-to-r before:from-primary/40 before:via-primary/20 before:to-transparent before:rounded-t-xl">
          <CardContent className="p-6 md:p-8 flex items-start justify-between gap-6">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3 flex items-center gap-1.5 w-fit">
                <DollarSign className="h-3 w-3" />
                Monthly Overview
              </Badge>
              <p className="text-4xl font-extrabold tracking-tight text-foreground mb-1">
                ${totalMonthly.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
            </div>
            <div className="rounded-lg bg-background/60 backdrop-blur px-4 py-3 shadow-sm border">
              <p className="text-3xl font-bold text-center">
                {subscriptions.filter(sub => sub.isActive).length}
              </p>
              <p className="text-sm text-muted-foreground text-center">Active Subscriptions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Subscription Button */}
      <div className="flex justify-end items-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
              <DialogDescription>
                Add a new monthly subscription to track your recurring expenses.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} placeholder="e.g., Netflix" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Monthly Amount *</Label>
                  <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={e => setFormData({
                  ...formData,
                  amount: e.target.value
                })} placeholder="15.99" />
                </div>
                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={formData.currency} onValueChange={value => setFormData({
                  ...formData,
                  currency: value
                })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyCodes.map(code => <SelectItem key={code.id} value={code.code}>{code.code}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                <Label htmlFor="billingCycle">Billing Cycle *</Label>
                <Select value={formData.billingCycle} onValueChange={value => setFormData({
                ...formData,
                billingCycle: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nextBilling">Next Billing Date *</Label>
                <Input id="nextBilling" type="date" value={formData.nextBilling} onChange={e => setFormData({
                ...formData,
                nextBilling: e.target.value
              })} />
              </div>
              </div>
              
              <div>
                <Label htmlFor="account">Account *</Label>
                <Select value={formData.account} onValueChange={value => setFormData({
                ...formData,
                account: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={value => setFormData({
                ...formData,
                category: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAdd} className="w-full">
                Add Subscription
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4 md:space-y-5">
        {subscriptions.map(subscription => <Card key={subscription.id} className="rounded-xl border border-border/70 bg-card shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{subscription.name}</h3>
                    <Badge variant="secondary" className="text-muted-foreground">{subscription.categoryName}</Badge>
                    {subscription.isActive && <Badge variant="default">Active</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{subscription.currency} {subscription.amount.toFixed(2)}/{subscription.billingCycle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Next billing: {formatDate(subscription.nextBilling)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Account: {subscription.accountName}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground" onClick={() => openEditDialog(subscription)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{subscription.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(subscription.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSubscription} onOpenChange={() => setEditingSubscription(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the details of your subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Service Name *</Label>
              <Input id="edit-name" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} placeholder="e.g., Netflix" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-amount">Monthly Amount *</Label>
                <Input id="edit-amount" type="number" step="0.01" value={formData.amount} onChange={e => setFormData({
                ...formData,
                amount: e.target.value
              })} placeholder="15.99" />
              </div>
              <div>
                <Label htmlFor="edit-currency">Currency *</Label>
                <Select value={formData.currency} onValueChange={value => setFormData({
                ...formData,
                currency: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyCodes.map(code => <SelectItem key={code.id} value={code.code}>{code.code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-billingCycle">Billing Cycle *</Label>
              <Select value={formData.billingCycle} onValueChange={value => setFormData({
              ...formData,
              billingCycle: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-account">Account *</Label>
              <Select value={formData.account} onValueChange={value => setFormData({
              ...formData,
              account: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => <SelectItem key={account.id} value={account.name}>{account.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={value => setFormData({
              ...formData,
              category: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-nextBilling">Next Billing Date *</Label>
              <Input id="edit-nextBilling" type="date" value={formData.nextBilling} onChange={e => setFormData({
              ...formData,
              nextBilling: e.target.value
            })} />
            </div>
            <Button onClick={handleEdit} className="w-full">
              Update Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}