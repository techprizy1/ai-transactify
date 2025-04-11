
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, FileText, Printer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import InvoicePreview from '@/components/InvoicePreview';
import { downloadInvoice, printInvoice } from '@/utils/pdf-utils';
import { InvoiceTemplateType } from '@/components/InvoiceTemplates';

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billTo: {
    name: string;
    address: string;
    email?: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  businessInfo?: BusinessInfo;
}

interface BusinessInfo {
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
  gstn_number: string | null;
}

interface InvoiceDisplayProps {
  invoiceData: InvoiceData | null;
  template: InvoiceTemplateType;
}

const InvoiceDisplay = ({ invoiceData, template }: InvoiceDisplayProps) => {
  const handlePrint = () => {
    printInvoice();
  };
  
  const handleDownload = async () => {
    if (invoiceData) {
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
    }
  };

  if (!invoiceData) {
    return (
      <Card className="h-full animate-fade-in">
        <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
          <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-base md:text-lg font-medium mb-2">No Invoice Generated Yet</h3>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md">
            Enter a description of your invoice in the form and click "Generate Invoice" to create a new invoice using AI.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Invoice Preview</CardTitle>
          <CardDescription>
            Invoice #{invoiceData.invoiceNumber}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs md:text-sm">
            <Printer className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs md:text-sm">
            <Download className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t overflow-x-auto">
          <InvoicePreview 
            invoice={invoiceData} 
            template={template} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceDisplay;
