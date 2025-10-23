import { useState, useEffect, useCallback } from 'react';
import { expenseTransactionsApi, ExpenseTransactionItem, CreateExpenseTransactionRequest, UpdateExpenseTransactionRequest, ExpenseTransactionSummary, PaginatedResponse } from '@/lib/expenses';
import { ExpenseItem } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useExpenseTransactions() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<ExpenseItem[]>([]);
  const [summary, setSummary] = useState<ExpenseTransactionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTransactionToExpenseItem = (transaction: ExpenseTransactionItem): ExpenseItem => {
    const date = new Date(transaction.transactionDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return {
      id: transaction.id,
      date: formattedDate,
      dateIso: transaction.transactionDate.toString().split('T')[0],
      category: transaction.categoryName,
      categoryId: transaction.categoryId,
      categoryItem: transaction.categoryItemName,
      categoryItemId: transaction.categoryItemId,
      categoryColor: transaction.categoryColor,
      amountDisplay: `Rs. ${transaction.amount.toLocaleString()}`,
      amountValue: Number(transaction.amount ?? 0),
      account: transaction.accountName,
      accountId: transaction.accountId,
      subscriptionId: transaction.subscriptionId,
      subscriptionName: transaction.subscriptionName
    };
  };

  const loadTransactions = useCallback(async (page: number = 0, size: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<ExpenseTransactionItem> = await expenseTransactionsApi.getAll(page, size);
      const mappedTransactions = response.content.map(formatTransactionToExpenseItem);
      setTransactions(mappedTransactions);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      toast({
        title: "Error",
        description: err.message || "Failed to load expense transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadSummary = useCallback(async () => {
    try {
      const summaryData = await expenseTransactionsApi.getSummary();
      setSummary(summaryData);
    } catch (err: any) {
      console.error('Failed to load summary:', err);
    }
  }, []);

  const loadTransactionsByDateRange = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const transactions = await expenseTransactionsApi.getByDateRange(startDate, endDate);
      const mappedTransactions = transactions.map(formatTransactionToExpenseItem);
      setTransactions(mappedTransactions);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      toast({
        title: "Error",
        description: err.message || "Failed to load expense transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createTransaction = useCallback(async (payload: CreateExpenseTransactionRequest) => {
    try {
      console.log('Creating transaction with payload:', payload);
      const newTransaction = await expenseTransactionsApi.create(payload);
      const mappedTransaction = formatTransactionToExpenseItem(newTransaction);
      setTransactions(prev => [mappedTransaction, ...prev]);
      await loadSummary(); // Refresh summary
      toast({
        title: "Success",
        description: "Expense transaction created successfully"
      });
      return mappedTransaction;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create expense transaction",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast, loadSummary]);

  const updateTransaction = useCallback(async (id: number, payload: UpdateExpenseTransactionRequest) => {
    try {
      const updatedTransaction = await expenseTransactionsApi.update(id, payload);
      const mappedTransaction = formatTransactionToExpenseItem(updatedTransaction);
      setTransactions(prev => prev.map(t => t.id === id ? mappedTransaction : t));
      await loadSummary(); // Refresh summary
      toast({
        title: "Success",
        description: "Expense transaction updated successfully"
      });
      return mappedTransaction;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update expense transaction",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast, loadSummary]);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      await expenseTransactionsApi.remove(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      await loadSummary(); // Refresh summary
      toast({
        title: "Success",
        description: "Expense transaction deleted successfully"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete expense transaction",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast, loadSummary]);

  return {
    transactions,
    summary,
    loading,
    error,
    loadTransactions,
    loadSummary,
    loadTransactionsByDateRange,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
}