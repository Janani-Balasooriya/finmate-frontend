import { httpClient } from './http';

export interface ExpenseTransactionItem {
  id: number;
  amount: number;
  transactionDate: string;
  accountId: number;
  accountName: string;
  categoryItemId: number;
  categoryName: string;
  categoryColor: string;
  subscriptionId?: number;
  subscriptionName?: string;
}

export interface ExpenseTransactionSummary {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  earliestDate?: string;
  latestDate?: string;
}

export interface CreateExpenseTransactionRequest {
  amount: number;
  transactionDate: string;
  accountId: number;
  categoryItemId: number;
  subscriptionId?: number;
}

export interface UpdateExpenseTransactionRequest {
  amount: number;
  transactionDate: string;
  accountId: number;
  categoryItemId: number;
  subscriptionId?: number;
}

export interface CategorySummary {
  id: number;
  name: string;
}

export interface CategoryItemSummary {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

export const expenseTransactionsApi = {
  async getAll(page: number = 0, size: number = 20): Promise<PaginatedResponse<ExpenseTransactionItem>> {
    return httpClient.get(`/expense-transactions?page=${page}&size=${size}`);
  },

  async getById(id: number): Promise<ExpenseTransactionItem> {
    return httpClient.get(`/expense-transactions/${id}`);
  },

  async getByDateRange(startDate: string, endDate: string): Promise<ExpenseTransactionItem[]> {
    return httpClient.get(`/expense-transactions/date-range?startDate=${startDate}&endDate=${endDate}`);
  },

  async getByAccount(accountId: number): Promise<ExpenseTransactionItem[]> {
    return httpClient.get(`/expense-transactions/account/${accountId}`);
  },

  async getByCategory(categoryId: number): Promise<ExpenseTransactionItem[]> {
    return httpClient.get(`/expense-transactions/category/${categoryId}`);
  },

  async create(payload: CreateExpenseTransactionRequest): Promise<ExpenseTransactionItem> {
    return httpClient.post('/expense-transactions', payload);
  },

  async update(id: number, payload: UpdateExpenseTransactionRequest): Promise<ExpenseTransactionItem> {
    return httpClient.put(`/expense-transactions/${id}`, payload);
  },

  async remove(id: number): Promise<void> {
    return httpClient.delete(`/expense-transactions/${id}`);
  },

  async getSummary(): Promise<ExpenseTransactionSummary> {
    return httpClient.get('/expense-transactions/summary');
  },

  async getSummaryByDateRange(startDate: string, endDate: string): Promise<ExpenseTransactionSummary> {
    return httpClient.get(`/expense-transactions/summary/date-range?startDate=${startDate}&endDate=${endDate}`);
  },
};

export const expenseCategoriesApi = {
  async getCategories(): Promise<CategorySummary[]> {
    return httpClient.get('/expense-categories');
  },

  async getItems(categoryId: number): Promise<CategoryItemSummary[]> {
    return httpClient.get(`/expense-categories/${categoryId}/items`);
  },
};