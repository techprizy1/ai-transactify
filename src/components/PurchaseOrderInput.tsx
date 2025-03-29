
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PurchaseOrderData } from '@/lib/po-service';
import { analyzePurchaseOrder } from '@/lib/po-service';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PurchaseOrderInputProps {
  onPurchaseOrderCreated: (poData: PurchaseOrderData) => void;
}

const PurchaseOrderInput = ({ onPurchaseOrderCreated }: PurchaseOrderInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a purchase order description');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzePurchaseOrder(prompt);
      
      if (result) {
        onPurchaseOrderCreated(result);
        setPrompt('');
        toast.success('Purchase order analyzed successfully');
      }
    } catch (error) {
      console.error('Error processing purchase order:', error);
      toast.error('Failed to process purchase order');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">New Purchase Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="po-input" className="text-sm font-medium">
            Describe your purchase order in natural language
          </label>
          <Textarea
            id="po-input"
            placeholder="Example: Order 10 office chairs at ₹5000 each from ABC Furniture, to be delivered to our Mumbai office within 2 weeks"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full relative overflow-hidden btn-hover-effect" 
            disabled={isAnalyzing || !prompt.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing purchase order...
              </>
            ) : (
              <>
                Create purchase order
                <SendHorizontal className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Our AI will automatically extract details from your description to create a purchase order.</p>
        </div>
      </form>
    </div>
  );
};

export default PurchaseOrderInput;
