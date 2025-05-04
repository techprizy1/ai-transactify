
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { Eye, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { downloadInvoice, printInvoice } from '@/utils/pdf-utils';
import { StoredInvoice } from '@/lib/types';
import { format } from 'date-fns';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Type guard function to check if the response data is StoredInvoice[]
  function isStoredInvoiceArray(data: any): data is StoredInvoice[] {
    return Array.isArray(data) && data.every(item => 
      typeof item === 'object' && 
      item !== null && 
      'invoice_number' in item && 
      'data' in item && 
      'created_at' in item && 
      'user_id' in item
    );
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      try {
        // @ts-ignore - We need to ignore the type error since the invoices table doesn't exist in types yet
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching invoices:', error);
          return;
        }
        
        if (data && isStoredInvoiceArray(data)) {
          setInvoices(data);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [user]);
  
  const handlePrintInvoice = (invoiceNumber: string) => {
    try {
      printInvoice();
      toast.success('Printing invoice...');
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
    }
  };
  
  const handleDownloadInvoice = async (invoiceNumber: string) => {
    try {
      toast.loading('Generating PDF...');
      await downloadInvoice(invoiceNumber);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download PDF');
    } finally {
      toast.dismiss();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading invoices...</p>
        ) : invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">Invoice #{invoice.invoice_number}</h3>
                      <p className="text-muted-foreground text-sm">
                        {format(new Date(invoice.created_at), 'PP')}
                      </p>
                      {invoice.data.billTo?.name && (
                        <p className="text-sm mt-1">Client: {invoice.data.billTo.name}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handlePrintInvoice(invoice.invoice_number)}
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Print</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDownloadInvoice(invoice.invoice_number)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                      Amount: ₹{invoice.data.total.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">
                      {invoice.data.items.length} items
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No invoices found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceHistory;
