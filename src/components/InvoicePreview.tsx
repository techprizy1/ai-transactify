
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Building2, User, CalendarDays, CalendarClock, Banknote, Download, Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const { user } = useAuth();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    business_name: null,
    business_address: null,
    contact_number: null
  });
  const printRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = async () => {
    if (!downloadRef.current) {
      toast.error("Could not generate PDF");
      return;
    }
    
    try {
      toast.info("Generating PDF, please wait...");
      
      const canvas = await html2canvas(downloadRef.current, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200, // Fixed width to ensure consistent rendering
        onclone: (document, element) => {
          // Make sure all content is visible in the cloned element for PDF generation
          element.style.height = 'auto';
          element.style.overflow = 'visible';
          element.style.width = '1200px';
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
      
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border p-6 print:border-0 print:p-1 print:shadow-none animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary/70" />
          Invoice Preview
        </h1>
        <div className="flex space-x-2 print:hidden">
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div ref={printRef} className="bg-white p-6 rounded-lg border shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">INVOICE</h1>
            <div className="text-sm text-gray-600">
              <p className="font-medium">Invoice #: {invoice.invoiceNumber}</p>
              <p>Date: {formatDate(invoice.date)}</p>
              <p>Due Date: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-900 font-medium flex items-center justify-end">
              <Building2 className="h-4 w-4 mr-1 text-primary/70" />
              {businessInfo.business_name || 'Your Company Name'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <p>{businessInfo.business_address || 'Business Address Not Set'}</p>
              <p>{businessInfo.contact_number || 'Contact Number Not Set'}</p>
              <p>GST: 27XXXXX1234X1Z5</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <User className="h-4 w-4 mr-1 text-primary/70" />
              Bill To
            </h2>
            <div className="text-gray-800">
              <p className="font-medium">{invoice.billTo.name}</p>
              <p className="whitespace-pre-line text-sm">{invoice.billTo.address}</p>
              {invoice.billTo.email && <p className="text-sm">{invoice.billTo.email}</p>}
              <p className="text-sm">Customer ID: CUST-{Math.floor(Math.random() * 900) + 100}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Payment Information</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="text-sm font-medium text-gray-600">Issue Date:</div>
              <div className="text-sm text-gray-800">{formatDate(invoice.date)}</div>
              
              <div className="text-sm font-medium text-gray-600">Due Date:</div>
              <div className="text-sm text-gray-800">{formatDate(invoice.dueDate)}</div>
              
              <div className="text-sm font-medium text-gray-600">Payment Method:</div>
              <div className="text-sm text-gray-800">Bank Transfer</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4">Invoice Items</h3>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40%] font-semibold">Description</TableHead>
                  <TableHead className="text-right font-semibold">Quantity</TableHead>
                  <TableHead className="text-right font-semibold">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, i) => (
                  <TableRow key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                <TableRow className="bg-gray-100">
                  <TableCell colSpan={3} className="text-right font-semibold text-lg flex items-center justify-end">
                    <Banknote className="h-4 w-4 mr-1 text-primary" />
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatCurrency(invoice.total)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        {/* Bank Details & Payment Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Payment Details</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Bank Name: STATE BANK OF INDIA</p>
              <p>Account Name: {businessInfo.business_name || 'Your Company Name'}</p>
              <p>Account Number: XXXXXXXXXXXX</p>
              <p>IFSC Code: SBIN0011223</p>
              <p>Branch: Main Branch</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Payment Terms</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Please pay before the due date.</li>
              <li>Include invoice number in payment reference.</li>
              <li>Late payments may incur additional charges.</li>
              <li>For questions regarding this invoice, please contact our accounts department.</li>
            </ul>
          </div>
        </div>
        
        {/* Signatures */}
        <div className="mt-10 pt-6 border-t grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs text-gray-500 mb-8">For {businessInfo.business_name || 'Your Company Name'}:</p>
            <div className="border-b border-gray-300 w-48"></div>
            <p className="text-xs mt-1 text-gray-600">Authorized Signature</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 italic">
              Thank you for your business!
            </p>
          </div>
        </div>
      </div>
      
      {/* Modern downloadable template (hidden from view but used for PDF generation) */}
      <div ref={downloadRef} className="hidden">
        <div className="bg-white p-8" style={{ width: '1200px' }}>
          {/* Modern header with gradient */}
          <div className="pb-8 mb-8" style={{ borderBottom: '3px solid #f3f4f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>INVOICE</h1>
                <div style={{ background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', height: '6px', width: '60px', marginBottom: '16px' }}></div>
                <div style={{ fontSize: '14px', color: '#4b5563' }}>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}><span style={{ fontWeight: 'bold' }}>Invoice #:</span> {invoice.invoiceNumber}</p>
                  <p style={{ marginBottom: '4px' }}><span style={{ fontWeight: 'bold' }}>Date:</span> {formatDate(invoice.date)}</p>
                  <p><span style={{ fontWeight: 'bold' }}>Due Date:</span> {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  {businessInfo.business_name || 'Your Company Name'}
                </div>
                <div style={{ fontSize: '14px', color: '#4b5563' }}>
                  <p style={{ marginBottom: '4px' }}>{businessInfo.business_address || 'Business Address Not Set'}</p>
                  <p style={{ marginBottom: '4px' }}>{businessInfo.contact_number || 'Contact Number Not Set'}</p>
                  <p>GST: 27XXXXX1234X1Z5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client and payment info */}
          <div style={{ display: 'flex', marginBottom: '32px', gap: '24px' }}>
            <div style={{ flex: '1', background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Bill To</h2>
              <div>
                <p style={{ fontWeight: '500', fontSize: '16px', marginBottom: '8px', color: '#111827' }}>{invoice.billTo.name}</p>
                <p style={{ fontSize: '14px', color: '#4b5563', whiteSpace: 'pre-line', marginBottom: '8px' }}>{invoice.billTo.address}</p>
                {invoice.billTo.email && <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>{invoice.billTo.email}</p>}
                <p style={{ fontSize: '14px', color: '#4b5563' }}>Customer ID: CUST-{Math.floor(Math.random() * 900) + 100}</p>
              </div>
            </div>
            <div style={{ flex: '1', background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Payment Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Issue Date:</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>{formatDate(invoice.date)}</div>
                
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Due Date:</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>{formatDate(invoice.dueDate)}</div>
                
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Payment Method:</div>
                <div style={{ fontSize: '14px', color: '#111827' }}>Bank Transfer</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Invoice Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb', width: '40%' }}>Description</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Quantity</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Unit Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>{item.description}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500', borderTop: '2px solid #e5e7eb' }}>Subtotal</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500', borderTop: '2px solid #e5e7eb' }}>{formatCurrency(invoice.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>Tax ({invoice.taxRate}%)</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(invoice.taxAmount)}</td>
                </tr>
                <tr style={{ background: '#f3f4f6' }}>
                  <td colSpan={3} style={{ padding: '16px', textAlign: 'right', fontWeight: '700', fontSize: '18px' }}>Total</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', fontSize: '18px', color: '#4f46e5' }}>{formatCurrency(invoice.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Bank Details & Payment Terms */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Payment Details</h3>
              <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '4px' }}>Bank Name: STATE BANK OF INDIA</p>
                <p style={{ marginBottom: '4px' }}>Account Name: {businessInfo.business_name || 'Your Company Name'}</p>
                <p style={{ marginBottom: '4px' }}>Account Number: XXXXXXXXXXXX</p>
                <p style={{ marginBottom: '4px' }}>IFSC Code: SBIN0011223</p>
                <p>Branch: Main Branch</p>
              </div>
            </div>
            <div style={{ flex: '1' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Payment Terms</h3>
              <ul style={{ fontSize: '13px', color: '#4b5563', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '4px' }}>Please pay before the due date.</li>
                <li style={{ marginBottom: '4px' }}>Include invoice number in payment reference.</li>
                <li style={{ marginBottom: '4px' }}>Late payments may incur additional charges.</li>
                <li>For questions regarding this invoice, please contact our accounts department.</li>
              </ul>
            </div>
          </div>
          
          {/* Footer with signatures and thank you note */}
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '2px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '32px' }}>For {businessInfo.business_name || 'Your Company Name'}:</p>
              <div style={{ borderBottom: '1px solid #d1d5db', width: '200px' }}></div>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#6b7280' }}>Authorized Signature</p>
            </div>
            <div style={{ textAlign: 'right', alignSelf: 'flex-end' }}>
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#4f46e5' }}>
                Thank you for your business!
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <div style={{ height: '4px', width: '100px', background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
