import { useState, useCallback } from 'react';
import { expenseCategoriesApi, CategorySummary, CategoryItemSummary } from '@/lib/expenses';
import { useToast } from '@/hooks/use-toast';

export function useExpenseCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [items, setItems] = useState<CategoryItemSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const categoriesData = await expenseCategoriesApi.getCategories();
      setCategories(categoriesData);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load expense categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadItems = useCallback(async (categoryId: number | null) => {
    if (categoryId === null) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const itemsData = await expenseCategoriesApi.getItems(categoryId);
      setItems(itemsData);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load category items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    categories,
    items,
    loading,
    loadCategories,
    loadItems
  };
}