import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Edit, Trash2, Plus } from "lucide-react";
const incomeData = [{
  id: 1,
  date: "Jan 15, 2025",
  source: "Salary",
  note: "Monthly Salary",
  amount: "Rs. 80,000",
  account: "Credit Card",
  type: "salary"
}, {
  id: 2,
  date: "Jan 14, 2025",
  source: "Freelance",
  note: "Web Design",
  amount: "Rs. 20,000",
  account: "Bank Account",
  type: "freelance"
}, {
  id: 3,
  date: "Jan 13, 2025",
  source: "Freelance",
  note: "App Design",
  amount: "Rs. 20,000",
  account: "Bank Account",
  type: "freelance"
}];
const Income = () => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [accountNote, setAccountNote] = useState("");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deletingIncomeId, setDeletingIncomeId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editAccount, setEditAccount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const handleEditClick = income => {
    setEditingIncome(income);
    setEditAmount(income.amount.replace("Rs. ", ""));
    setEditSource(income.source.toLowerCase());
    setEditAccount(income.account.toLowerCase().replace(" ", ""));
    setEditDate(new Date(income.date).toISOString().split('T')[0]);
    setEditNote(income.note);
    setIsEditDialogOpen(true);
  };
  return <div className="space-y-6">
          {/* Add Income Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Income Management</h2>
            <Button className="bg-success hover:bg-success/90 text-white" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </div>

          {/* Income History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-end ">
                
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  You've earned $1,580 this month
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input type="date" placeholder="mm/dd/yyyy" className="w-40" />
                
                <Input type="date" placeholder="mm/dd/yyyy" className="w-40" />
                
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeData.map(income => <TableRow key={income.id}>
                      <TableCell className="font-medium">{income.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={income.type === 'salary' ? 'bg-blue-100 text-blue-700' : 'bg-success/10 text-success'}>
                          {income.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{income.note}</TableCell>
                      <TableCell className="font-semibold">{income.amount}</TableCell>
                      <TableCell>{income.account}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10" onClick={() => handleEditClick(income)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => {
                    setDeletingIncomeId(income.id);
                    setIsDeleteDialogOpen(true);
                  }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
      </Card>

      {/* Add Income Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Income</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" placeholder="1500" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Salary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input id="date" type="date" placeholder="mm/dd/yyyy" value={date} onChange={e => setDate(e.target.value)} />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea id="note" placeholder="Add a note..." className="resize-none" rows={3} value={note} onChange={e => setNote(e.target.value)} />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-success hover:bg-success/90 text-white">
                Add Income
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Income Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <Input id="edit-amount" placeholder="1500" value={editAmount} onChange={e => setEditAmount(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-source">Source</Label>
                <Select value={editSource} onValueChange={setEditSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Salary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-account">Account</Label>
                <Select value={editAccount} onValueChange={setEditAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <div className="relative">
                  <Input id="edit-date" type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-note">Note (Optional)</Label>
              <Textarea id="edit-note" placeholder="Add a note..." className="resize-none" rows={3} value={editNote} onChange={e => setEditNote(e.target.value)} />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-success hover:bg-success/90 text-white">
                Update Income
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Income</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this income entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Income;