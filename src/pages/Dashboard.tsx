
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Transaction } from '@/lib/types';
import TransactionCard from '@/components/TransactionCard';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, DollarSign, Calculator, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setTransactions(data as Transaction[]);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transaction data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [toast]);
  
  // Filter transactions by type
  const salesTransactions = transactions.filter(t => t.type === 'income' || t.type === 'sale');
  const purchaseTransactions = transactions.filter(t => t.type === 'purchase');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  // Calculate totals
  const totalIncome = salesTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = [...purchaseTransactions, ...expenseTransactions].reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  
  // Calculate sales metrics
  const salesCount = salesTransactions.length;
  const salesTotal = salesTransactions.reduce((sum, t) => sum + t.amount, 0);
  const salesAverage = salesCount > 0 ? salesTotal / salesCount : 0;
  
  // Calculate purchase metrics
  const purchaseCount = purchaseTransactions.length;
  const purchaseTotal = purchaseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const purchaseAverage = purchaseCount > 0 ? purchaseTotal / purchaseCount : 0;
  
  // Calculate expense metrics
  const expenseCount = expenseTransactions.length;
  const expenseTotal = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const expenseAverage = expenseCount > 0 ? expenseTotal / expenseCount : 0;
  
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
                  <span>Average Sale</span>
                  <span className="font-medium">₹{salesAverage.toFixed(2)}</span>
                </div>
                {salesTransactions.length > 0 && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(salesCount * 10, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Based on {salesCount} transactions</p>
                  </>
                )}
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
                  <span>Average Purchase</span>
                  <span className="font-medium">₹{purchaseAverage.toFixed(2)}</span>
                </div>
                {purchaseTransactions.length > 0 && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(purchaseCount * 10, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Based on {purchaseCount} transactions</p>
                  </>
                )}
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
                  <span>Average Expense</span>
                  <span className="font-medium">₹{expenseAverage.toFixed(2)}</span>
                </div>
                {expenseTransactions.length > 0 && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(expenseCount * 10, 100)}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Based on {expenseCount} transactions</p>
                  </>
                )}
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button asChild variant="link" size="sm">
              <Link to="/transactions" className="text-primary">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <Link key={transaction.id} to="/transactions" className="block hover:bg-accent/20 rounded-md transition-colors">
                    <TransactionCard transaction={transaction} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
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
