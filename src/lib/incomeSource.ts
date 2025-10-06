import { httpClient } from './http';

export interface IncomeSourceItemDto {
  id: number;
  name: string;
  color: string;
}

export interface CreateIncomeSourcePayload {
  name: string;
  color: string;
}

export interface UpdateIncomeSourcePayload {
  name?: string;
  color?: string;
  active?: boolean;
}

export const incomeSourceApi = {
  async getActive(): Promise<IncomeSourceItemDto[]> {
    return httpClient.get('/income-sources?active=true');
  },

  async create(payload: CreateIncomeSourcePayload): Promise<IncomeSourceItemDto> {
    return httpClient.post('/income-sources', payload);
  },

  async update(id: number, payload: UpdateIncomeSourcePayload): Promise<IncomeSourceItemDto> {
    return httpClient.put(`/income-sources/${id}`, payload);
  },

  async archive(id: number): Promise<void> {
    return httpClient.delete(`/income-sources/${id}`);
  },
};
