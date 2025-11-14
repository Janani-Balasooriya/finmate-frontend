// Keep this file in the SAME path as your current route entry.
// It delegates UI to modular components under features/subscriptions/*
// and keeps your existing hooks (useAccounts, useExpenseCategories, useSubscriptions).

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// existing hooks you already have
import { useAccounts } from "@/features/income/hooks/useAccounts";
import { useExpenseCategories } from "@/features/expenses/hooks/useExpenseCategories";
import { useSubscriptions } from "@/features/subscriptions/hooks/useSubscriptions";

// modular UI
import MonthlyOverview from "@/features/subscriptions/components/MonthlyOverview";
import AddSubscriptionDialog from "@/features/subscriptions/components/AddSubscriptionDialog";
import EditSubscriptionDialog from "@/features/subscriptions/components/EditSubscriptionDialog";
import SubscriptionCard from "@/features/subscriptions/components/SubscriptionCard";

// types
import type { FormState, Subscription } from "@/features/subscriptions/types";

export default function Subscriptions() {
  const { toast } = useToast();

  // data hooks
  const { accounts, currencyCodes } = useAccounts();
  const { categories, loadCategories } = useExpenseCategories();
  const { subscriptions, createSubscription, updateSubscription, deleteSubscription } = useSubscriptions();

  // dialogs + form
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    amount: "",
    currency: "USD",
    billingCycle: "monthly",
    account: "",
    category: "",
    nextBilling: "",
  });

  // load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () =>
    setFormData({
      name: "",
      amount: "",
      currency: "USD",
      billingCycle: "monthly",
      account: "",
      category: "",
      nextBilling: "",
    });

  const requireAll = (fields: (keyof FormState)[]) =>
    fields.every((k) => String(formData[k] ?? "").trim().length > 0);

  // ADD
  const onAdd = async () => {
    if (!requireAll(["name", "amount", "billingCycle", "account", "category", "nextBilling"])) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      const category = categories.find((c: any) => c.name === formData.category);
      const account = accounts.find((a: any) => a.name === formData.account);

      if (!category) {
        toast({ title: "Error", description: "Selected category not found", variant: "destructive" });
        return;
      }
      if (!account) {
        toast({ title: "Error", description: "Selected account not found", variant: "destructive" });
        return;
      }

      await createSubscription({
        serviceName: formData.name,
        categoryId: category.id,
        accountId: account.id,
        amount: parseFloat(formData.amount),
        billingCycle: String(formData.billingCycle).toUpperCase(),
        nextBilling: formData.nextBilling,
        currencyCode: formData.currency,
      });

      setIsAddDialogOpen(false);
      resetForm();
    } catch {
      // handled inside hook
    }
  };

  // EDIT SAVE
  const onEditSave = async () => {
    if (
      !editingSubscription ||
      !requireAll(["name", "amount", "billingCycle", "account", "category", "nextBilling"])
    ) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      const account = accounts.find((a: any) => a.name === formData.account);
      const category = categories.find((c: any) => c.name === formData.category);

      if (!account) {
        toast({ title: "Error", description: "Selected account not found", variant: "destructive" });
        return;
      }
      if (!category) {
        toast({ title: "Error", description: "Selected category not found", variant: "destructive" });
        return;
      }

      await updateSubscription(editingSubscription.id, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        billingCycle: String(formData.billingCycle).toUpperCase(),
        accountId: account.id,
        categoryId: category.id,
        nextBilling: formData.nextBilling,
        isActive: editingSubscription.isActive,
      });

      setEditingSubscription(null);
      resetForm();
    } catch {
      // handled inside hook
    }
  };

  // DELETE
  const onDelete = async (id: number | string) => {
    try {
      await deleteSubscription(id as any);
    } catch {
      // handled inside hook
    }
  };

  // OPEN EDIT
  const handleOpenEdit = (sub: Subscription & { currency: string; amount: number }) => {
    setEditingSubscription(sub);
    setFormData({
      name: sub.name,
      amount: sub.amount.toString(),
      currency: sub.currency,
      billingCycle: sub.billingCycle,
      account: sub.accountName,
      category: sub.categoryName,
      nextBilling: sub.nextBilling,
    });
  };

  const subscriptionsSorted = useMemo(
    () => [...subscriptions].sort((a: any, b: any) => String(a.name).localeCompare(String(b.name))),
    [subscriptions]
  );

  return (
    <div className="mx-auto max-w-screen-xl px-6 lg:px-8 space-y-6">
      {/* Header Overview */}
      <MonthlyOverview subscriptions={subscriptions as any} />

      {/* Add Dialog */}
      <AddSubscriptionDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        formData={formData}
        setFormData={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
        accounts={accounts}
        categories={categories}
        currencyCodes={currencyCodes}
        onSubmit={onAdd}
      />

      {/* List */}
      <div className="space-y-4 md:space-y-5">
        {subscriptionsSorted.map((s: any) => (
          <SubscriptionCard key={s.id} subscription={s} onEdit={handleOpenEdit} onDelete={onDelete} />
        ))}
      </div>

      {/* Edit Dialog */}
      <EditSubscriptionDialog
        open={!!editingSubscription}
        onOpenChange={(open) => !open && setEditingSubscription(null)}
        formData={formData}
        setFormData={(patch) => setFormData((prev) => ({ ...prev, ...patch }))}
        accounts={accounts}
        categories={categories}
        currencyCodes={currencyCodes}
        onSubmit={onEditSave}
      />
    </div>
  );
}
