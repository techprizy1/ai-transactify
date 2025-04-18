import { Transaction } from './types';

export interface FinancialData {
  // Assets
  totalAssets: number;
  cashInHand: number;
  bankAccount: number;
  accountsReceivable: number;
  equipment: number;
  
  // Liabilities and Equity
  totalLiabilities: number;
  accountsPayable: number;
  loans: number;
  totalEquity: number;
  ownersCapital: number;
  retainedEarnings: number;
  
  // Income Statement
  totalIncome: number;
  costOfGoodsSold: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  
  // Ratios
  currentRatio: string;
  debtToEquity: string;
  grossMargin: string;
  netProfitMargin: string;
  returnOnAssets: string;
  returnOnEquity: string;
  
  // Categories
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
}

export function calculateFinancialData(transactions: Transaction[]): FinancialData {
  // Filter transactions by type
  const incomeTransactions = transactions.filter(t => t.type === 'income' || t.type === 'sale');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const purchaseTransactions = transactions.filter(t => t.type === 'purchase' && t.category === 'inventory');
  
  // Group transactions by category
  const cashTransactions = transactions.filter(t => t.category === 'cash');
  const bankTransactions = transactions.filter(t => t.category === 'bank');
  const receivableTransactions = transactions.filter(t => t.category === 'accounts_receivable');
  const equipmentTransactions = transactions.filter(t => t.category === 'equipment' || t.category === 'asset');
  const payableTransactions = transactions.filter(t => t.category === 'accounts_payable');
  const loanTransactions = transactions.filter(t => t.category === 'loan');
  const capitalTransactions = transactions.filter(t => t.category === 'capital');

  // Calculate income statement values
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const costOfGoodsSold = purchaseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const grossProfit = totalIncome - costOfGoodsSold;
  const netProfit = grossProfit - totalExpenses;

  // Calculate asset values
  const cashInHand = cashTransactions.reduce((sum, t) => {
    if (t.type === 'income' || t.type === 'sale') return sum + t.amount;
    if (t.type === 'expense' || t.type === 'purchase') return sum - t.amount;
    return sum;
  }, 0);
  
  const bankAccount = bankTransactions.reduce((sum, t) => {
    if (t.type === 'income' || t.type === 'sale') return sum + t.amount;
    if (t.type === 'expense' || t.type === 'purchase') return sum - t.amount;
    return sum;
  }, 0);
  
  const accountsReceivable = receivableTransactions.reduce((sum, t) => {
    if (t.type === 'income' || t.type === 'sale') return sum + t.amount;
    if (t.type === 'expense' || t.type === 'purchase') return sum - t.amount;
    return sum;
  }, 0);
  
  const equipment = equipmentTransactions.reduce((sum, t) => {
    if (t.type === 'purchase') return sum + t.amount;
    if (t.type === 'sale') return sum - t.amount;
    return sum;
  }, 0);

  // Calculate liability values
  const accountsPayable = payableTransactions.reduce((sum, t) => {
    if (t.type === 'expense' || t.type === 'purchase') return sum + t.amount;
    if (t.type === 'income' || t.type === 'sale') return sum - t.amount;
    return sum;
  }, 0);
  
  const loans = loanTransactions.reduce((sum, t) => {
    if (t.type === 'income') return sum + t.amount; // Getting a loan increases liability
    if (t.type === 'expense') return sum - t.amount; // Paying off a loan decreases liability
    return sum;
  }, 0);
  
  // Calculate equity values
  const ownersCapital = capitalTransactions.reduce((sum, t) => {
    if (t.type === 'income') return sum + t.amount; // Capital injection
    if (t.type === 'expense') return sum - t.amount; // Capital withdrawal
    return sum;
  }, 0);
  
  const retainedEarnings = netProfit;

  // Calculate totals
  const totalAssets = cashInHand + bankAccount + accountsReceivable + equipment;
  const totalLiabilities = accountsPayable + loans;
  const totalEquity = ownersCapital + retainedEarnings;

  // Calculate current assets and current liabilities
  const currentAssets = cashInHand + bankAccount + accountsReceivable;
  const currentLiabilities = accountsPayable;

  // Calculate ratios
  const currentRatio = currentLiabilities > 0 ? (currentAssets / currentLiabilities).toFixed(2) : currentAssets > 0 ? '∞' : '0.00';
  const debtToEquity = totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : totalLiabilities > 0 ? '∞' : '0.00';
  const grossMargin = totalIncome > 0 ? ((grossProfit / totalIncome) * 100).toFixed(1) + '%' : '0.0%';
  const netProfitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) + '%' : '0.0%';
  const returnOnAssets = totalAssets > 0 ? ((netProfit / totalAssets) * 100).toFixed(1) + '%' : '0.0%';
  const returnOnEquity = totalEquity > 0 ? ((netProfit / totalEquity) * 100).toFixed(1) + '%' : '0.0%';

  // Group income/expenses by category
  const incomeByCategory = incomeTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const expensesByCategory = expenseTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Add Cost of Goods Sold to expenses
  if (costOfGoodsSold > 0) {
    expensesByCategory['Cost of Goods Sold'] = costOfGoodsSold;
  }

  return {
    totalAssets,
    cashInHand,
    bankAccount,
    accountsReceivable,
    equipment,
    totalLiabilities,
    accountsPayable,
    loans,
    totalEquity,
    ownersCapital,
    retainedEarnings,
    totalIncome,
    costOfGoodsSold,
    totalExpenses,
    grossProfit,
    netProfit,
    currentRatio,
    debtToEquity,
    grossMargin,
    netProfitMargin,
    returnOnAssets,
    returnOnEquity,
    incomeByCategory,
    expensesByCategory
  };
} 