
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ReportSummary from '@/components/report/ReportSummary';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const ExpenseReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchExpenseTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('type', 'expense')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setTransactions(data as Transaction[]);
      } catch (error) {
        console.error('Failed to fetch expense transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load expense data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenseTransactions();
  }, [toast]);
  
  // Calculate total expenses
  const totalExpenses = transactions.reduce(
    (sum, transaction) => sum + transaction.amount, 
    0
  );

  return (
    <div className="flex-1 min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Expense Report</h1>
          <p className="mt-2 text-muted-foreground">
            View and analyze your expense data
          </p>
        </div>
        
        {loading ? (
          <div className="glass-panel p-6 text-center">
            <p>Loading expense data...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-8">
            {/* Report Summary Sidebar */}
            <ReportSummary
              transactions={transactions}
              title="Expense"
            />
            
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">Expense Summary</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Expenses</TableCell>
                    <TableCell className="text-right font-medium">₹{totalExpenses.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of Transactions</TableCell>
                    <TableCell className="text-right font-medium">{transactions.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Expense</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(totalExpenses / (transactions.length || 1)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <TransactionHistory 
              transactions={transactions} 
              title="Expense Transactions" 
              filterTypes={['expense']}
              fetchTransactions={false}
            />
          </div>
        ) : (
          <div className="glass-panel p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No Expense Data</h2>
            <p>You haven't recorded any expense transactions yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpenseReport;
