
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PurchaseOrderData } from '@/lib/po-service';
import { analyzePurchaseOrder } from '@/lib/po-service';
import { SendHorizontal, Loader2, FileText, LightbulbIcon, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
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
            
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      id="po-input"
                      placeholder="Example: Order 10 office chairs at ₹5000 each from ABC Furniture, to be delivered to our Mumbai office within 2 weeks"
                      className="resize-none min-h-[120px] text-base p-4 transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0 bg-background"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <p className="text-sm text-muted-foreground italic">
              Be specific about quantities, prices, vendor details, and delivery timelines
            </p>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full relative overflow-hidden group py-6 text-base" 
              disabled={isAnalyzing || !prompt?.trim()}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing purchase order...
                </>
              ) : (
                <>
                  Create purchase order
                  <SendHorizontal className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
            <p className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary/70" />
              Our AI will extract vendor details, items, quantities, prices, and delivery terms from your description
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderInput;
