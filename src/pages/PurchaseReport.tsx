
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const PurchaseReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPurchaseTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .in('type', ['expense', 'purchase'])
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setTransactions(data as Transaction[]);
      } catch (error) {
        console.error('Failed to fetch purchase transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load purchase data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPurchaseTransactions();
  }, [toast]);
  
  // Calculate total purchases
  const totalPurchases = transactions.reduce(
    (sum, transaction) => sum + transaction.amount, 
    0
  );

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight">Purchase Report</h1>
              <p className="mt-2 text-muted-foreground">
                View and analyze your purchase data
              </p>
            </div>
            
            {loading ? (
              <div className="glass-panel p-6 text-center">
                <p>Loading purchase data...</p>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-8">
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-semibold mb-4">Purchase Summary</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Purchases</TableCell>
                        <TableCell className="text-right font-medium">₹{totalPurchases.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number of Transactions</TableCell>
                        <TableCell className="text-right font-medium">{transactions.length}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average Purchase</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{(totalPurchases / (transactions.length || 1)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <TransactionHistory 
                  transactions={transactions} 
                  title="Purchase Transactions" 
                  filterTypes={['expense', 'purchase']}
                  fetchTransactions={false}
                />
              </div>
            ) : (
              <div className="glass-panel p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">No Purchase Data</h2>
                <p>You haven't recorded any purchase transactions yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PurchaseReport;
