
import React, { useState, useEffect } from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import ReportSummary from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const BalanceSheet = () => {
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

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense' || t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate retained earnings (profit/loss)
  const retainedEarnings = totalIncome - totalExpense;

  // For demonstration, we'll use some fixed values for other balance sheet items
  // In a real app, these would come from the database
  const cashInHand = 2500;
  const bankAccount = 15000;
  const accountsReceivable = 3000;
  const equipment = 10000;
  const accountsPayable = 2000;
  const loans = 8000;
  const ownersCapital = 16000;
  
  // Calculate totals
  const totalAssets = cashInHand + bankAccount + accountsReceivable + equipment;
  const totalLiabilities = accountsPayable + loans;
  const totalEquity = ownersCapital + retainedEarnings;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

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
                            <td className="text-right">₹{cashInHand.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Bank Account</td>
                            <td className="text-right">₹{bankAccount.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Accounts Receivable</td>
                            <td className="text-right">₹{accountsReceivable.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Equipment</td>
                            <td className="text-right">₹{equipment.toFixed(2)}</td>
                          </tr>
                          <tr className="font-medium">
                            <td className="py-2">Total Assets</td>
                            <td className="text-right">₹{totalAssets.toFixed(2)}</td>
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
                            <td className="text-right">₹{accountsPayable.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Loans</td>
                            <td className="text-right">₹{loans.toFixed(2)}</td>
                          </tr>
                          <tr className="font-medium">
                            <td className="py-2">Total Liabilities</td>
                            <td className="text-right">₹{totalLiabilities.toFixed(2)}</td>
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
                            <td className="text-right">₹{ownersCapital.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-2">Retained Earnings</td>
                            <td className="text-right">₹{retainedEarnings.toFixed(2)}</td>
                          </tr>
                          <tr className="font-medium">
                            <td className="py-2">Total Equity</td>
                            <td className="text-right">₹{totalEquity.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Total Liabilities and Equity</h3>
                      <p className="text-xl font-semibold">₹{totalLiabilitiesAndEquity.toFixed(2)}</p>
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
