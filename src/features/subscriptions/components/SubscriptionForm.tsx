import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CurrencyCode, FormState, NamedEntity } from "../types";

type Props = {
  formData: FormState;
  setFormData: (patch: Partial<FormState>) => void;
  accounts: NamedEntity[];
  categories: NamedEntity[];
  currencyCodes: CurrencyCode[];
  submitLabel: string;
  onSubmit: () => void;
};

export default function SubscriptionForm({
  formData,
  setFormData,
  accounts,
  categories,
  currencyCodes,
  submitLabel,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Service Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
          placeholder="e.g., Netflix"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Monthly Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ amount: e.target.value })}
            placeholder="15.99"
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency *</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyCodes.map((c) => (
                <SelectItem key={c.id} value={c.code}>
                  {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="billingCycle">Billing Cycle *</Label>
          <Select
            value={formData.billingCycle}
            onValueChange={(value) => setFormData({ billingCycle: value as any })}
          >
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
          <Input
            id="nextBilling"
            type="date"
            value={formData.nextBilling}
            onChange={(e) => setFormData({ nextBilling: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="account">Account *</Label>
        <Select
          value={formData.account}
          onValueChange={(value) => setFormData({ account: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((a) => (
              <SelectItem key={a.id} value={a.name}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button onClick={onSubmit} className="w-full inline-flex justify-center items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition">
        {submitLabel}
      </button>
    </div>
  );
}
