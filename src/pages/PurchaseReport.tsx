import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction, PurchaseOrder, PurchaseOrderItem } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, TrendingDown, Download, Printer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PurchaseOrderPreview from '@/components/PurchaseOrderPreview';
import { downloadInvoice, printInvoice } from '@/utils/pdf-utils';

const PurchaseReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
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
      toast.error('Failed to load purchase data');
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      // Use type assertion to bypass TypeScript error until types are updated
      const { data, error } = await supabase
        .from('purchase_orders' as any)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Map the database fields to match the PurchaseOrder interface
      const mappedData = data.map((order: any) => ({
        id: order.id,
        supplier: order.supplier,
        deliveryDate: order.delivery_date,
        items: order.items as PurchaseOrderItem[],
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at
      }));
      
      setPurchaseOrders(mappedData);
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPurchaseTransactions();
    fetchPurchaseOrders();
  }, []);
  
  // Calculate total purchases
  const totalPurchases = transactions.reduce(
    (sum, transaction) => sum + transaction.amount, 
    0
  );

  // Calculate purchase order statistics
  const totalPurchaseOrders = purchaseOrders.length;
  const totalPurchaseOrderAmount = purchaseOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const pendingOrders = purchaseOrders.filter(order => order.status === 'pending').length;
  const completedOrders = purchaseOrders.filter(order => order.status === 'completed').length;

  const handlePrintOrder = (order: PurchaseOrder) => {
    try {
      // Set the selected order for preview
      setSelectedOrder(order.id);
      // Wait for the DOM to update
      setTimeout(() => {
        printInvoice();
        setSelectedOrder(null);
      }, 100);
    } catch (error) {
      console.error('Error printing purchase order:', error);
      toast.error('Failed to print purchase order');
    }
  };

  const handleDownloadOrder = async (order: PurchaseOrder) => {
    try {
      // Set the selected order for preview
      setSelectedOrder(order.id);
      // Wait for the DOM to update
      setTimeout(async () => {
        await downloadInvoice(order.id);
        setSelectedOrder(null);
      }, 100);
    } catch (error) {
      console.error('Error downloading purchase order:', error);
      toast.error('Failed to download purchase order');
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  return (
    <div className="flex-1 min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Purchase Report</h1>
          <p className="mt-2 text-muted-foreground">
            View and analyze your purchase data
          </p>
        </div>
        
        {loading ? (
          <div className="glass-panel p-6 text-center">
            <p>Loading purchase data...</p>
          </div>
        ) : (
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Purchase Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-8">
              {transactions.length > 0 ? (
                <>
                  <ReportSummary
                    transactions={transactions}
                    title="Purchase"
                  />
                  
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
                    onTransactionUpdated={fetchPurchaseTransactions}
                  />
                </>
              ) : (
                <div className="glass-panel p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4">No Purchase Data</h2>
                  <p>You haven't recorded any purchase transactions yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-8">
              {purchaseOrders.length > 0 ? (
                <>
                  <div className="glass-panel p-6">
                    <h2 className="text-xl font-semibold mb-4">Purchase Orders Summary</h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Metric</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Purchase Orders</TableCell>
                          <TableCell className="text-right font-medium">{totalPurchaseOrders}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Amount</TableCell>
                          <TableCell className="text-right font-medium">₹{totalPurchaseOrderAmount.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Pending Orders</TableCell>
                          <TableCell className="text-right font-medium">{pendingOrders}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Completed Orders</TableCell>
                          <TableCell className="text-right font-medium">{completedOrders}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="glass-panel p-6">
                    <h2 className="text-xl font-semibold mb-4">Purchase Orders</h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Delivery Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead className="text-right">Total Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchaseOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.supplier}</TableCell>
                            <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                            <TableCell>{order.items.length}</TableCell>
                            <TableCell className="text-right font-medium">₹{order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewOrder(order.id)}
                                  className="text-xs gap-1"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  {selectedOrder === order.id ? 'Hide' : 'View'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePrintOrder(order)}
                                  className="text-xs gap-1"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  Print
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadOrder(order)}
                                  className="text-xs gap-1"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  Download
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Show preview when an order is selected */}
                  {selectedOrder && (
                    <div className="glass-panel p-6">
                      <PurchaseOrderPreview 
                        order={purchaseOrders.find(order => order.id === selectedOrder)!} 
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="glass-panel p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4">No Purchase Orders</h2>
                  <p>You haven't created any purchase orders yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default PurchaseReport;
