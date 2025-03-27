
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Transaction } from '@/lib/types';
import TransactionCard from '@/components/TransactionCard';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, DollarSign, Calculator, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        description: 'Received payment from Smith Co.',
        amount: 2500,
        type: 'income',
        category: 'Client Payment',
        date: '2023-05-20',
        created_at: '2023-05-20T14:30:00Z',
      },
      {
        id: '2',
        description: 'Office rent for May',
        amount: 1800,
        type: 'expense',
        category: 'Rent',
        date: '2023-05-01',
        created_at: '2023-05-01T09:15:00Z',
      },
      {
        id: '3',
        description: 'New Dell laptops (3 units)',
        amount: 3600,
        type: 'purchase',
        category: 'Equipment',
        date: '2023-05-15',
        created_at: '2023-05-15T11:45:00Z',
      },
      {
        id: '4',
        description: 'Software license renewal',
        amount: 299,
        type: 'expense',
        category: 'Software',
        date: '2023-05-10',
        created_at: '2023-05-10T16:20:00Z',
      },
      {
        id: '5',
        description: 'Consulting services to Johnson Inc',
        amount: 1750,
        type: 'sale',
        category: 'Services',
        date: '2023-05-18',
        created_at: '2023-05-18T15:30:00Z',
      },
      {
        id: '6',
        description: 'Office supplies from Staples',
        amount: 127.50,
        type: 'purchase',
        category: 'Office Supplies',
        date: '2023-05-08',
        created_at: '2023-05-08T10:25:00Z',
      },
      {
        id: '7',
        description: 'Client dinner with potential investors',
        amount: 215.80,
        type: 'expense',
        category: 'Meals & Entertainment',
        date: '2023-05-12',
        created_at: '2023-05-12T20:45:00Z',
      },
      {
        id: '8',
        description: 'Monthly subscription revenue',
        amount: 3200,
        type: 'income',
        category: 'Subscription',
        date: '2023-05-01',
        created_at: '2023-05-01T00:05:00Z',
      },
    ];
    
    setTransactions(mockTransactions);
  }, []);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense' || t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netProfit = totalIncome - totalExpense;
  
  // Count transactions by type
  const salesCount = transactions.filter(t => t.type === 'income' || t.type === 'sale').length;
  const purchaseCount = transactions.filter(t => t.type === 'purchase').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  
  // Calculate totals by type
  const salesTotal = transactions
    .filter(t => t.type === 'income' || t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const purchaseTotal = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="min-h-screen pt-20">
      <Navbar />
      
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Overview of your business transactions and financial performance
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="animate-fade-in-up glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in-up glass-panel" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalExpense.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in-up glass-panel" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <Calculator className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ₹{netProfit.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Report Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Sales Report Card */}
          <Card className="animate-fade-in-up glass-panel hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Sales Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{salesTotal.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {salesCount} transactions
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Average</span>
                  <span className="font-medium">₹{(salesTotal / 30).toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">75% of monthly target</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/sales-report" className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Sales Report
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Purchase Report Card */}
          <Card className="animate-fade-in-up glass-panel hover:shadow-lg transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-amber-500" />
                Purchase Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ₹{purchaseTotal.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {purchaseCount} transactions
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Utilization</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">40% of budget remaining</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/purchase-report" className="flex items-center justify-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  View Purchase Report
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Expense Report Card */}
          <Card className="animate-fade-in-up glass-panel hover:shadow-lg transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-500" />
                Expense Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{expenseTotal.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {expenseCount} transactions
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Comparison</span>
                  <span className="font-medium">+8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">8% higher than last month</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/expense-report" className="flex items-center justify-center gap-2">
                  <Receipt className="h-4 w-4" />
                  View Expense Report
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="animate-fade-in-up glass-panel" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/transactions" className="flex items-center justify-center gap-2">
                <span>View All Transactions</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
