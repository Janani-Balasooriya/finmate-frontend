export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";

export interface Subscription {
  id: number | string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  accountName: string;
  accountId?: string | number;
  categoryName: string;
  categoryId?: string | number;
  nextBilling: string; // ISO date
  isActive: boolean;
}

export interface CurrencyCode {
  id: string | number;
  code: string;
}

export interface NamedEntity {
  id: string | number;
  name: string;
}

export interface FormState {
  name: string;
  amount: string; // keep as string for controlled Input
  currency: string;
  billingCycle: BillingCycle | "";
  account: string;   // account name
  category: string;  // category name
  nextBilling: string;
}
