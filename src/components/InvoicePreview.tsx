import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { InvoiceTemplateType } from "./InvoiceTemplates";
import { CalendarDays, User, Phone, FileText } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billTo: {
    name: string;
    address: string;
    email?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

interface BusinessInfo {
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
}

interface InvoicePreviewProps {
  invoice: InvoiceData;
  template?: InvoiceTemplateType;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

const InvoicePreview = ({ invoice, template = 'classic' }: InvoicePreviewProps) => {
  const { user } = useAuth();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    business_name: null,
    business_address: null,
    contact_number: null
  });

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('business_name, business_address, contact_number')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setBusinessInfo({
            business_name: data.business_name,
            business_address: data.business_address,
            contact_number: data.contact_number
          });
        }
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };
    
    fetchBusinessInfo();
  }, [user]);

  switch (template) {
    case 'modern':
      return (
        <div id="invoice-preview" className="bg-white rounded-lg overflow-hidden border print:border-0 print:shadow-none print:p-1">
          <div className="bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground p-8 print:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5 opacity-80" />
                  <h1 className="text-3xl font-bold tracking-tight uppercase">INVOICE</h1>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    #{invoice.invoiceNumber}
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="font-medium text-2xl">{businessInfo.business_name || 'Your Company Name'}</div>
                <div className="mt-2 opacity-90 text-sm">
                  <p>{businessInfo.business_address || 'Business Address Not Set'}</p>
                  <p>{businessInfo.contact_number || 'Contact Number Not Set'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 print:p-6">
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-muted/10 p-6 rounded-lg border border-muted/20 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-primary" />
                  <h2 className="text-sm uppercase text-muted-foreground font-semibold tracking-wider">Bill To</h2>
                </div>
                <div className="text-gray-800">
                  <p className="font-medium text-xl">{invoice.billTo.name}</p>
                  <p className="whitespace-pre-line mt-3 text-muted-foreground">{invoice.billTo.address}</p>
                  {invoice.billTo.email && <p className="text-muted-foreground mt-1">{invoice.billTo.email}</p>}
                </div>
              </div>
              <div className="bg-muted/10 p-6 rounded-lg border border-muted/20 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <h2 className="text-sm uppercase text-muted-foreground font-semibold tracking-wider">Invoice Details</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-muted/20">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="font-medium">{formatDate(invoice.date)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-muted/20">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg border mb-10 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead className="w-[50%] py-4 font-semibold">Description</TableHead>
                    <TableHead className="text-right py-4 font-semibold">Quantity</TableHead>
                    <TableHead className="text-right py-4 font-semibold">Unit Price</TableHead>
                    <TableHead className="text-right py-4 font-semibold">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, i) => (
                    <TableRow key={i} className="hover:bg-muted/5 border-b border-muted/10">
                      <TableCell className="font-medium py-4">{item.description}</TableCell>
                      <TableCell className="text-right py-4">{item.quantity}</TableCell>
                      <TableCell className="text-right py-4">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right py-4 font-medium">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="w-full md:w-80 space-y-3 bg-muted/5 p-6 rounded-lg border border-muted/20 shadow-sm">
                <div className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-muted/20 font-medium text-lg">
                  <span>Total:</span>
                  <span className="text-primary font-bold">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-primary" />
                <p className="font-medium">Payment Terms</p>
              </div>
              <p>Please pay the total amount by the due date. Thank you for your business!</p>
            </div>
          </div>
        </div>
      );
      
    case 'minimal':
      return (
        <div id="invoice-preview" className="bg-white rounded-lg overflow-hidden print:p-1">
          <div className="p-6 print:p-4">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-xl">{businessInfo.business_name || 'Your Company Name'}</div>
                  <div className="mt-1 text-muted-foreground text-sm">
                    <p>{businessInfo.business_address || 'Business Address Not Set'}</p>
                    <p>{businessInfo.contact_number || 'Contact Number Not Set'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold">INVOICE #{invoice.invoiceNumber}</h1>
                  <div className="mt-1 text-sm">
                    <p>Issued: {formatDate(invoice.date)}</p>
                    <p>Due: {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-sm uppercase tracking-wider mb-2">Bill To</h2>
                <div>
                  <p className="font-medium">{invoice.billTo.name}</p>
                  <p className="whitespace-pre-line text-muted-foreground text-sm">{invoice.billTo.address}</p>
                  {invoice.billTo.email && <p className="text-muted-foreground text-sm">{invoice.billTo.email}</p>}
                </div>
              </div>
              
              <div className="mt-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">Subtotal</TableCell>
                      <TableCell className="text-right">{formatCurrency(invoice.subtotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">Tax ({invoice.taxRate}%)</TableCell>
                      <TableCell className="text-right">{formatCurrency(invoice.taxAmount)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(invoice.total)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              
              <div className="mt-8 text-sm text-muted-foreground">
                <p>Please pay the total amount by the due date. Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      );
      
    default:
      return (
        <div id="invoice-preview" className="bg-white rounded-lg overflow-hidden border p-6 print:border-0 print:p-1 print:shadow-none">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                <div className="mt-1 text-sm text-gray-500">
                  <p className="font-medium"># {invoice.invoiceNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-900 font-medium">{businessInfo.business_name || 'Your Company Name'}</div>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{businessInfo.business_address || 'Business Address Not Set'}</p>
                  <p>{businessInfo.contact_number || 'Contact Number Not Set'}</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h2>
                <div className="text-gray-800">
                  <p className="font-medium">{invoice.billTo.name}</p>
                  <p className="whitespace-pre-line">{invoice.billTo.address}</p>
                  {invoice.billTo.email && <p>{invoice.billTo.email}</p>}
                </div>
              </div>
              <div className="sm:text-right">
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-sm font-medium text-gray-500">Issue Date:</div>
                  <div className="text-gray-800">{formatDate(invoice.date)}</div>
                  
                  <div className="text-sm font-medium text-gray-500">Due Date:</div>
                  <div className="text-gray-800">{formatDate(invoice.dueDate)}</div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.subtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Tax ({invoice.taxRate}%)</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.taxAmount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold text-lg">Total</TableCell>
                    <TableCell className="text-right font-bold text-lg">{formatCurrency(invoice.total)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            <div className="mt-6 pt-4 border-t text-sm text-gray-500">
              <p className="font-medium mb-1">Payment Terms</p>
              <p>Please pay the total amount by the due date. Thank you for your business!</p>
            </div>
          </div>
        </div>
      );
  }
};

export default InvoicePreview;
