
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import PurchaseOrderInput from '@/components/PurchaseOrderInput';
import PurchaseOrderPreview from '@/components/PurchaseOrderPreview';
import { PurchaseOrderData } from '@/lib/po-service';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { FileText, Receipt, ClipboardCheck, FileTextIcon } from 'lucide-react';

const PurchaseOrders = () => {
  const [poData, setPoData] = useState<PurchaseOrderData | null>(null);
  const isMobile = useIsMobile();
  
  const handlePurchaseOrderCreated = (data: PurchaseOrderData) => {
    setPoData(data);
  };
  
  return (
    <div className="flex-1 min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center">
            <Receipt className="h-8 w-8 mr-2 text-primary/70" />
            Purchase Orders
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage purchase orders using AI
          </p>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'md:grid-cols-2 gap-8'}`}>
          <div>
            <PurchaseOrderInput onPurchaseOrderCreated={handlePurchaseOrderCreated} />
            
            {isMobile ? null : (
              <div className="glass-panel p-6 mt-8 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2 text-primary/70" />
                  Example phrases
                </h2>
                <div className="space-y-3">
                  {[
                    "Order 5 laptops from Dell at ₹65,000 each to be delivered by next month",
                    "Purchase 100 reams of A4 paper from Staples at ₹250 per ream with Net 30 payment terms",
                    "Buy 20 office chairs from Godrej at ₹6,500 each for our Bangalore office",
                    "Order 3 HP printers at ₹15,000 each from Tech Solutions with COD payment",
                    "Purchase 50 HDMI cables from Amazon at ₹500 each for delivery to Delhi office next week"
                  ].map((example, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors flex items-start"
                      onClick={() => {
                        navigator.clipboard.writeText(example);
                        toast.success('Example copied to clipboard');
                      }}
                    >
                      <FileTextIcon className="h-4 w-4 mr-2 mt-0.5 text-primary/70 flex-shrink-0" />
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <PurchaseOrderPreview poData={poData} />
          </div>
          
          {isMobile ? (
            <div className="glass-panel p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-primary/70" />
                Example phrases
              </h2>
              <div className="space-y-3">
                {[
                  "Order 5 laptops from Dell at ₹65,000 each to be delivered by next month",
                  "Purchase 100 reams of A4 paper from Staples at ₹250 per ream with Net 30 payment terms",
                  "Buy 20 office chairs from Godrej at ₹6,500 each for our Bangalore office",
                  "Order 3 HP printers at ₹15,000 each from Tech Solutions with COD payment",
                  "Purchase 50 HDMI cables from Amazon at ₹500 each for delivery to Delhi office next week"
                ].map((example, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors flex items-start"
                    onClick={() => {
                      navigator.clipboard.writeText(example);
                      toast.success('Example copied to clipboard');
                    }}
                  >
                    <FileTextIcon className="h-4 w-4 mr-2 mt-0.5 text-primary/70 flex-shrink-0" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrders;
