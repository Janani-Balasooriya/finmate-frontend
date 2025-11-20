import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { useGoals } from "@/features/goals/hooks/useGoals";
import { Goal, GoalContribution } from "@/lib/goals";
import { accountsApi } from "@/lib/accounts";
import { AccountItemDto } from "@/lib/accounts";
import { useCurrency } from "@/lib/currency";
interface GoalParticipant {
  name: string;
  avatar?: string;
  initials: string;
}
const progressColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-orange-500'];
const SharedGoals = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalContributions, setGoalContributions] = useState<GoalContribution[]>([]);
  const [accounts, setAccounts] = useState<AccountItemDto[]>([]);
  const [createGoalForm, setCreateGoalForm] = useState({
    name: '',
    targetAmount: '',
    deadline: ''
  });
  const [addContributionForm, setAddContributionForm] = useState({
    amount: '',
    accountId: ''
  });
  const [isAddContributionDialogOpen, setIsAddContributionDialogOpen] = useState(false);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<Goal | null>(null);

  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const { goals, loading, createGoal, deleteGoal, getGoalContributions, addContribution, deleteContribution, getTotalSaved } = useGoals();

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accountsData = await accountsApi.getActive();
        setAccounts(accountsData);
      } catch (error) {
        console.error('Failed to load accounts:', error);
      }
    };
    loadAccounts();
  }, []);

  const handleCreateGoal = async () => {
    if (!createGoalForm.name || !createGoalForm.targetAmount || !createGoalForm.deadline) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createGoal({
        name: createGoalForm.name,
        targetAmount: parseFloat(createGoalForm.targetAmount),
        deadline: createGoalForm.deadline
      });

      setCreateGoalForm({ name: '', targetAmount: '', deadline: '' });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleAddContribution = async (goalId: number) => {
    if (!addContributionForm.amount || !addContributionForm.accountId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await addContribution(goalId, {
        amount: parseFloat(addContributionForm.amount),
        accountId: parseInt(addContributionForm.accountId)
      });

      setAddContributionForm({ amount: '', accountId: '' });
      setIsAddContributionDialogOpen(false);
      // Refresh contributions and update selected goal if viewing details
      if (selectedGoal && selectedGoal.id === goalId) {
        await loadGoalDetails(goalId);
        // Update selectedGoal with new totals from the refreshed goals list
        const updatedGoal = goals.find(g => g.id === goalId);
        if (updatedGoal) {
          setSelectedGoal(updatedGoal);
        }
      }
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const loadGoalDetails = async (goalId: number) => {
    try {
      const contributions = await getGoalContributions(goalId);
      setGoalContributions(contributions);
    } catch (error) {
      console.error('Failed to load goal contributions:', error);
    }
  };

  const handleViewGoalDetails = async (goal: Goal) => {
    setSelectedGoal(goal);
    await loadGoalDetails(goal.id);
  };

  const handleDeleteGoal = async (goalId: number, goalName: string) => {
    try {
      await deleteGoal(goalId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteContribution = async (goalId: number, contributionId: number) => {
    try {
      await deleteContribution(goalId, contributionId);
      // Refresh contributions and update selected goal after deletion
      if (selectedGoal && selectedGoal.id === goalId) {
        await loadGoalDetails(goalId);
        // Update selectedGoal with new totals from the refreshed goals list
        const updatedGoal = goals.find(g => g.id === goalId);
        if (updatedGoal) {
          setSelectedGoal(updatedGoal);
        }
      }
    } catch (error) {
      // Error is handled in the hook
    }
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
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">{goals.length}</div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {formatCurrency(goals.reduce((sum, goal) => sum + goal.targetAmount, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">Target Amount</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(goals.reduce((sum, goal) => sum + goal.totalSaved, 0))}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                </div>
              </div>
              
              <div className="w-full">
                {/* Custom animated progress bar */}
                <div className="relative h-3 md:h-3.5 w-full overflow-hidden rounded-full bg-muted mb-2">
                  <div className="absolute left-0 top-0 h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out" style={{
                  width: `${goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0}%`
                }} aria-valuenow={goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0} aria-valuemax={100} role="progressbar">
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full"></div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  You're {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0}% toward your collective goals.
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
                <DialogDescription>
                  Create a new shared goal that family members can contribute to collectively.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Vacation in Bali"
                    value={createGoalForm.name}
                    onChange={(e) => setCreateGoalForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-amount">Target Amount (Rs.)</Label>
                  <Input
                    id="target-amount"
                    placeholder="Enter target amount"
                    type="number"
                    value={createGoalForm.targetAmount}
                    onChange={(e) => setCreateGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={createGoalForm.deadline}
                    onChange={(e) => setCreateGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={handleCreateGoal}
                  >
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
              const category = detectGoalCategory(goal.name);
              const accentColors = getGoalAccent(category);
              return <div key={goal.id} className={`rounded-xl border border-border/70 bg-card shadow-sm hover:shadow-md transition-shadow p-6 space-y-4 relative before:absolute before:inset-x-0 before:-top-px before:h-1 before:rounded-t-xl before:${accentColors.bar}`}>
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{goal.name}</h3>
                        <Badge variant="secondary" className={`text-xs ${accentColors.badge}`}>
                          {category === goal.name ? 'Goal' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Target: {formatCurrency(goal.targetAmount)}</span>
                          <span>Saved: {formatCurrency(goal.totalSaved)}</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${accentColors.bar}`} style={{
                        width: `${goal.progress}%`
                      }} aria-valuenow={goal.progress} aria-valuemax={100} role="progressbar" />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{goal.progress}% complete</span>
                          <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>



                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1" onClick={() => {
                        setSelectedGoalForContribution(goal);
                        setIsAddContributionDialogOpen(true);
                      }}>
                        + Add Contribution
                      </Button>

                      {/* View Details Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="flex-1 hover:bg-accent hover:text-accent-foreground" onClick={() => handleViewGoalDetails(goal)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{selectedGoal?.name || goal.name} - Details</DialogTitle>
                            <DialogDescription>
                              View detailed information about this shared goal including progress, contributions, and participants.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="font-medium text-sm">Target Amount:</span>
                                <span className="text-sm">{formatCurrency(selectedGoal?.targetAmount || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-sm">Amount Saved:</span>
                                <span className="text-emerald-600 text-sm">{formatCurrency(selectedGoal?.totalSaved || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-sm">Remaining:</span>
                                <span className="text-sm">{formatCurrency((selectedGoal ? selectedGoal.targetAmount - selectedGoal.totalSaved : 0))}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-sm">Deadline:</span>
                                <span className="text-sm">{selectedGoal?.deadline}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-sm">Progress:</span>
                                <span className="text-sm">{selectedGoal?.progress}%</span>
                              </div>
                            </div>

                            <div>
                              <Progress value={selectedGoal?.progress || 0} className="h-3 mb-2" />
                            </div>

                             <div>
                               {/* <h4 className="font-medium mb-2">Participants:</h4> */}
                               <div className="flex gap-2">
                                 {/* Placeholder for participants - will be implemented later */}
                                 {/* <div className="flex items-center gap-2">
                                   <Avatar className="h-6 w-6">
                                     <AvatarFallback className="text-xs bg-emerald-500 text-white">
                                       U
                                     </AvatarFallback>
                                   </Avatar>
                                   <span className="text-sm">You</span>
                                 </div> */}
                               </div>
                             </div>

                              <div>
                                <h4 className="font-medium mb-3 text-base">Contribution History:</h4>
                                <div className="max-h-48 overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="text-xs">Amount</TableHead>
                                        <TableHead className="text-xs">Date</TableHead>
                                        <TableHead className="text-xs">Account</TableHead>
                                        <TableHead className="text-xs">Participant</TableHead>
                                        <TableHead className="text-xs">Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {goalContributions.map(contribution => <TableRow key={contribution.id}>
                                          <TableCell className="text-xs font-medium text-emerald-600">{formatCurrency(contribution.amount)}</TableCell>
                                          <TableCell className="text-xs">{new Date(contribution.createdAt).toLocaleDateString()}</TableCell>
                                          <TableCell className="text-xs">{contribution.accountName}</TableCell>
                                          <TableCell className="text-xs">{contribution.userName}</TableCell>
                                          <TableCell className="text-xs">
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>Delete Contribution</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Are you sure you want to delete this contribution of {formatCurrency(contribution.amount)}? This will reduce the goal's saved amount and cannot be undone.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() => handleDeleteContribution(selectedGoal!.id, contribution.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                  >
                                                    Delete
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </TableCell>
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
                                      <AlertDialogTitle>Delete "{goal.name}"?</AlertDialogTitle>
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
                                        onClick={() => handleDeleteGoal(goal.id, goal.name)}
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

        {/* Add Contribution Dialog - Single Instance */}
        <Dialog open={isAddContributionDialogOpen} onOpenChange={(open) => {
          setIsAddContributionDialogOpen(open);
          if (!open) {
            setSelectedGoalForContribution(null);
            setAddContributionForm({ amount: '', accountId: '' });
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Contribution to {selectedGoalForContribution?.name}</DialogTitle>
              <DialogDescription>
                Add a contribution to this shared goal from one of your accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Contribution Amount</Label>
                <Input
                  id="amount"
                  placeholder="Enter amount (Rs.)"
                  type="number"
                  value={addContributionForm.amount}
                  onChange={(e) => setAddContributionForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account</Label>
                <Select
                  value={addContributionForm.accountId}
                  onValueChange={(value) => setAddContributionForm(prev => ({ ...prev, accountId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => selectedGoalForContribution && handleAddContribution(selectedGoalForContribution.id)}
                >
                  Add Contribution
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default SharedGoals;