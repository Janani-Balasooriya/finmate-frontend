import { httpClient } from './http';

export interface SubscriptionItem {
  id: number;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  accountId: number;
  accountName: string;
  categoryId: number;
  categoryName: string;
  categoryColor?: string;
  categoryItemId: number;
  categoryItemName: string;
  nextBilling: string;
  isActive: boolean;
}

export interface CreateSubscriptionRequest {
  serviceName: string;
  categoryId: number;
  accountId: number;
  amount: number;
  billingCycle: string;
  nextBilling: string;
}

export interface UpdateSubscriptionRequest {
  name: string;
  amount: number;
  billingCycle: string;
  accountId: number;
  categoryId: number;
  nextBilling: string;
  isActive?: boolean;
}

export const subscriptionsApi = {
  getAll: () => httpClient.get('/subscriptions'),
  create: (p: CreateSubscriptionRequest) => httpClient.post('/subscriptions', p),
  update: (id: number, p: UpdateSubscriptionRequest) => httpClient.put(`/subscriptions/${id}`, p),
  remove: (id: number) => httpClient.delete(`/subscriptions/${id}`)
};