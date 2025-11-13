import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IconPicker from "@/components/IconPicker";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency";
import { colorOptions } from "../constants/colorOptions";

type AddBudgetState = { name: string; amount: string; category: string; icon: string; color: string };

export function AddBudgetDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: AddBudgetState;
  onChange: (v: AddBudgetState) => void;
  onSubmit: () => void;
}) {
  const { baseCurrencyCode } = useCurrency();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger lives outside in the page; keeping dialog clean */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Budget</DialogTitle>
          <DialogDescription>Create a new budget category to track your spending.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="budget-name">Category Name</Label>
            <Input
              id="budget-name"
              placeholder="e.g. Healthcare, Education"
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-amount">Target Amount ({baseCurrencyCode})</Label>
            <Input
              id="budget-amount"
              type="number"
              placeholder="Enter amount"
              value={value.amount}
              onChange={(e) => onChange({ ...value, amount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Category Icon</Label>
            <IconPicker value={value.icon} onChange={(icon) => onChange({ ...value, icon })} />
          </div>

          <div className="space-y-2">
            <Label>Category Color</Label>
            <div className="grid grid-cols-9 gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange({ ...value, color: c })}
                  className={cn(
                    "h-8 w-8 rounded-full border",
                    c,
                    value.color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                  )}
                  aria-label={c}
                />
              ))}
            </div>
            <div className="grid grid-cols-9 gap-2">
              {[
                "bg-zinc-500","bg-stone-500","bg-neutral-500","bg-slate-500","bg-cyan-500","bg-lime-500","bg-fuchsia-500","bg-rose-500","bg-amber-500",
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange({ ...value, color: c })}
                  className={cn(
                    "h-8 w-8 rounded-full border",
                    c,
                    value.color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                  )}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="secondary" onClick={() => onChange({ name: "", amount: "", category: "", icon: "Utensils", color: "bg-orange-500" })}>
            Clear
          </Button>
          <Button onClick={onSubmit} disabled={!value.name || !value.amount || Number(value.amount) <= 0}>
            Add Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
