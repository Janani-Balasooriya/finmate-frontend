import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyCodeDto } from "@/lib/accounts";

type Props = {
   open: boolean;
   onOpenChange: (v: boolean) => void;
   currencyCodes: CurrencyCodeDto[];
   baseCurrencyCode: string;
   onCreate: (p: { name: string; currencyCodesId: number; openingBalance: number }) => Promise<{ id: number }>;
   onCreated?: (createdId: number) => void; // select newly created account
 };

export function NewAccountDialog({ open, onOpenChange, currencyCodes, baseCurrencyCode, onCreate, onCreated }: Props) {
   // Filter currencies to only show the family's base currency
   const availableCurrencies = currencyCodes.filter(currency => currency.code === baseCurrencyCode);

   // Set default currency to base currency
   const [form, setForm] = useState({ name: "", currencyCodesId: 0, openingBalance: 0 });

   // Initialize form with base currency when modal opens
   React.useEffect(() => {
     if (open && availableCurrencies.length > 0 && form.currencyCodesId === 0) {
       const baseCurrency = availableCurrencies[0];
       setForm(prev => ({ ...prev, currencyCodesId: baseCurrency.id }));
     }
   }, [open, availableCurrencies, form.currencyCodesId]);

  const submit = async () => {
    const created = await onCreate(form);
    onCreated?.(created.id);
    onOpenChange(false);
    setForm({ name: "", currencyCodesId: 0, openingBalance: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={form.currencyCodesId ? String(form.currencyCodesId) : ""}
              onValueChange={(v) => setForm({ ...form, currencyCodesId: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((c) => (
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
              value={form.openingBalance}
              onChange={(e) => setForm({ ...form, openingBalance: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!form.name || form.currencyCodesId === 0}>Create Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
