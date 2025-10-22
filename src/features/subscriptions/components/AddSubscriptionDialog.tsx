import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import SubscriptionForm from "./SubscriptionForm";
import type { CurrencyCode, FormState, NamedEntity } from "../types";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  formData: FormState;
  setFormData: (patch: Partial<FormState>) => void;
  accounts: NamedEntity[];
  categories: NamedEntity[];
  currencyCodes: CurrencyCode[];
  onSubmit: () => void;
};

export default function AddSubscriptionDialog({
  open,
  setOpen,
  formData,
  setFormData,
  accounts,
  categories,
  currencyCodes,
  onSubmit,
}: Props) {
  return (
    <div className="flex justify-end items-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Subscription
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subscription</DialogTitle>
            <DialogDescription>Add a new recurring subscription.</DialogDescription>
          </DialogHeader>

          <SubscriptionForm
            formData={formData}
            setFormData={(p) => setFormData({ ...formData, ...p })}
            accounts={accounts}
            categories={categories}
            currencyCodes={currencyCodes}
            submitLabel="Add Subscription"
            onSubmit={onSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
