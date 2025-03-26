
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction } from '@/lib/types';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const SalesReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load transactions from local storage
    const savedTransactions = localStorage.getItem('accountai-transactions');
    if (savedTransactions) {
      try {
        const allTransactions = JSON.parse(savedTransactions);
        setTransactions(allTransactions);
      } catch (error) {
        console.error('Failed to parse saved transactions:', error);
      }
    }
    setLoading(false);
  }, []);
  
  // Filter sales-related transactions
  const salesTransactions = transactions.filter(
    transaction => transaction.type === 'income' || transaction.type === 'sale'
  );
  
  // Calculate total sales
  const totalSales = salesTransactions.reduce(
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
              <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
              <p className="mt-2 text-muted-foreground">
                View and analyze your sales data
              </p>
            </div>
            
            {loading ? (
              <div className="glass-panel p-6 text-center">
                <p>Loading sales data...</p>
              </div>
            ) : salesTransactions.length > 0 ? (
              <div className="space-y-8">
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-semibold mb-4">Sales Summary</h2>
                  <Table>
                    <TableHeader>
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
                        <TableCell className="text-right font-medium">{salesTransactions.length}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average Sale</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{(totalSales / (salesTransactions.length || 1)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <TransactionHistory 
                  transactions={salesTransactions} 
                  title="Sales Transactions" 
                  filterTypes={['income', 'sale']}
                />
              </div>
            ) : (
              <div className="glass-panel p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">No Sales Data</h2>
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
