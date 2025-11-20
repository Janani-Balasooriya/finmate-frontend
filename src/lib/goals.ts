import { httpClient } from './http';

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  deadline: string;
  status: string;
  createdAt: string;
  totalSaved: number;
  progress: number;
}

export interface GoalContribution {
  id: number;
  amount: number;
  createdAt: string;
  userName: string;
  accountName: string;
}

export interface CreateGoalRequest {
  name: string;
  targetAmount: number;
  deadline: string;
}

export interface CreateGoalContributionRequest {
  amount: number;
  accountId: number;
}

export const goalsApi = {
  getAll: () => httpClient.get<Goal[]>('/goals'),
  getById: (id: number) => httpClient.get<Goal>(`/goals/${id}`),
  create: (data: CreateGoalRequest) => httpClient.post<Goal>('/goals', data),
  update: (id: number, data: Partial<CreateGoalRequest & { status: string }>) =>
    httpClient.put<Goal>(`/goals/${id}`, data),
  delete: (id: number) => httpClient.delete(`/goals/${id}`),
  getContributions: (goalId: number) =>
    httpClient.get<GoalContribution[]>(`/goals/${goalId}/contributions`),
  addContribution: (goalId: number, data: CreateGoalContributionRequest) =>
    httpClient.post<GoalContribution>(`/goals/${goalId}/contributions`, data),
  deleteContribution: (goalId: number, contributionId: number) =>
    httpClient.delete(`/goals/${goalId}/contributions/${contributionId}`),
  getTotalSaved: (goalId: number) =>
    httpClient.get<number>(`/goals/${goalId}/total-saved`),
};