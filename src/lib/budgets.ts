import { httpClient } from './http';

export interface BudgetItemDto {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentUsed: number;
}

export interface BudgetSummaryDto {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentUsed: number;
}

export interface BudgetsResponseDto {
  summary: BudgetSummaryDto;
  items: BudgetItemDto[];
}

export interface CreateOrUpdateBudgetPayload {
  name: string;
  icon?: string;
  color?: string;
  budgetAmount: number;
}

export const budgetsApi = {
  async get(): Promise<BudgetsResponseDto> {
    return httpClient.get('/budgets');
  },

  async create(payload: CreateOrUpdateBudgetPayload): Promise<BudgetItemDto> {
    return httpClient.post('/budgets', payload);
  },

  async update(id: number, payload: CreateOrUpdateBudgetPayload): Promise<BudgetItemDto> {
    return httpClient.put(`/budgets/${id}`, payload);
  },

  async remove(id: number): Promise<void> {
    return httpClient.delete(`/budgets/${id}`);
  },
};


