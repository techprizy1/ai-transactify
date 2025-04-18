import React, { useState, useEffect } from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import ReportSummary from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { calculateFinancialData, FinancialData } from '@/lib/financialUtils';
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
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
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
        
        const transactionsData = data as Transaction[];
        setTransactions(transactionsData);
        setFinancialData(calculateFinancialData(transactionsData));
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
    if (!financialData) return [];
    
    return Object.entries(financialData.expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));
  };

  const monthlyData = processTransactionsForMonthlyChart();
  const cashFlowData = processCashFlowData();
  const expenseBreakdown = processExpenseBreakdown();

  // Financial ratios data
  const formatRatioValue = (value: string) => {
    // Check if value is infinity symbol
    if (value === '∞') return value;
    
    // Check if value contains percentage
    if (value.includes('%')) return value;
    
    // Try to parse as number for decimal formatting
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return numValue.toFixed(2);
    }
    
    return value;
  };

  const ratios = financialData ? [
    { name: 'Current Ratio', value: formatRatioValue(financialData.currentRatio) },
    { name: 'Debt to Equity', value: formatRatioValue(financialData.debtToEquity) },
    { name: 'Gross Margin', value: financialData.grossMargin },
    { name: 'Net Profit Margin', value: financialData.netProfitMargin },
    { name: 'Return on Assets', value: financialData.returnOnAssets },
    { name: 'Return on Equity', value: financialData.returnOnEquity },
  ] : [];

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
                              <th className="text-right py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ratios.map((ratio, index) => {
                              // Determine status for each ratio
                              let status = "neutral";
                              let statusColor = "text-yellow-500";
                              
                              if (ratio.name === "Current Ratio") {
                                if (ratio.value === "∞" || parseFloat(ratio.value) >= 2) {
                                  status = "good";
                                  statusColor = "text-green-500";
                                } else if (parseFloat(ratio.value) < 1) {
                                  status = "concern";
                                  statusColor = "text-red-500";
                                }
                              } else if (ratio.name === "Debt to Equity") {
                                if (parseFloat(ratio.value) <= 1) {
                                  status = "good";
                                  statusColor = "text-green-500";
                                } else if (parseFloat(ratio.value) > 2) {
                                  status = "concern";
                                  statusColor = "text-red-500";
                                }
                              } else if (ratio.name.includes("Margin") || ratio.name.includes("Return")) {
                                // Extract the numeric part by removing the % character
                                const percentValue = parseFloat(ratio.value.replace('%', ''));
                                if (percentValue >= 15) {
                                  status = "good";
                                  statusColor = "text-green-500";
                                } else if (percentValue < 5) {
                                  status = "concern";
                                  statusColor = "text-red-500";
                                }
                              }
                              
                              return (
                                <tr key={index} className="border-b border-border/20">
                                  <td className="py-2">{ratio.name}</td>
                                  <td className="text-right font-medium">{ratio.value}</td>
                                  <td className={`text-right font-medium ${statusColor}`}>
                                    {status === "good" && "✓"}
                                    {status === "concern" && "!"}
                                    {status === "neutral" && "○"}
                                  </td>
                                </tr>
                              );
                            })}
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
                        <p>Current liquidity indicators show that the business maintains a {financialData?.currentRatio === '∞' ? 'very strong' : 'healthy'} cash position with a current ratio of {formatRatioValue(financialData?.currentRatio || '0')}, {financialData?.currentRatio !== '∞' && parseFloat(financialData?.currentRatio || '0') >= 2 ? 'above' : 'below'} the recommended minimum of 2.0.</p>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Profitability Assessment</h3>
                        <p>The business is maintaining a gross margin of {financialData?.grossMargin} and net profit margin of {financialData?.netProfitMargin}. Return on equity at {financialData?.returnOnEquity} indicates the efficiency of capital use.</p>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Growth Trajectory</h3>
                        <p>Analysis of monthly trends indicates {financialData && financialData.netProfit >= 0 ? 'positive' : 'negative'} growth with a net {financialData && financialData.netProfit >= 0 ? 'profit' : 'loss'} of ₹{financialData ? Math.abs(financialData.netProfit).toFixed(2) : '0'}.</p>
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
