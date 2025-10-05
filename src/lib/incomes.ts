import { httpClient } from "./http";

export interface IncomeTransactionItem {
    id: number;
    amount: number;
    transactionDate: string;            // ISO yyyy-mm-dd
    accountId: number;
    accountName: string;
    incomeSourceId: number;
    incomeSourceName: string;
    incomeSourceColor: string;
}

export interface CreateIncomeTransactionRequest {
    amount: number;
    transactionDate: string;            // ISO yyyy-mm-dd
    accountId: number;
    incomeSourceId: number;
}

export interface UpdateIncomeTransactionRequest {
    amount?: number;
    transactionDate?: string;
    accountId?: number;
    incomeSourceId?: number;
}

export interface IncomeTransactionSummary {
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
    earliestDate: string;
    latestDate: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export const incomesApi = {
    async create(payload: CreateIncomeTransactionRequest): Promise<IncomeTransactionItem> {
        return httpClient.post("/income-transactions", payload);
    },
    
    async getAll(page: number = 0, size: number = 20): Promise<PaginatedResponse<IncomeTransactionItem>> {
        return httpClient.get(`/income-transactions?page=${page}&size=${size}`);
    },
    
    async getById(id: number): Promise<IncomeTransactionItem> {
        return httpClient.get(`/income-transactions/${id}`);
    },
    
    async update(id: number, payload: UpdateIncomeTransactionRequest): Promise<IncomeTransactionItem> {
        return httpClient.put(`/income-transactions/${id}`, payload);
    },
    
    async delete(id: number): Promise<void> {
        return httpClient.delete(`/income-transactions/${id}`);
    },
    
    async getByDateRange(startDate: string, endDate: string): Promise<IncomeTransactionItem[]> {
        return httpClient.get(`/income-transactions/date-range?startDate=${startDate}&endDate=${endDate}`);
    },
    
    async getByAccount(accountId: number): Promise<IncomeTransactionItem[]> {
        return httpClient.get(`/income-transactions/account/${accountId}`);
    },
    
    async getByIncomeSource(incomeSourceId: number): Promise<IncomeTransactionItem[]> {
        return httpClient.get(`/income-transactions/income-source/${incomeSourceId}`);
    },
    
    async getSummary(): Promise<IncomeTransactionSummary> {
        return httpClient.get("/income-transactions/summary");
    },
    
    async getSummaryByDateRange(startDate: string, endDate: string): Promise<IncomeTransactionSummary> {
        return httpClient.get(`/income-transactions/summary/date-range?startDate=${startDate}&endDate=${endDate}`);
    },
    
    async getMonthlyIncomeForYear(year: number): Promise<Record<string, number>> {
        return httpClient.get(`/income-transactions/summary/monthly/${year}`);
    },
    
    async getTotalAmountByMonth(year: number, month: number): Promise<number> {
        return httpClient.get(`/income-transactions/summary/month/${year}/${month}`);
    },
    
    async getTotalAmountByYear(year: number): Promise<number> {
        return httpClient.get(`/income-transactions/summary/year/${year}`);
    },
};