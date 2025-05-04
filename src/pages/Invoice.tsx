import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import InvoicePreview from '@/components/InvoicePreview';
import { downloadInvoice, printInvoice } from '@/utils/pdf-utils';
import { InvoiceData, InvoiceItem } from '@/lib/types';
import { InvoiceTemplateType, templateOptions } from '@/components/InvoiceTemplates';

const Invoice = () => {
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: invoiceNumber || '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    billTo: {
      name: '',
      address: '',
    },
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<InvoiceTemplateType>('classic');
  
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Use type assertion to bypass TypeScript error
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices' as any)
          .select('*')
          .eq('invoice_number', invoiceNumber);
      
        if (invoiceError) {
          console.error('Error fetching invoice:', invoiceError);
          return;
        }
        
        if (invoiceData && invoiceData.length > 0) {
          const fetchedInvoice = invoiceData[0] as any;
          setInvoiceData({
            invoiceNumber: fetchedInvoice.invoice_number || '',
            date: fetchedInvoice.date || '',
            dueDate: fetchedInvoice.due_date || '',
            billTo: fetchedInvoice.bill_to || { name: '', address: '' },
            items: fetchedInvoice.items || [],
            subtotal: fetchedInvoice.subtotal || 0,
            taxRate: fetchedInvoice.tax_rate || 0,
            taxAmount: fetchedInvoice.tax_amount || 0,
            total: fetchedInvoice.total || 0,
          });
        } else if (invoiceNumber) {
          toast.info('Invoice not found, creating a new one');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, [user, invoiceNumber]);
  
  useEffect(() => {
    // Recalculate amounts whenever items or tax rate changes
    const newSubtotal = invoiceData.items.reduce((acc, item) => acc + item.amount, 0);
    const newTaxAmount = newSubtotal * (invoiceData.taxRate / 100);
    const newTotal = newSubtotal + newTaxAmount;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal: newSubtotal,
      taxAmount: newTaxAmount,
      total: newTotal,
    }));
  }, [invoiceData.items, invoiceData.taxRate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleBillToChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      billTo: {
        ...prev.billTo,
        [name]: value,
      },
    }));
  };
  
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...invoiceData.items];
    newItems[index][field as keyof InvoiceItem] = value;
    
    // Calculate amount if quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity.toString() || '0');
      const unitPrice = parseFloat(newItems[index].unitPrice.toString() || '0');
      newItems[index].amount = quantity * unitPrice;
    }
    
    setInvoiceData(prev => ({
      ...prev,
      items: newItems,
    }));
  };
  
  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    }));
  };
  
  const removeItem = (index: number) => {
    const newItems = [...invoiceData.items];
    newItems.splice(index, 1);
    setInvoiceData(prev => ({
      ...prev,
      items: newItems,
    }));
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('invoices' as any)
        .upsert({
          id: invoiceNumber || undefined,
          user_id: user.id,
          invoice_number: invoiceData.invoiceNumber,
          date: invoiceData.date,
          due_date: invoiceData.dueDate,
          bill_to: invoiceData.billTo,
          items: invoiceData.items,
          subtotal: invoiceData.subtotal,
          tax_rate: invoiceData.taxRate,
          tax_amount: invoiceData.taxAmount,
          total: invoiceData.total,
        }, { onConflict: 'invoice_number' });
      
      if (error) {
        console.error('Error saving invoice:', error);
        toast.error('Failed to save invoice');
        return;
      }
      
      toast.success('Invoice saved successfully');
      navigate(`/invoice/${invoiceData.invoiceNumber}`);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrintInvoice = () => {
    try {
      printInvoice();
      toast.success('Printing invoice...');
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
    }
  };
  
  const handleDownloadInvoice = async () => {
    try {
      toast.loading('Generating PDF...');
      await downloadInvoice(invoiceData.invoiceNumber);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download PDF');
    } finally {
      toast.dismiss();
    }
  };
  
  return (
    <div className="flex-1 min-h-screen">
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage your invoices
          </p>
        </div>
        
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input 
                  type="text" 
                  id="invoiceNumber" 
                  name="invoiceNumber" 
                  value={invoiceData.invoiceNumber} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={invoiceData.date} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  type="date" 
                  id="dueDate" 
                  name="dueDate" 
                  value={invoiceData.dueDate} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input 
                  type="number" 
                  id="taxRate" 
                  name="taxRate" 
                  value={invoiceData.taxRate} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Bill To</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billToName">Name</Label>
                  <Input 
                    type="text" 
                    id="billToName" 
                    name="name" 
                    value={invoiceData.billTo.name} 
                    onChange={handleBillToChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="billToAddress">Address</Label>
                  <Textarea
                    id="billToAddress"
                    name="address"
                    value={invoiceData.billTo.address}
                    onChange={handleBillToChange}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input 
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>{item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel mt-8">
          <CardHeader>
            <CardTitle>Preview & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template">Template</Label>
              <Select 
                onValueChange={(value) => setTemplate(value as InvoiceTemplateType)} 
                defaultValue={template}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templateOptions.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <InvoicePreview invoice={invoiceData} template={template} />
            
            <div className="flex justify-between">
              <Button 
                onClick={handlePrintInvoice}
                variant="outline"
              >
                Print Invoice
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={handleDownloadInvoice}
                  variant="outline"
                >
                  Download PDF
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Invoice'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Invoice;
