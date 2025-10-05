import { useState, useEffect, useCallback } from 'react';
import { incomesApi, IncomeTransactionItem, CreateIncomeTransactionRequest, UpdateIncomeTransactionRequest, IncomeTransactionSummary, PaginatedResponse } from '@/lib/incomes';
import { useToast } from '@/hooks/use-toast';
import { IncomeItem } from '../types';

export interface DateRange { 
  from?: Date; 
  to?: Date; 
}

export function useIncomeTransactions() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<IncomeTransactionItem[]>([]);
  const [summary, setSummary] = useState<IncomeTransactionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTransactionToIncomeItem = (transaction: IncomeTransactionItem): IncomeItem => {
    const date = new Date(transaction.transactionDate);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return {
      id: transaction.id,
      date: formattedDate,
      source: transaction.incomeSourceName,
      sourceId: transaction.incomeSourceId,
      note: '', // Backend doesn't have notes field
      amount: `Rs. ${transaction.amount.toLocaleString()}`,
      account: transaction.accountName,
      accountId: transaction.accountId,
      type: transaction.incomeSourceColor || 'default'
    };
  };

  const loadTransactions = useCallback(async (page: number = 0, size: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<IncomeTransactionItem> = await incomesApi.getAll(page, size);
      setTransactions(response.content);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      toast({
        title: "Error",
        description: err.message || "Failed to load income transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadSummary = useCallback(async () => {
    try {
      const summaryData = await incomesApi.getSummary();
      setSummary(summaryData);
    } catch (err: any) {
      console.error('Failed to load summary:', err);
    }
  }, []);

  const loadTransactionsByDateRange = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const transactions = await incomesApi.getByDateRange(startDate, endDate);
      setTransactions(transactions);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      toast({
        title: "Error",
        description: err.message || "Failed to load income transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createTransaction = useCallback(async (payload: CreateIncomeTransactionRequest) => {
    try {
      const newTransaction = await incomesApi.create(payload);
      setTransactions(prev => [newTransaction, ...prev]);
      await loadSummary(); // Refresh summary
      toast({
        title: "Success",
        description: "Income transaction created successfully"
      });
      return newTransaction;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create income transaction",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast, loadSummary]);

  const updateTransaction = useCallback(async (id: number, payload: UpdateIncomeTransactionRequest) => {
    try {
      const updatedTransaction = await incomesApi.update(id, payload);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      await loadSummary(); // Refresh summary
      toast({
        title: "Success",
        description: "Income transaction updated successfully"
      });
      return updatedTransaction;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update income transaction",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast, loadSummary]);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      await incomesApi.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      await loadSummary(); // Refresh summary
      toast({
        title: "Success",
        description: "Income transaction deleted successfully"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete income transaction",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast, loadSummary]);

  const getCurrentMonthIncome = useCallback(async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      return await incomesApi.getTotalAmountByMonth(year, month);
    } catch (err: any) {
      console.error('Failed to get current month income:', err);
      return 0;
    }
  }, []);

  // Convert transactions to IncomeItem format for compatibility
  const incomeItems: IncomeItem[] = transactions.map(formatTransactionToIncomeItem);

  return {
    transactions,
    incomeItems,
    summary,
    loading,
    error,
    loadTransactions,
    loadSummary,
    loadTransactionsByDateRange,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getCurrentMonthIncome
  };
}
