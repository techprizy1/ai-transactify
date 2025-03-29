
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  ReceiptText 
} from 'lucide-react';

const SalesReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSalesTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .in('type', ['income', 'sale'])
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setTransactions(data as Transaction[]);
      } catch (error) {
        console.error('Failed to fetch sales transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load sales data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalesTransactions();
  }, [toast]);
  
  // Calculate total sales
  const totalSales = transactions.reduce(
    (sum, transaction) => sum + transaction.amount, 
    0
  );

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center">
                <BarChart3 className="h-8 w-8 mr-2 text-primary/70" />
                Sales Report
              </h1>
              <p className="mt-2 text-muted-foreground">
                View and analyze your sales data
              </p>
            </div>
            
            {loading ? (
              <div className="glass-panel p-6 text-center animate-pulse">
                <p>Loading sales data...</p>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-6 flex items-center">
                    <DollarSign className="h-10 w-10 text-primary/70 mr-4" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 flex items-center">
                    <ReceiptText className="h-10 w-10 text-primary/70 mr-4" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-2xl font-bold">{transactions.length}</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 flex items-center">
                    <TrendingUp className="h-10 w-10 text-primary/70 mr-4" />
                    <div>
                      <p className="text-sm text-muted-foreground">Average Sale</p>
                      <p className="text-2xl font-bold">₹{(totalSales / (transactions.length || 1)).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary/70" />
                    Sales Summary
                  </h2>
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Sales</TableCell>
                        <TableCell className="text-right font-medium">₹{totalSales.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number of Transactions</TableCell>
                        <TableCell className="text-right font-medium">{transactions.length}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average Sale</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{(totalSales / (transactions.length || 1)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <TransactionHistory 
                  transactions={transactions} 
                  title="Sales Transactions" 
                  filterTypes={['income', 'sale']}
                  fetchTransactions={false}
                />
              </div>
            ) : (
              <div className="glass-panel p-6 text-center animate-fade-in">
                <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
                  <ReceiptText className="h-6 w-6 mr-2 text-primary/70" />
                  No Sales Data
                </h2>
                <p>You haven't recorded any sales transactions yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SalesReport;
