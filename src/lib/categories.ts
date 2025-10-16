import { httpClient } from './http';
import { BudgetsResponseDto } from './budgets';

export interface ExpenseCategoryDto {
  id: number;
  name: string;
  icon: string;
  color: string;
  budgetAmount: number;
}

export interface CategoryItemDto {
  id: number;
  name: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon: string;
  color: string;
  budgetAmount: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  icon?: string;
  color?: string;
  budgetAmount?: number;
}

export interface CreateCategoryItemPayload {
  name: string;
}

export interface UpdateCategoryItemPayload {
  name: string;
}

export const categoriesApi = {
  async getCategories(): Promise<ExpenseCategoryDto[]> {
    const response: BudgetsResponseDto = await httpClient.get('/budgets/family');
    // Map BudgetItem to ExpenseCategoryDto
    return response.items.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      color: item.color,
      budgetAmount: item.budgetAmount
    }));
  },

  async createCategory(payload: CreateCategoryPayload): Promise<ExpenseCategoryDto> {
    return httpClient.post('/categories', payload);
  },

  async updateCategory(id: number, payload: UpdateCategoryPayload): Promise<ExpenseCategoryDto> {
    return httpClient.put(`/categories/${id}`, payload);
  },

  async deleteCategory(id: number): Promise<void> {
    return httpClient.delete(`/categories/${id}`);
  },

  async getCategoryItems(categoryId: number): Promise<CategoryItemDto[]> {
    return httpClient.get(`/categories/${categoryId}/items`);
  },

  async createCategoryItem(categoryId: number, payload: CreateCategoryItemPayload): Promise<CategoryItemDto> {
    return httpClient.post(`/categories/${categoryId}/items`, payload);
  },

  async updateCategoryItem(categoryId: number, itemId: number, payload: UpdateCategoryItemPayload): Promise<CategoryItemDto> {
    return httpClient.put(`/categories/${categoryId}/items/${itemId}`, payload);
  },

  async deleteCategoryItem(categoryId: number, itemId: number): Promise<void> {
    return httpClient.delete(`/categories/${categoryId}/items/${itemId}`);
  },
};