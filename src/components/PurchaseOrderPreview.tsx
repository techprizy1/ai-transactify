
import { useIsMobile } from "@/hooks/use-mobile";
import { PurchaseOrderData } from "@/lib/po-service";
import { Download, Printer, Share2, FileText, Calendar, Truck, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

interface PurchaseOrderPreviewProps {
  poData: PurchaseOrderData | null;
}

const PurchaseOrderPreview = ({ poData }: PurchaseOrderPreviewProps) => {
  const isMobile = useIsMobile();
  const printRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  
  if (!poData) {
    return (
      <div className="glass-panel p-6 text-center flex flex-col items-center justify-center min-h-[300px]">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-lg font-medium mb-2">
          No Purchase Order Created Yet
        </p>
        <p className="text-muted-foreground text-sm max-w-md">
          Use the form to create a purchase order with AI
        </p>
      </div>
    );
  }
  
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
      
      pdf.save(`PO-${poData.supplier_name.replace(/\s+/g, '-')}.pdf`);
      
      toast.success("Purchase order downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Purchase Order - ${poData.supplier_name}`,
        text: `Purchase Order for ${poData.supplier_name}`,
      }).then(() => {
        toast.success("Shared successfully");
      }).catch((error) => {
        console.error("Error sharing:", error);
        toast.error("Failed to share");
      });
    } else {
      toast.success("Sharing options opened");
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  return (
    <div className="glass-panel p-6 animate-fade-in print:shadow-none print:border-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary/70" />
          Purchase Order
        </h2>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button size="sm" variant="outline" onClick={handlePrint} className="print:hidden">
            <Printer className="h-4 w-4 mr-2" />
            {!isMobile && "Print"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload} className="print:hidden">
            <Download className="h-4 w-4 mr-2" />
            {!isMobile && "Download"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare} className="print:hidden">
            <Share2 className="h-4 w-4 mr-2" />
            {!isMobile && "Share"}
          </Button>
        </div>
      </div>
      
      <div ref={printRef} className="bg-white p-6 rounded-lg border shadow-sm">
        {/* PO Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">PURCHASE ORDER</h1>
            <div className="text-sm text-gray-600">
              <p className="font-medium">PO #: {Math.floor(Math.random() * 9000) + 1000}</p>
              <p>Issue Date: {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 flex items-center justify-end">
                <Building2 className="h-4 w-4 mr-1 text-primary/70" />
                Your Company Name
              </p>
              <p>123 Business Street, Business District</p>
              <p>City, State, ZIP</p>
              <p>Phone: +91 XXXX XXXX</p>
            </div>
          </div>
        </div>
        
        {/* PO Details Grid */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-1 text-primary/70" /> Supplier
            </h3>
            <div className="text-gray-800">
              <p className="font-medium">{poData.supplier_name}</p>
              <p className="text-sm text-gray-600">Supplier ID: SUP-{Math.floor(Math.random() * 900) + 100}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary/70" /> Delivery Details
            </h3>
            <div className="text-gray-800">
              <p className="font-medium">Expected delivery: {formatDate(poData.delivery_date)}</p>
              <p className="text-sm text-gray-600">Payment terms: {poData.payment_terms}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Truck className="h-4 w-4 mr-1 text-primary/70" /> Shipping Address
            </h3>
            <div className="text-gray-800">
              <p className="font-medium">{poData.shipping_address}</p>
            </div>
          </div>
        </div>
        
        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4">Order Items</h3>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40%] font-semibold">Item Description</TableHead>
                  <TableHead className="text-right font-semibold">Quantity</TableHead>
                  <TableHead className="text-right font-semibold">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poData.items.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-bold border-t-2">
                  <TableCell colSpan={3} className="text-right">Total:</TableCell>
                  <TableCell className="text-right">{formatCurrency(poData.total_amount)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Terms & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Terms & Conditions</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>All items must be delivered by the delivery date.</li>
              <li>Payment will be processed according to the payment terms.</li>
              <li>Goods received in damaged condition will be returned.</li>
              <li>Please quote PO number in all correspondence.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Notes</h3>
            <p className="text-xs text-gray-600">
              This purchase order was generated by AI based on your description.
              Please contact us if you have any questions about this order.
            </p>
          </div>
        </div>
        
        {/* Signatures */}
        <div className="mt-10 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-xs text-gray-500 mb-8">Authorized By:</p>
            <div className="border-b border-gray-300 w-48"></div>
            <p className="text-xs mt-1 text-gray-600">Authorized Signature</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-8">Received By:</p>
            <div className="border-b border-gray-300 w-48"></div>
            <p className="text-xs mt-1 text-gray-600">Supplier Signature</p>
          </div>
        </div>
      </div>
      
      {/* Modern downloadable template (hidden from view but used for PDF generation) */}
      <div ref={downloadRef} className="hidden">
        <div className="bg-white p-8" style={{ width: '1200px' }}>
          {/* Modern header with gradient */}
          <div style={{ borderBottom: '3px solid #f3f4f6', paddingBottom: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>PURCHASE ORDER</h1>
                <div style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', height: '6px', width: '80px', marginBottom: '16px' }}></div>
                <div style={{ fontSize: '14px', color: '#4b5563' }}>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}><span style={{ fontWeight: 'bold' }}>PO #:</span> {Math.floor(Math.random() * 9000) + 1000}</p>
                  <p><span style={{ fontWeight: 'bold' }}>Issue Date:</span> {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  Your Company Name
                </div>
                <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                  <p>123 Business Street, Business District</p>
                  <p>City, State, ZIP</p>
                  <p>Phone: +91 XXXX XXXX</p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Order Info Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                Supplier
              </h3>
              <div>
                <p style={{ fontWeight: '500', fontSize: '16px', marginBottom: '8px', color: '#111827' }}>{poData.supplier_name}</p>
                <p style={{ fontSize: '14px', color: '#4b5563' }}>Supplier ID: SUP-{Math.floor(Math.random() * 900) + 100}</p>
              </div>
            </div>
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                Delivery Details
              </h3>
              <div>
                <p style={{ fontWeight: '500', fontSize: '16px', marginBottom: '8px', color: '#111827' }}>Expected delivery: {formatDate(poData.delivery_date)}</p>
                <p style={{ fontSize: '14px', color: '#4b5563' }}>Payment terms: {poData.payment_terms}</p>
              </div>
            </div>
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                Shipping Address
              </h3>
              <div>
                <p style={{ fontWeight: '500', fontSize: '16px', color: '#111827' }}>{poData.shipping_address}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Order Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e5e7eb', width: '40%' }}>Item Description</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Quantity</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Unit Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', borderBottom: '2px solid #e5e7eb' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {poData.items.map((item, index) => (
                  <tr key={index} style={{ background: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>{item.description}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr style={{ background: '#f3f4f6', fontWeight: '700' }}>
                  <td colSpan={3} style={{ padding: '16px', textAlign: 'right', borderTop: '2px solid #e5e7eb' }}>Total:</td>
                  <td style={{ padding: '16px', textAlign: 'right', borderTop: '2px solid #e5e7eb', color: '#047857' }}>{formatCurrency(poData.total_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Terms & Conditions</h3>
              <ul style={{ fontSize: '13px', color: '#4b5563', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '4px' }}>All items must be delivered by the delivery date.</li>
                <li style={{ marginBottom: '4px' }}>Payment will be processed according to the payment terms.</li>
                <li style={{ marginBottom: '4px' }}>Goods received in damaged condition will be returned.</li>
                <li>Please quote PO number in all correspondence.</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Notes</h3>
              <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                This purchase order was generated by AI based on your description.
                Please contact us if you have any questions about this order.
              </p>
            </div>
          </div>
          
          {/* Signatures */}
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '2px solid #f3f4f6', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '32px' }}>Authorized By:</p>
              <div style={{ borderBottom: '1px solid #d1d5db', width: '200px' }}></div>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#6b7280' }}>Authorized Signature</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '32px' }}>Received By:</p>
              <div style={{ borderBottom: '1px solid #d1d5db', width: '200px' }}></div>
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#6b7280' }}>Supplier Signature</p>
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '24px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block' }}>
                <div style={{ height: '4px', width: '120px', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}></div>
                <p style={{ fontSize: '13px', marginTop: '8px', color: '#047857', fontWeight: '500' }}>
                  Thank you for your business!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPreview;
