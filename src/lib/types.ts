
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  created_at: string;
  user_id?: string;
}

export type TransactionType = 'income' | 'expense' | 'purchase' | 'sale';

export interface AITransactionResponse {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}
