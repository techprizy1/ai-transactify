import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PurchaseOrder } from '@/lib/types';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { toast } from 'sonner';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#1a202c',
  },
  section: {
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row' as const,
    marginBottom: 8,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#4a5568',
  },
  value: {
    width: '70%',
    fontFamily: 'Helvetica',
    color: '#2d3748',
  },
  table: {
    width: '100%',
    marginBottom: 20,
    border: '1px solid #e2e8f0',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeader: {
    backgroundColor: '#f7fafc',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#4a5568',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontFamily: 'Helvetica',
  },
  total: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: '2px solid #e2e8f0',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: '#2d3748',
  },
  currency: {
    fontFamily: 'Helvetica',
    color: '#2d3748',
  },
  status: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
    fontFamily: 'Helvetica-Bold',
  },
});

const formatCurrency = (amount: number) => {
  return `INR ${amount.toFixed(2)}`;
};

interface PurchaseOrderPreviewProps {
  order: PurchaseOrder;
}

const PurchaseOrderPreview = ({ order }: PurchaseOrderPreviewProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Create PDF document
      const pdfDoc = pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>Purchase Order</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Order ID:</Text>
                <Text style={styles.value}>{order.id}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{new Date(order.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Supplier:</Text>
                <Text style={styles.value}>{order.supplier}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Delivery Date:</Text>
                <Text style={styles.value}>{new Date(order.deliveryDate).toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={{ marginBottom: 15, fontFamily: 'Helvetica-Bold', color: '#4a5568' }}>Items</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Description</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCell}>Unit Price</Text>
                  <Text style={styles.tableCell}>Amount</Text>
                </View>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.description}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={[styles.tableCell, styles.currency]}>{formatCurrency(item.unitPrice)}</Text>
                    <Text style={[styles.tableCell, styles.currency]}>{formatCurrency(item.amount)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.total}>
                <Text style={styles.currency}>Total Amount: {formatCurrency(order.totalAmount)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, styles.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
          </Page>
        </Document>
      );

      // Generate blob
      const blob = await pdfDoc.toBlob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Purchase_Order_${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={handleDownload}
          disabled={isGenerating}
        >
          <Download className="h-4 w-4" />
          {isGenerating ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>

      <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Purchase Order</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Order ID:</span> {order.id}
            </div>
            <div>
              <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Supplier Details</h3>
            <p className="text-gray-700 dark:text-gray-300">{order.supplier}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Date</h3>
            <p className="text-gray-700 dark:text-gray-300">{new Date(order.deliveryDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Description</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Unit Price</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{item.description}</td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td colSpan={3} className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">Total Amount:</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Status</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPreview; 