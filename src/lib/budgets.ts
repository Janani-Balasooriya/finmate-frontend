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
  async get(familyId?: string): Promise<BudgetsResponseDto> {
    const endpoint = familyId ? '/budgets/family' : '/budgets';
    return httpClient.get(endpoint);
  },

  async create(payload: CreateOrUpdateBudgetPayload, familyId?: string): Promise<BudgetItemDto> {
    const endpoint = familyId ? `/families/${familyId}/budgets` : '/budgets';
    return httpClient.post(endpoint, payload);
  },

  async update(id: number, payload: CreateOrUpdateBudgetPayload, familyId?: string): Promise<BudgetItemDto> {
    const endpoint = familyId ? `/families/${familyId}/budgets/${id}` : `/budgets/${id}`;
    return httpClient.put(endpoint, payload);
  },

  async remove(id: number, familyId?: string): Promise<void> {
    const endpoint = familyId ? `/families/${familyId}/budgets/${id}` : `/budgets/${id}`;
    return httpClient.delete(endpoint);
  },
};


