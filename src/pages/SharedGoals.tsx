import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getGoalAccent, detectGoalCategory } from "@/lib/getGoalAccent";
interface Goal {
  id: string;
  title: string;
  target: string;
  saved: string;
  progress: number;
  deadline: string;
  participants: Array<{
    name: string;
    avatar?: string;
    initials: string;
  }>;
  contributions: Array<{
    id: string;
    amount: string;
    date: string;
    account: string;
    participant: string;
    note?: string;
  }>;
}
const progressColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-orange-500'];
const goals: Goal[] = [{
  id: '1',
  title: 'Vacation in Bali',
  target: '300,000',
  saved: '37,000',
  progress: 47,
  deadline: 'Dec 31, 2025',
  participants: [{
    name: 'User 1',
    initials: 'U1'
  }, {
    name: 'User 2',
    initials: 'U2'
  }],
  contributions: [{
    id: '1',
    amount: '15,000',
    date: '2024-12-15',
    account: 'Savings Account',
    participant: 'User 1',
    note: 'Initial contribution'
  }, {
    id: '2',
    amount: '12,000',
    date: '2024-12-10',
    account: 'Checking Account',
    participant: 'User 2'
  }, {
    id: '3',
    amount: '10,000',
    date: '2024-12-05',
    account: 'Savings Account',
    participant: 'User 1',
    note: 'Monthly saving'
  }]
}, {
  id: '2',
  title: 'Emergency Fund',
  target: '250,000',
  saved: '122,450',
  progress: 69,
  deadline: 'Jun 30, 2025',
  participants: [{
    name: 'User 1',
    initials: 'U1'
  }, {
    name: 'User 2',
    initials: 'U2'
  }],
  contributions: [{
    id: '4',
    amount: '50,000',
    date: '2024-12-12',
    account: 'Emergency Savings',
    participant: 'User 1'
  }, {
    id: '5',
    amount: '45,000',
    date: '2024-12-08',
    account: 'Savings Account',
    participant: 'User 2',
    note: 'Bonus money'
  }, {
    id: '6',
    amount: '27,450',
    date: '2024-12-01',
    account: 'Checking Account',
    participant: 'User 1'
  }]
}, {
  id: '3',
  title: 'New Car Down Payment',
  target: '8,000,000',
  saved: '3,200,000',
  progress: 30,
  deadline: 'Mar 15, 2026',
  participants: [{
    name: 'User 1',
    initials: 'U1'
  }, {
    name: 'User 2',
    initials: 'U2'
  }],
  contributions: [{
    id: '7',
    amount: '1,000,000',
    date: '2024-12-18',
    account: 'Investment Account',
    participant: 'User 1',
    note: 'Investment returns'
  }, {
    id: '8',
    amount: '1,200,000',
    date: '2024-12-10',
    account: 'Savings Account',
    participant: 'User 2'
  }, {
    id: '9',
    amount: '1,000,000',
    date: '2024-11-25',
    account: 'Checking Account',
    participant: 'User 1',
    note: 'Year-end bonus'
  }]
}];
const SharedGoals = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { toast } = useToast();

  const handleDeleteGoal = (goalId: string, goalTitle: string) => {
    // In a real app, this would call an API to delete the goal
    toast({
      title: "Goal Deleted",
      description: `"${goalTitle}" has been deleted. All contributions have been returned to respective accounts.`,
    });
  };

  const getProgressBarColor = (index: number) => {
    return progressColors[index % progressColors.length];
  };
  return <div className="mx-auto max-w-screen-xl px-6 lg:px-8">

      <div className="space-y-6 md:space-y-8">

        {/* Goals Overview */}
        <section aria-labelledby="goals-overview">
          <Card className="rounded-xl border bg-gradient-to-b from-background to-muted/50 dark:from-background dark:to-muted/30 shadow-lg ring-1 ring-primary/10 p-6 md:p-8 mb-6 md:mb-8 relative before:absolute before:inset-x-0 before:-top-px before:h-1 before:bg-gradient-to-r before:from-primary/40 before:via-primary/20 before:to-transparent before:rounded-t-xl">
            
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">3</div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight">Rs. 8,550,000</div>
                  <p className="text-sm text-muted-foreground">Target Amount</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">Rs. 3,359,450</div>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">61%</div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                </div>
              </div>
              
              <div className="w-full">
                {/* Custom animated progress bar */}
                <div className="relative h-3 md:h-3.5 w-full overflow-hidden rounded-full bg-muted mb-2">
                  <div className="absolute left-0 top-0 h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out" style={{
                  width: '61%'
                }} aria-valuenow={61} aria-valuemax={100} role="progressbar">
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full"></div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  You're 61% toward your collective goals.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Add Shared Goal Button */}
        <div className="mb-6 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="h-10">
                <Plus className="h-4 w-4 mr-2" />
                Add Shared Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Shared Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input id="goal-title" placeholder="e.g., Vacation in Bali" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-amount">Target Amount (Rs.)</Label>
                  <Input id="target-amount" placeholder="Enter target amount" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                    Create Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Current Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {goals.map(goal => {
              const category = detectGoalCategory(goal.title);
              const accentColors = getGoalAccent(category);
              return <div key={goal.id} className={`rounded-xl border border-border/70 bg-card shadow-sm hover:shadow-md transition-shadow p-6 space-y-4 relative before:absolute before:inset-x-0 before:-top-px before:h-1 before:rounded-t-xl before:${accentColors.bar}`}>
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        <Badge variant="secondary" className={`text-xs ${accentColors.badge}`}>
                          {category === goal.title ? 'Goal' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Target: Rs. {goal.target}</span>
                          <span>Saved: Rs. {goal.saved}</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${accentColors.bar}`} style={{
                        width: `${goal.progress}%`
                      }} aria-valuenow={goal.progress} aria-valuemax={100} role="progressbar" />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{goal.progress}% complete</span>
                          <span>{goal.deadline}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {goal.participants.map((participant, index) => <Avatar key={index} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback className="text-xs bg-emerald-500 text-white font-semibold">
                              {participant.initials}
                            </AvatarFallback>
                          </Avatar>)}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {/* Add Contribution Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            + Add Contribution
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Contribution to {goal.title}</DialogTitle>
                          </DialogHeader>
                           <div className="space-y-4 py-4">
                             <div className="space-y-2">
                               <Label htmlFor="amount">Contribution Amount</Label>
                               <Input id="amount" placeholder="Enter amount (Rs.)" type="number" />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor="account">Account</Label>
                               <Select>
                                 <SelectTrigger>
                                   <SelectValue placeholder="Select account" />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="savings">Savings Account</SelectItem>
                                   <SelectItem value="checking">Checking Account</SelectItem>
                                   <SelectItem value="investment">Investment Account</SelectItem>
                                   <SelectItem value="emergency">Emergency Savings</SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor="note">Note (optional)</Label>
                               <Textarea id="note" placeholder="Add a note for this contribution" />
                             </div>
                             <div className="flex gap-2 pt-4">
                               <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                                 Add Contribution
                               </Button>
                             </div>
                           </div>
                        </DialogContent>
                      </Dialog>

                      {/* View Details Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="flex-1 hover:bg-accent hover:text-accent-foreground" onClick={() => setSelectedGoal(goal)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{goal.title} - Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="font-medium">Target Amount:</span>
                                <span>Rs. {goal.target}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Amount Saved:</span>
                                <span className="text-emerald-600">Rs. {goal.saved}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Remaining:</span>
                                <span>Rs. {(parseInt(goal.target.replace(/,/g, '')) - parseInt(goal.saved.replace(/,/g, ''))).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Deadline:</span>
                                <span>{goal.deadline}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Progress:</span>
                                <span>{goal.progress}%</span>
                              </div>
                            </div>

                            <div>
                              <Progress value={goal.progress} className="h-3 mb-2" />
                            </div>

                             <div>
                               <h4 className="font-medium mb-2">Participants:</h4>
                               <div className="flex gap-2">
                                 {goal.participants.map((participant, index) => <div key={index} className="flex items-center gap-2">
                                     <Avatar className="h-6 w-6">
                                       <AvatarImage src={participant.avatar} alt={participant.name} />
                                       <AvatarFallback className="text-xs bg-emerald-500 text-white">
                                         {participant.initials}
                                       </AvatarFallback>
                                     </Avatar>
                                     <span className="text-sm">{participant.name}</span>
                                   </div>)}
                               </div>
                             </div>

                              <div>
                                <h4 className="font-medium mb-3">Contribution History:</h4>
                                <div className="max-h-48 overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="text-xs">Amount</TableHead>
                                        <TableHead className="text-xs">Date</TableHead>
                                        <TableHead className="text-xs">Account</TableHead>
                                        <TableHead className="text-xs">Participant</TableHead>
                                        <TableHead className="text-xs">Note</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {goal.contributions.map(contribution => <TableRow key={contribution.id}>
                                          <TableCell className="text-xs font-medium text-emerald-600">Rs. {contribution.amount}</TableCell>
                                          <TableCell className="text-xs">{new Date(contribution.date).toLocaleDateString()}</TableCell>
                                          <TableCell className="text-xs">{contribution.account}</TableCell>
                                          <TableCell className="text-xs">{contribution.participant}</TableCell>
                                          <TableCell className="text-xs">{contribution.note || '-'}</TableCell>
                                        </TableRow>)}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              {/* Delete Goal Section */}
                              <div className="mt-6 border-t border-border pt-4">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button tabIndex={-1} className="w-full h-10 text-sm font-medium rounded-lg border border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive focus:ring-destructive focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2">
                                      <Trash2 className="h-4 w-4 text-destructive/70" />
                                      Delete Goal
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete "{goal.title}"?</AlertDialogTitle>
                                      <AlertDialogDescription className="space-y-2">
                                        <p>Are you sure you want to delete this shared goal? This action cannot be undone.</p>
                                        <p className="font-medium text-orange-600 dark:text-orange-400">
                                          All contributions will be returned to respective contributed accounts, and no reversal will be possible.
                                        </p>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteGoal(goal.id, goal.title)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete Goal
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                           </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>;
            })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default SharedGoals;