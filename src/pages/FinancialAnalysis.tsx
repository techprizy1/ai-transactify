
import React from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import { ReportSummary } from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';
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

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, description: 'Sales Revenue', date: new Date().toISOString(), type: 'income', category: 'Sales' },
  { id: '2', amount: 3000, description: 'Consulting Services', date: new Date().toISOString(), type: 'income', category: 'Services' },
  { id: '3', amount: 1500, description: 'Rent', date: new Date().toISOString(), type: 'expense', category: 'Office' },
  { id: '4', amount: 800, description: 'Utilities', date: new Date().toISOString(), type: 'expense', category: 'Office' },
  { id: '5', amount: 1200, description: 'Salary', date: new Date().toISOString(), type: 'expense', category: 'Staff' },
];

// Chart mock data
const monthlyData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const cashFlowData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: -1000 },
  { name: 'Apr', value: 500 },
  { name: 'May', value: 2000 },
  { name: 'Jun', value: 1000 },
];

const expenseBreakdown = [
  { name: 'Office', value: 2300 },
  { name: 'Salary', value: 1200 },
  { name: 'Marketing', value: 800 },
  { name: 'Equipment', value: 500 },
  { name: 'Others', value: 900 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Financial ratios data
const ratios = [
  { name: 'Current Ratio', value: '2.5' },
  { name: 'Quick Ratio', value: '1.8' },
  { name: 'Debt to Equity', value: '0.35' },
  { name: 'Gross Margin', value: '65%' },
  { name: 'Net Profit Margin', value: '18%' },
  { name: 'Return on Assets', value: '12%' },
  { name: 'Return on Equity', value: '15%' },
];

const FinancialAnalysis = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Financial Analysis</h1>
            
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
                    <p>Current liquidity indicators show that the business maintains a healthy cash position with a current ratio of 2.5, above the recommended minimum of 2.0. The quick ratio of 1.8 suggests strong short-term financial health.</p>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h3 className="font-semibold mb-1">Profitability Assessment</h3>
                    <p>The business is maintaining good profitability with a gross margin of 65% and net profit margin of 18%. Return on equity at 15% indicates efficient use of invested capital.</p>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md">
                    <h3 className="font-semibold mb-1">Growth Trajectory</h3>
                    <p>Revenue has grown at a compound annual growth rate of 12% over the past three years. Primary growth drivers include expansion of service offerings and increased market penetration.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-1/4">
            <ReportSummary transactions={mockTransactions} title="Financial Analysis" />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default FinancialAnalysis;
