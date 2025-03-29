
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, FileText, SendHorizontal, Download, LightbulbIcon, Receipt } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import InvoicePreview from '@/components/InvoicePreview';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface BusinessInfo {
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
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
  businessInfo?: BusinessInfo;
}

const Invoice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const { user } = useAuth();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    business_name: null,
    business_address: null,
    contact_number: null
  });
  
  const form = useForm({
    defaultValues: {
      prompt: ''
    }
  });

  const { watch, setValue } = form;
  const prompt = watch('prompt');
  
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
  
  const handleGenerateInvoice = async (values: { prompt: string }) => {
    if (!values.prompt.trim()) {
      toast.error('Please enter a description of the invoice');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { 
          prompt: values.prompt,
          businessInfo
        },
      });

      if (error) {
        console.error('Error calling generate-invoice function:', error);
        toast.error('Failed to generate invoice. Please try again.');
        return;
      }

      if (data.error) {
        console.error('Error from generate-invoice function:', data.error);
        toast.error('Failed to process invoice. Please try again with more details.');
        return;
      }
      
      setInvoiceData(data);
      setValue('prompt', '');
      toast.success('Invoice generated successfully');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  const isBusinessInfoMissing = !businessInfo.business_name || !businessInfo.business_address || !businessInfo.contact_number;
  
  return (
    <div className="flex-1 min-h-screen">
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center">
            <Receipt className="h-8 w-8 mr-2 text-primary/70" />
            AI Invoice Generator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Describe your invoice in natural language and our AI will generate it for you
          </p>
        </div>
        
        {isBusinessInfoMissing && (
          <div className="mb-8 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
            <p className="text-yellow-800 font-medium">Business information incomplete</p>
            <p className="text-sm text-yellow-700 mt-1">
              Add your business name, address, and contact number in your profile to display them on invoices.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
              onClick={() => window.location.href = '/profile'}
            >
              Update Profile
            </Button>
          </div>
        )}
        
        <div className="grid lg:grid-cols-2 gap-8 print:hidden">
          <div className="space-y-8">
            <div className="glass-panel p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary/70" />
                Generate Invoice
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGenerateInvoice)} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="invoice-input" className="text-base font-medium flex items-center gap-1.5">
                      <LightbulbIcon className="h-4 w-4 text-yellow-500" />
                      Describe your invoice in natural language
                    </Label>
                    
                    <div className="relative rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-primary/30 overflow-hidden transition-all">
                      <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                          <FormItem className="m-0">
                            <FormControl>
                              <Textarea
                                id="invoice-input"
                                placeholder="Example: Create an invoice for ABC Corp for web design services. Include 3 items: website design for ₹45000, logo design for ₹15000, and SEO setup for ₹25000. The invoice was issued today and is due in 30 days."
                                className="min-h-[180px] text-base p-4 border-0 focus-visible:ring-0 resize-none shadow-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="p-3 bg-muted/20 border-t border-input flex justify-between items-center">
                        <p className="text-xs text-muted-foreground italic">
                          Include invoice items, prices, client details, dates, and payment terms
                        </p>
                        
                        <Button 
                          type="submit" 
                          className="relative overflow-hidden group h-9" 
                          disabled={isLoading || !prompt?.trim()}
                          size="sm"
                        >
                          {isLoading ? (
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
                  <li>Client name and contact details</li>
                  <li>Invoice items, quantities and prices</li>
                  <li>Tax information and total amount</li>
                  <li>Invoice dates and payment terms</li>
                </ul>
              </div>
            </div>
            
            <div className="glass-panel p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                Example prompts
              </h2>
              <div className="space-y-3">
                {[
                  "Create an invoice for ABC Corp for web design services. Include 3 items: website design for ₹45000, logo design for ₹15000, and SEO setup for ₹25000. The invoice was issued today and is due in 30 days.",
                  "Generate an invoice for John Doe for consulting services at ₹5000 per hour for 10 hours with a tax rate of 18%.",
                  "Invoice to Acme Inc. for office supplies: 5 laptops at ₹50000 each, 10 monitors at ₹15000 each, and 5 keyboards at ₹1500 each. Apply a 12% tax rate.",
                  "Make an invoice for XYZ Ltd for software development work done in April. 80 hours of coding at ₹2000/hr and 20 hours of testing at ₹1500/hr. Invoice number INV-2023-42."
                ].map((example, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors flex items-start"
                    onClick={() => {
                      setValue('prompt', example);
                      toast.success('Example copied to input');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2 mt-0.5 text-primary/70 flex-shrink-0" />
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            {invoiceData ? (
              <div className="glass-panel p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Invoice Preview</h2>
                  <Button variant="outline" onClick={handlePrint}>
                    <Download className="mr-2 h-4 w-4" />
                    Print / Download
                  </Button>
                </div>
                <InvoicePreview invoice={invoiceData} />
              </div>
            ) : (
              <div className="glass-panel p-6 h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Invoice Generated Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Enter a description of your invoice in the form and click "Generate" to create a new invoice using AI.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="hidden print:block">
          {invoiceData && <InvoicePreview invoice={invoiceData} />}
        </div>
      </main>
    </div>
  );
};

export default Invoice;
