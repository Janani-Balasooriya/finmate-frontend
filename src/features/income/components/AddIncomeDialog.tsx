import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { AccountItemDto } from "@/lib/accounts";
import { IncomeSourceItemDto } from "@/lib/incomeSource";
import { CreateIncomeTransactionRequest } from "@/lib/incomes";
import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accounts: AccountItemDto[];
  incomeSources: IncomeSourceItemDto[];
  onOpenNewAccount: () => void;
  onOpenNewSource: () => void;
  onCreateTransaction: (payload: CreateIncomeTransactionRequest) => Promise<void>;
};

export function AddIncomeDialog({
  open,
  onOpenChange,
  accounts,
  incomeSources,
  onOpenNewAccount,
  onOpenNewSource,
  onCreateTransaction,
}: Props) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setAmount("");
    setSource("");
    setAccount("");
    setDate("");
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const submit = async () => {
    if (!amount || !source || !account || !date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateIncomeTransactionRequest = {
        amount: amountValue,
        transactionDate: date,
        accountId: parseInt(account),
        incomeSourceId: parseInt(source)
      };

      await onCreateTransaction(payload);
      handleClose(false);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input 
                id="amount" 
                type="number"
                step="0.01"
                placeholder="1500.00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <div className="flex gap-2">
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income source" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeSources.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="sm" onClick={onOpenNewSource}>+ New</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account">Account *</Label>
              <div className="flex gap-2">
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
                <Button type="button" variant="outline" size="sm" onClick={onOpenNewAccount}>+ New</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button id="date" variant="outline" className="w-full justify-start text-left font-normal">
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
                        const iso = new Date(selected).toISOString().split("T")[0];
                        setDate(iso);
                        setIsDateOpen(false);
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
            <Button variant="outline" onClick={() => handleClose(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              className="bg-success hover:bg-success/90 text-white" 
              onClick={submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Income"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
