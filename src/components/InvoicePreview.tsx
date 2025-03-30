
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
    if (!printRef.current) {
      toast.error("Could not generate PDF");
      return;
    }
    
    try {
      toast.info("Generating PDF, please wait...");
      
      const canvas = await html2canvas(printRef.current, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
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
    </div>
  );
};

export default InvoicePreview;
