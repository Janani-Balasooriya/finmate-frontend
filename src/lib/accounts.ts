import { httpClient } from './http';

export interface AccountItemDto {
  id: number;
  name: string;
  currencyCode: string;
  openingBalance: number;
}

export interface AccountBalanceDto {
  id: number;
  name: string;
  currencyCode: string;
  currentBalance: number;
}

export interface CreateAccountPayload {
  name: string;
  currencyCodesId: number;
  openingBalance: number;
}

export interface UpdateAccountPayload {
  name?: string;
  currencyCodesId?: number;
  openingBalance?: number;
  active?: boolean;
}

export interface CurrencyCodeDto {
  id: number;
  code: string;
}

export const accountsApi = {
  async getActive(): Promise<AccountItemDto[]> {
    return httpClient.get('/accounts?active=true');
  },

  async getBalances(): Promise<AccountBalanceDto[]> {
    return httpClient.get('/accounts/balances');
  },

  async create(payload: CreateAccountPayload): Promise<AccountItemDto> {
    return httpClient.post('/accounts', payload);
  },

  async update(id: number, payload: UpdateAccountPayload): Promise<AccountItemDto> {
    return httpClient.put(`/accounts/${id}`, payload);
  },

  async archive(id: number): Promise<void> {
    return httpClient.delete(`/accounts/${id}`);
  },

  async getCurrencyCodes(): Promise<CurrencyCodeDto[]> {
    return httpClient.get('/accounts/currency-codes');
  },
};

