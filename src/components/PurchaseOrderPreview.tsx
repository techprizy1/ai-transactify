
import { useIsMobile } from "@/hooks/use-mobile";
import { PurchaseOrderData } from "@/lib/po-service";
import { Download, Printer, Share2, FileText, Calendar, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface PurchaseOrderPreviewProps {
  poData: PurchaseOrderData | null;
}

const PurchaseOrderPreview = ({ poData }: PurchaseOrderPreviewProps) => {
  const isMobile = useIsMobile();
  
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
  
  const handleDownload = () => {
    // In a real app, this would generate a PDF
    toast.success("Purchase order download started");
  };
  
  const handleShare = () => {
    toast.success("Sharing options opened");
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
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
            <CreditCard className="h-4 w-4 mr-1 text-primary/70" /> Supplier
          </h3>
          <p className="font-medium">{poData.supplier_name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-primary/70" /> Delivery Date
          </h3>
          <p className="font-medium">{formatDate(poData.delivery_date)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
            <Truck className="h-4 w-4 mr-1 text-primary/70" /> Shipping Address
          </h3>
          <p className="font-medium">{poData.shipping_address}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
            <CreditCard className="h-4 w-4 mr-1 text-primary/70" /> Payment Terms
          </h3>
          <p className="font-medium">{poData.payment_terms}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[50%]">Item Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poData.items.map((item, index) => (
              <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/30 font-bold">
              <TableCell colSpan={3} className="text-right">Total:</TableCell>
              <TableCell className="text-right">{formatCurrency(poData.total_amount)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          This purchase order was generated by AI based on your description.
        </p>
      </div>
    </div>
  );
};

export default PurchaseOrderPreview;
