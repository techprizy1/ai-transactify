
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Transaction } from '@/lib/types';
import TransactionCard from '@/components/TransactionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, Calculator } from 'lucide-react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo, we'll create mock data
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
  
  // Calculate summary data
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense' || t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netProfit = totalIncome - totalExpense;
  
  // Prepare chart data
  const categoryData = transactions.reduce((acc, transaction) => {
    const existingCategory = acc.find(cat => cat.name === transaction.category);
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      acc.push({ name: transaction.category, value: transaction.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);
  
  const typeData = [
    { name: 'Income', value: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Expense', value: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Purchase', value: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Sale', value: transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0) },
  ].filter(item => item.value > 0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#48C9B0'];
  
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
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in-up glass-panel" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalExpense.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
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
              <p className="text-xs text-muted-foreground">+8.1% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="animate-fade-in-up glass-panel" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Transactions by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in-up glass-panel" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Transactions by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={typeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="value" fill="#8884d8">
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="animate-fade-in-up glass-panel" style={{ animationDelay: '0.5s' }}>
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
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
