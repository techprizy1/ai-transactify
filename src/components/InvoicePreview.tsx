
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { InvoiceTemplateType } from "./InvoiceTemplates";
import { CalendarDays, User, Phone, FileText, Mail, MapPin, Building, CreditCard, ReceiptText } from "lucide-react";

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
  gstn_number: string | null;
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
    contact_number: null,
    gstn_number: null
  });

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('business_name, business_address, contact_number, gstn_number')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setBusinessInfo({
            business_name: data.business_name,
            business_address: data.business_address,
            contact_number: data.contact_number,
            gstn_number: data.gstn_number
          });
        }
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };
    
    fetchBusinessInfo();
  }, [user]);

  switch (template) {
    case 'corporate':
      return (
        <div id="invoice-preview" className="bg-white rounded-lg overflow-hidden border print:border-0 print:shadow-none print:p-1">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 print:p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
                <div className="mt-2 bg-white/20 px-3 py-1 rounded-md inline-block">
                  #{invoice.invoiceNumber}
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-white/90">
                <div className="text-xl font-bold">{businessInfo.business_name || 'Your Company Name'}</div>
                <div className="mt-1 text-sm">
                  {businessInfo.business_address && (
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 opacity-70" />
                      <span>{businessInfo.business_address}</span>
                    </div>
                  )}
                  {businessInfo.contact_number && (
                    <div className="flex items-center mt-1">
                      <Phone className="h-3.5 w-3.5 mr-1 opacity-70" />
                      <span>{businessInfo.contact_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 print:p-6">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-blue-800">
                  <User className="h-4 w-4" />
                  <h2 className="font-semibold">BILL TO</h2>
                </div>
                <div>
                  <p className="font-bold text-lg">{invoice.billTo.name}</p>
                  <p className="whitespace-pre-line mt-2 text-gray-600">{invoice.billTo.address}</p>
                  {invoice.billTo.email && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      <span>{invoice.billTo.email}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-blue-800">
                  <CalendarDays className="h-4 w-4" />
                  <h2 className="font-semibold">INVOICE DETAILS</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-gray-500">Issue Date:</div>
                  <div className="col-span-2 font-medium">{formatDate(invoice.date)}</div>
                  
                  <div className="text-gray-500">Due Date:</div>
                  <div className="col-span-2 font-medium">{formatDate(invoice.dueDate)}</div>
                  
                  <div className="text-gray-500">Status:</div>
                  <div className="col-span-2">
                    <span className="bg-yellow-100 text-yellow-800 font-medium text-xs px-2.5 py-0.5 rounded">PENDING</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 overflow-hidden rounded-lg border border-blue-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 text-blue-800">
                    <TableHead className="w-[50%]">Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, i) => (
                    <TableRow key={i} className="bg-white">
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="w-full md:w-72 space-y-2 bg-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="flex justify-between pb-2 border-b border-blue-100">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-700">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-500">
              <div className="flex items-center gap-2 mb-2 text-blue-700">
                <CreditCard className="h-4 w-4" />
                <p className="font-semibold">Payment Instructions</p>
              </div>
              <p>Please pay the total amount by the due date. Bank details are listed below.</p>
              <div className="mt-3 grid grid-cols-2 gap-3 max-w-md">
                <div className="text-gray-600">Account Name:</div>
                <div>{businessInfo.business_name || 'Your Company'}</div>
                <div className="text-gray-600">Account Number:</div>
                <div>XXXX-XXXX-XXXX</div>
                <div className="text-gray-600">Bank Name:</div>
                <div>EXAMPLE BANK</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 text-xs text-center text-gray-500 border-t border-blue-100">
            <p>Thank you for your business!</p>
          </div>
        </div>
      );
    
    case 'creative':
      return (
        <div id="invoice-preview" className="bg-white rounded-lg overflow-hidden border print:border-0 print:shadow-none print:p-1">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-8 print:p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <div className="text-sm text-white/70 uppercase tracking-widest mb-1">Invoice</div>
                <h1 className="text-4xl font-bold tracking-tight">#{invoice.invoiceNumber}</h1>
              </div>
              <div className="mt-6 md:mt-0 text-right">
                <div className="font-bold text-2xl">{businessInfo.business_name || 'Your Company Name'}</div>
                <div className="text-white/80 text-sm mt-1">
                  <p>{businessInfo.business_address || 'Business Address Not Set'}</p>
                  <p>{businessInfo.contact_number || 'Contact Number Not Set'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 print:p-6 bg-gradient-to-b from-white to-purple-50">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-200 p-2 rounded-lg mr-3">
                    <User className="h-4 w-4 text-purple-700" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-700">Client Details</h2>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{invoice.billTo.name}</p>
                  <p className="whitespace-pre-line mt-2 text-gray-600">{invoice.billTo.address}</p>
                  {invoice.billTo.email && <p className="mt-1 text-gray-600">{invoice.billTo.email}</p>}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-200 p-2 rounded-lg mr-3">
                    <CalendarDays className="h-4 w-4 text-purple-700" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-700">Invoice Info</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Issue Date:</span>
                    <span className="font-medium">{formatDate(invoice.date)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Due Date:</span>
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 overflow-hidden rounded-xl shadow-sm border border-purple-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-100 to-purple-50 text-gray-800">
                    <TableHead className="w-[50%] font-bold">Service / Product</TableHead>
                    <TableHead className="text-right font-bold">Qty</TableHead>
                    <TableHead className="text-right font-bold">Price</TableHead>
                    <TableHead className="text-right font-bold">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, i) => (
                    <TableRow key={i} className="bg-white hover:bg-purple-50/30">
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="w-full md:w-80 p-6 bg-white rounded-xl shadow-sm border border-purple-100">
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between pt-3 font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-purple-700">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-200 p-2 rounded-lg">
                  <Building className="h-4 w-4 text-purple-700" />
                </div>
                <h3 className="font-bold text-gray-700">Payment Details</h3>
              </div>
              <p className="text-gray-600 mb-3">Please include the invoice number when making payment.</p>
              <div className="grid grid-cols-2 gap-2 max-w-md text-sm">
                <div className="text-gray-500">Bank Name:</div>
                <div className="font-medium">Example National Bank</div>
                <div className="text-gray-500">Account Name:</div>
                <div className="font-medium">{businessInfo.business_name || 'Your Company'}</div>
                <div className="text-gray-500">Account Number:</div>
                <div className="font-medium">XXXX-XXXX-XXXX</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 text-white text-center text-sm">
            <p>Thank you for your business! We look forward to working with you again.</p>
          </div>
        </div>
      );
      
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
