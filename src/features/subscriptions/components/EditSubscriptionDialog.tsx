import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriptionForm from "./SubscriptionForm";
import type { CurrencyCode, FormState, NamedEntity } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormState;
  setFormData: (patch: Partial<FormState>) => void;
  accounts: NamedEntity[];
  categories: NamedEntity[];
  currencyCodes: CurrencyCode[];
  onSubmit: () => void;
};

export default function EditSubscriptionDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  accounts,
  categories,
  currencyCodes,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>Update the details of your subscription.</DialogDescription>
        </DialogHeader>

        <SubscriptionForm
          formData={formData}
          setFormData={(p) => setFormData({ ...formData, ...p })}
          accounts={accounts}
          categories={categories}
          currencyCodes={currencyCodes}
          submitLabel="Update Subscription"
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
