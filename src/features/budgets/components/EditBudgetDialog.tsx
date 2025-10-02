import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { colorOptions } from "../constants/colorOptions";

type EditBudgetState = { name: string; amount: string; category: string; icon: string; color: string };

export function EditBudgetDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: EditBudgetState;
  onChange: (v: EditBudgetState) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>Update your budget category settings.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-budget-name">Category Name</Label>
            <Input
              id="edit-budget-name"
              placeholder="e.g. Healthcare, Education"
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-budget-amount">Target Amount</Label>
            <Input
              id="edit-budget-amount"
              type="number"
              placeholder="Enter amount"
              value={value.amount}
              onChange={(e) => onChange({ ...value, amount: e.target.value })}
            />
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
          <Button onClick={onSubmit} disabled={!value.name || !value.amount || Number(value.amount) <= 0}>
            Update Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
