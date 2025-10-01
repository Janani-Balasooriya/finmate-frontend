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

export const incomeSourceApi = {
  async getActive(): Promise<IncomeSourceItemDto[]> {
    return httpClient.get('/income-sources?active=true');
  },

  async create(payload: CreateIncomeSourcePayload): Promise<IncomeSourceItemDto> {
    return httpClient.post('/income-sources', payload);
  },

};
