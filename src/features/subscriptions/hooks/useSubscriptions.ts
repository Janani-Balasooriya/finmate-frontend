import { useState, useCallback, useEffect } from 'react';
import { subscriptionsApi, SubscriptionItem } from '@/lib/subscriptions';
import { convertUSDToLKR } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';

export function useSubscriptions() {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionsApi.getAll();
      // Convert USD amounts to LKR
      const convertedData = data.map(subscription => ({
        ...subscription,
        amount: convertUSDToLKR(subscription.amount)
      }));
      setSubscriptions(convertedData);
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to load subscriptions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createSubscription = useCallback(async (payload: {
    serviceName: string;
    categoryId: number;
    accountId: number;
    amount: number;
    billingCycle: string;
    nextBilling: string;
  }) => {
    try {
      const created = await subscriptionsApi.create(payload);
      // Convert the returned amount to LKR for frontend state
      const convertedCreated = {
        ...created,
        amount: convertUSDToLKR(created.amount)
      };
      setSubscriptions(prev => [...prev, convertedCreated]);
      toast({
        title: "Success",
        description: "Subscription created successfully"
      });
      return convertedCreated;
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const updateSubscription = useCallback(async (id: number, payload: {
    name: string;
    amount: number;
    billingCycle: string;
    accountId: number;
    categoryId: number;
    nextBilling: string;
    isActive?: boolean;
  }) => {
    try {
      const updated = await subscriptionsApi.update(id, payload);
      // Convert the returned amount back to LKR for frontend state
      const convertedUpdated = {
        ...updated,
        amount: convertUSDToLKR(updated.amount)
      };
      setSubscriptions(prev => prev.map(sub => sub.id === id ? convertedUpdated : sub));
      toast({
        title: "Success",
        description: "Subscription updated successfully"
      });
      return convertedUpdated;
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  const deleteSubscription = useCallback(async (id: number) => {
    try {
      await subscriptionsApi.remove(id);
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      toast({
        title: "Success",
        description: "Subscription deleted successfully"
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscription",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Removed checkCategoryItemExists and createCategoryItem as they're now handled in the backend

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  return {
    subscriptions,
    loading,
    loadSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription
  };
}