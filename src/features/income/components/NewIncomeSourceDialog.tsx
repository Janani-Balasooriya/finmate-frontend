import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colorOptions } from "../constants/colorOptions";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (p: { name: string; color: string }) => Promise<{ id: number }>;
  onCreated?: (createdId: number) => void;
};

export function NewIncomeSourceDialog({ open, onOpenChange, onCreate, onCreated }: Props) {
  const [form, setForm] = useState({ name: "", color: "" });

  const submit = async () => {
    const created = await onCreate(form);
    onCreated?.(created.id);
    onOpenChange(false);
    setForm({ name: "", color: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Income Source</DialogTitle>
          <DialogDescription>Create a new Income Source.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="source-name">Income Source Name</Label>
            <Input
              id="source-name"
              placeholder="e.g. Salary, Freelance, Business"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Source Color</Label>
            <div className="grid grid-cols-9 gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={cn(
                    "h-8 w-8 rounded-full border",
                    c,
                    form.color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                  )}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="secondary" onClick={() => setForm({ name: "", color: "" })}>Clear</Button>
          <Button onClick={submit} disabled={!form.name || !form.color}>Create Income Source</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
