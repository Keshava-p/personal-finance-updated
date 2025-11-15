export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
  merchant?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget?: Budget;
}

export interface Budget {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  currency: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  currency: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info';
  message: string;
  date: string;
  read: boolean;
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
}