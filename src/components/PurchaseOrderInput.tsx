
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PurchaseOrderData } from '@/lib/po-service';
import { analyzePurchaseOrder } from '@/lib/po-service';
import { SendHorizontal, Loader2, LightbulbIcon, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface PurchaseOrderInputProps {
  onPurchaseOrderCreated: (poData: PurchaseOrderData) => void;
}

const PurchaseOrderInput = ({ onPurchaseOrderCreated }: PurchaseOrderInputProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const form = useForm({
    defaultValues: {
      prompt: ''
    }
  });

  const { watch, setValue } = form;
  const prompt = watch('prompt');
  
  const handleSubmit = async (values: { prompt: string }) => {
    if (!values.prompt.trim()) {
      toast.error('Please enter a purchase order description');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzePurchaseOrder(values.prompt);
      
      if (result) {
        onPurchaseOrderCreated(result);
        setValue('prompt', '');
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
    <div className="glass-panel p-6 md:p-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary/70" />
        New Purchase Order
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="po-input" className="text-base font-medium flex items-center gap-1.5">
              <LightbulbIcon className="h-4 w-4 text-yellow-500" />
              Describe your purchase order in natural language
            </Label>
            
            <div className="relative rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-primary/30 overflow-hidden transition-all">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormControl>
                      <Textarea
                        id="po-input"
                        placeholder="Example: Order 10 office chairs at ₹5000 each from ABC Furniture, to be delivered to our Mumbai office within 2 weeks"
                        className="min-h-[180px] text-base p-4 border-0 focus-visible:ring-0 resize-none shadow-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="p-3 bg-muted/20 border-t border-input flex justify-between items-center">
                <p className="text-xs text-muted-foreground italic">
                  Be specific about quantities, prices, vendor details, and delivery timelines
                </p>
                
                <Button 
                  type="submit" 
                  className="relative overflow-hidden group h-9" 
                  disabled={isAnalyzing || !prompt?.trim()}
                  size="sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate
                      <SendHorizontal className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
      
      <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm">
        <p className="flex items-center gap-1.5 font-medium mb-2">
          <LightbulbIcon className="h-4 w-4 text-yellow-500" />
          AI will extract:
        </p>
        <ul className="space-y-1.5 text-muted-foreground ml-6 list-disc">
          <li>Vendor details (name, address)</li>
          <li>Item descriptions, quantities and prices</li>
          <li>Delivery requirements and timeframes</li>
          <li>Payment terms and additional instructions</li>
        </ul>
      </div>
    </div>
  );
};

export default PurchaseOrderInput;
