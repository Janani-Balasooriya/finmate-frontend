import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AccountItemDto } from "@/lib/accounts";
import { IncomeSourceItemDto } from "@/lib/incomeSource";
import { IncomeItem } from "../types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row?: IncomeItem | null;
  accounts: AccountItemDto[];
  incomeSources: IncomeSourceItemDto[];
  onUpdate: (id: number, payload: any) => Promise<any>;
};

export function EditIncomeDialog({ open, onOpenChange, row, accounts, incomeSources, onUpdate }: Props) {
  const [amount, setAmount]   = useState("");
  const [source, setSource]   = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate]       = useState("");
  const [isDateOpen, setIsDateOpen] = useState(false);

  useEffect(() => {
    if (!row) return;
    setAmount(row.amountDisplay ? String(row.amountDisplay).replace("Rs. ", "") : "");
    setSource(String(row.sourceId));
    setAccount(String(row.accountId));
    setDate(row.dateIso);
  }, [row]);

  const submit = async () => {
    if (!row) return;
    const payload = {
      amount: parseFloat(amount.replace(/,/g, '')),
      transactionDate: date,
      accountId: parseInt(account),
      incomeSourceId: parseInt(source),
    };
    await onUpdate(row.id, payload);
    onOpenChange(false);
  };

  if (!row) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader><DialogTitle>Edit Income</DialogTitle></DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input id="edit-amount" placeholder="1500" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-source">Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger><SelectValue placeholder="Salary" /></SelectTrigger>
                <SelectContent>
                  {incomeSources.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-account">Account</Label>
              <Select value={account} onValueChange={setAccount}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name} ({a.currencyCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button id="edit-date" variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? new Date(date).toLocaleDateString() : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(selected) => {
                      if (selected) {
                        const year = selected.getFullYear();
                        const month = String(selected.getMonth() + 1).padStart(2, '0');
                        const day = String(selected.getDate()).padStart(2, '0');
                        setDate(`${year}-${month}-${day}`);
                      }
                    }}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-success hover:bg-success/90 text-white" onClick={submit}>Update Income</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
