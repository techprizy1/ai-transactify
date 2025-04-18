import React, { useState, useEffect } from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import ReportSummary from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { calculateFinancialData, FinancialData } from '@/lib/financialUtils';

const BalanceSheet = () => {
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
            <h1 className="text-3xl font-bold mb-6">Balance Sheet</h1>
            
            {loading ? (
              <div className="glass-panel p-6 text-center">
                <p>Loading balance sheet data...</p>
              </div>
            ) : (
              <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Balance Sheet Statement</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Assets</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-2">Item</th>
                            <th className="text-right py-2">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Cash in Hand</td>
                            <td className="text-right">₹{financialData?.cashInHand.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Bank Account</td>
                            <td className="text-right">₹{financialData?.bankAccount.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Accounts Receivable</td>
                            <td className="text-right">₹{financialData?.accountsReceivable.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Equipment</td>
                            <td className="text-right">₹{financialData?.equipment.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="font-medium">
                            <td className="py-2">Total Assets</td>
                            <td className="text-right">₹{financialData?.totalAssets.toFixed(2) || '0.00'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Liabilities</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-2">Item</th>
                            <th className="text-right py-2">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Accounts Payable</td>
                            <td className="text-right">₹{financialData?.accountsPayable.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Loans</td>
                            <td className="text-right">₹{financialData?.loans.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="font-medium">
                            <td className="py-2">Total Liabilities</td>
                            <td className="text-right">₹{financialData?.totalLiabilities.toFixed(2) || '0.00'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Equity</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/30">
                            <th className="text-left py-2">Item</th>
                            <th className="text-right py-2">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Owner's Capital</td>
                            <td className="text-right">₹{financialData?.ownersCapital.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Retained Earnings</td>
                            <td className="text-right">₹{financialData?.retainedEarnings.toFixed(2) || '0.00'}</td>
                          </tr>
                          <tr className="font-medium">
                            <td className="py-2">Total Equity</td>
                            <td className="text-right">₹{financialData?.totalEquity.toFixed(2) || '0.00'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Total Liabilities and Equity</h3>
                      <p className="text-xl font-semibold">₹{financialData ? (financialData.totalLiabilities + financialData.totalEquity).toFixed(2) : '0.00'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/4">
            <ReportSummary transactions={transactions} title="Balance Sheet" />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default BalanceSheet;
