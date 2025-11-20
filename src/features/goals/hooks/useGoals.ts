import { useState, useCallback, useEffect } from 'react';
import { goalsApi, Goal, GoalContribution, CreateGoalRequest, CreateGoalContributionRequest } from '@/lib/goals';
import { useToast } from '@/hooks/use-toast';

export function useGoals() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await goalsApi.getAll();
      setGoals(data);
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to load goals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createGoal = useCallback(async (data: CreateGoalRequest) => {
    try {
      const created = await goalsApi.create(data);
      setGoals(prev => [...prev, created]);
      toast({
        title: "Success",
        description: "Goal created successfully"
      });
      return created;
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateGoal = useCallback(async (id: number, data: Partial<CreateGoalRequest & { status: string }>) => {
    try {
      const updated = await goalsApi.update(id, data);
      setGoals(prev => prev.map(goal => goal.id === id ? updated : goal));
      toast({
        title: "Success",
        description: "Goal updated successfully"
      });
      return updated;
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const deleteGoal = useCallback(async (id: number) => {
    try {
      await goalsApi.delete(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast({
        title: "Success",
        description: "Goal deleted successfully"
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const getGoalContributions = useCallback(async (goalId: number): Promise<GoalContribution[]> => {
    try {
      return await goalsApi.getContributions(goalId);
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to load contributions",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const addContribution = useCallback(async (goalId: number, data: CreateGoalContributionRequest) => {
    try {
      const contribution = await goalsApi.addContribution(goalId, data);
      // Refresh goals to get updated totalSaved and progress
      await loadGoals();
      toast({
        title: "Success",
        description: "Contribution added successfully"
      });
      return contribution;
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to add contribution",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast, loadGoals]);

  const deleteContribution = useCallback(async (goalId: number, contributionId: number) => {
    try {
      await goalsApi.deleteContribution(goalId, contributionId);
      // Refresh goals to get updated totalSaved and progress
      await loadGoals();
      toast({
        title: "Success",
        description: "Contribution deleted successfully"
      });
    } catch (err: unknown) {
      const error = err as Error;
      // Check for specific error message about deleting another user's contribution
      if (error.message && error.message.includes("Cannot delete another user's contribution")) {
        toast({
          title: "🔔 Permission Denied",
          description: "You cannot delete other user's contribution",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to delete contribution",
          variant: "destructive"
        });
      }
      throw err;
    }
  }, [toast, loadGoals]);

  const getTotalSaved = useCallback(async (goalId: number): Promise<number> => {
    try {
      return await goalsApi.getTotalSaved(goalId);
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to get total saved",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return {
    goals,
    loading,
    loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalContributions,
    addContribution,
    deleteContribution,
    getTotalSaved
  };
}