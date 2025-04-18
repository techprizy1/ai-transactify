import React, { useState, useEffect } from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import ReportSummary from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { calculateFinancialData, FinancialData } from '@/lib/financialUtils';

const PLAccount = () => {
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

  return (
    <SidebarInset>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Profit & Loss Account</h1>
            
            {loading ? (
              <div className="glass-panel p-6 text-center">
                <p>Loading profit & loss data...</p>
              </div>
            ) : (
              <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Profit & Loss Statement</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Revenue</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-2">Category</th>
                            <th className="text-right py-2">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financialData && Object.entries(financialData.incomeByCategory).map(([category, amount], index) => (
                            <tr key={index} className="border-b border-border/20">
                              <td className="py-2">{category}</td>
                              <td className="text-right">₹{amount.toFixed(2)}</td>
                            </tr>
                          ))}
                          {financialData && Object.keys(financialData.incomeByCategory).length === 0 && (
                            <tr className="border-b border-border/20">
                              <td className="py-2 text-muted-foreground" colSpan={2}>No revenue data available</td>
                            </tr>
                          )}
                          <tr className="font-medium">
                            <td className="py-2">Total Revenue</td>
                            <td className="text-right">₹{financialData?.totalIncome.toFixed(2) || '0.00'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {financialData && financialData.costOfGoodsSold > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Cost of Goods Sold</h3>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <table className="w-full">
                          <tbody>
                            <tr className="border-b border-border/20">
                              <td className="py-2">Cost of Goods Sold</td>
                              <td className="text-right">₹{financialData.costOfGoodsSold.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Gross Profit</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <table className="w-full">
                        <tbody>
                          <tr className="font-medium">
                            <td className="py-2">Gross Profit</td>
                            <td className="text-right">₹{financialData?.grossProfit.toFixed(2) || '0.00'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Expenses</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-2">Category</th>
                            <th className="text-right py-2">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financialData && Object.entries(financialData.expensesByCategory).map(([category, amount], index) => (
                            <tr key={index} className="border-b border-border/20">
                              <td className="py-2">{category}</td>
                              <td className="text-right">₹{amount.toFixed(2)}</td>
                            </tr>
                          ))}
                          {financialData && Object.keys(financialData.expensesByCategory).length === 0 && (
                            <tr className="border-b border-border/20">
                              <td className="py-2 text-muted-foreground" colSpan={2}>No expense data available</td>
                            </tr>
                          )}
                          <tr className="font-medium">
                            <td className="py-2">Total Expenses</td>
                            <td className="text-right">₹{financialData ? (financialData.totalExpenses + financialData.costOfGoodsSold).toFixed(2) : '0.00'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Net Profit</h3>
                      <p className={`text-xl font-semibold ${financialData && financialData.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ₹{financialData ? Math.abs(financialData.netProfit).toFixed(2) : '0.00'} {financialData && financialData.netProfit >= 0 ? '' : '(Loss)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/4">
            <ReportSummary transactions={transactions} title="P&L" />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default PLAccount;
