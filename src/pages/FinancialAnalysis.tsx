
import React, { useState, useEffect } from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import ReportSummary from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart, 
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const FinancialAnalysis = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
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

  // Process transactions data for charts
  const processTransactionsForMonthlyChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => ({
      name: month,
      income: 0,
      expense: 0
    }));
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      
      if (transaction.type === 'income' || transaction.type === 'sale') {
        monthlyData[monthIndex].income += transaction.amount;
      } else if (transaction.type === 'expense' || transaction.type === 'purchase') {
        monthlyData[monthIndex].expense += transaction.amount;
      }
    });
    
    return monthlyData;
  };
  
  const processCashFlowData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const cashFlowData = months.map(month => ({
      name: month,
      value: 0
    }));
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      
      if (transaction.type === 'income' || transaction.type === 'sale') {
        cashFlowData[monthIndex].value += transaction.amount;
      } else if (transaction.type === 'expense' || transaction.type === 'purchase') {
        cashFlowData[monthIndex].value -= transaction.amount;
      }
    });
    
    return cashFlowData;
  };
  
  const processExpenseBreakdown = () => {
    const expenseCategories: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense' || t.type === 'purchase')
      .forEach(transaction => {
        if (!expenseCategories[transaction.category]) {
          expenseCategories[transaction.category] = 0;
        }
        expenseCategories[transaction.category] += transaction.amount;
      });
    
    return Object.entries(expenseCategories).map(([name, value]) => ({
      name,
      value
    }));
  };

  const monthlyData = processTransactionsForMonthlyChart();
  const cashFlowData = processCashFlowData();
  const expenseBreakdown = processExpenseBreakdown();

  // Calculate financial ratios
  const totalAssets = 30500; // These would ideally come from the actual balance sheet
  const totalLiabilities = 10000;
  const totalEquity = 20500;
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense' || t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
  const grossProfit = totalIncome;
  const netProfit = totalIncome - totalExpense;
  
  const currentRatio = (totalAssets / totalLiabilities).toFixed(2);
  const debtToEquity = (totalLiabilities / totalEquity).toFixed(2);
  const grossMargin = totalIncome > 0 ? ((grossProfit / totalIncome) * 100).toFixed(0) + '%' : '0%';
  const netProfitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(0) + '%' : '0%';
  const returnOnAssets = totalAssets > 0 ? ((netProfit / totalAssets) * 100).toFixed(0) + '%' : '0%';
  const returnOnEquity = totalEquity > 0 ? ((netProfit / totalEquity) * 100).toFixed(0) + '%' : '0%';

  // Financial ratios data
  const ratios = [
    { name: 'Current Ratio', value: currentRatio },
    { name: 'Debt to Equity', value: debtToEquity },
    { name: 'Gross Margin', value: grossMargin },
    { name: 'Net Profit Margin', value: netProfitMargin },
    { name: 'Return on Assets', value: returnOnAssets },
    { name: 'Return on Equity', value: returnOnEquity },
  ];

  return (
    <SidebarInset>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Financial Analysis</h1>
            
            {loading ? (
              <div className="glass-panel p-6 text-center">
                <p>Loading financial data...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Income vs. Expense</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="income" fill="#10b981" name="Income" />
                          <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cashFlowData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            name="Cash Flow"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {expenseBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Ratios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Ratio</th>
                              <th className="text-right py-2">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ratios.map((ratio, index) => (
                              <tr key={index} className="border-b border-border/20">
                                <td className="py-2">{ratio.name}</td>
                                <td className="text-right font-medium">{ratio.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Health Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Liquidity Analysis</h3>
                        <p>Current liquidity indicators show that the business maintains a healthy cash position with a current ratio of {currentRatio}, above the recommended minimum of 2.0.</p>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Profitability Assessment</h3>
                        <p>The business is maintaining a gross margin of {grossMargin} and net profit margin of {netProfitMargin}. Return on equity at {returnOnEquity} indicates the efficiency of capital use.</p>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Growth Trajectory</h3>
                        <p>Analysis of monthly trends indicates {netProfit >= 0 ? 'positive' : 'negative'} growth with a net {netProfit >= 0 ? 'profit' : 'loss'} of ₹{Math.abs(netProfit).toFixed(2)}.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="w-full md:w-1/4">
            <ReportSummary transactions={transactions} title="Financial Analysis" />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default FinancialAnalysis;
