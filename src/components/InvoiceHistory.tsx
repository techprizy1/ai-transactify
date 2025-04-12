
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Calendar, FileText, Eye, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { downloadInvoice, printInvoice } from '@/utils/pdf-utils';
import { toast } from 'sonner';

interface StoredInvoice {
  id: string;
  invoice_number: string;
  data: any;
  created_at: string;
  user_id: string;
}

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState<StoredInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast.error('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoice(invoiceId === selectedInvoice ? null : invoiceId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoice History</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : invoices.length > 0 ? (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary/70" />
                    <div>
                      <p className="font-medium">Invoice #{invoice.invoice_number}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(invoice.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="text-xs gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {selectedInvoice === invoice.id ? 'Hide' : 'View'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintInvoice(invoice.invoice_number)}
                      className="text-xs gap-1"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.invoice_number)}
                      className="text-xs gap-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                </div>
                {selectedInvoice === invoice.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                        Client: {invoice.data?.billTo?.name || 'N/A'}
                      </pre>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Total: ₹{invoice.data?.total?.toFixed(2) || 'N/A'}</p>
                        <p>Due Date: {invoice.data?.dueDate ? formatDate(invoice.data.dueDate) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No invoices generated yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvoiceHistory;
