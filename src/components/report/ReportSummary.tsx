
import React from 'react';
import { Transaction } from '@/lib/types';
import { Check, AlertCircle } from 'lucide-react';

interface ReportSummaryProps {
  transactions: Transaction[];
  title: string;
}

const ReportSummary = ({ transactions, title }: ReportSummaryProps) => {
  // Calculate financial metrics
  const incomeTransactions = transactions.filter(t => t.type === 'income' || t.type === 'sale');
  const expenseTransactions = transactions.filter(t => t.type === 'expense' || t.type === 'purchase');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const isProfitable = netProfit >= 0;
  
  // Calculate month-over-month data (placeholder for now)
  const currentMonth = new Date().getMonth();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="glass-panel p-4 md:p-6 mb-6 border border-border/50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {title} Summary
        </span>
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="bg-muted/50 rounded-lg p-3 flex-1">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-lg font-medium text-emerald-600">₹{totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 flex-1">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-medium text-red-600">₹{totalExpenses.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Net Profit/Loss</p>
            <div className={`flex items-center gap-1 ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
              {isProfitable ? <Check size={16} /> : <AlertCircle size={16} />}
            </div>
          </div>
          <p className={`text-xl font-semibold ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{Math.abs(netProfit).toFixed(2)} {isProfitable ? '(Profit)' : '(Loss)'}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Transaction Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 p-2 rounded-md text-center">
              <p className="text-xs text-muted-foreground">Income Transactions</p>
              <p className="font-medium">{incomeTransactions.length}</p>
            </div>
            <div className="bg-muted/30 p-2 rounded-md text-center">
              <p className="text-xs text-muted-foreground">Expense Transactions</p>
              <p className="font-medium">{expenseTransactions.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            This summary is based on {transactions.length} transactions for {currentMonthName}.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportSummary;
