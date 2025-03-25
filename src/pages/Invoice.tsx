import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, FileText, Send, Download } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import InvoicePreview from '@/components/InvoicePreview';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

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

const Invoice = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  
  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a description of the invoice');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { prompt },
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
  
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight">AI Invoice Generator</h1>
              <p className="mt-2 text-muted-foreground">
                Describe your invoice in natural language and our AI will generate it for you
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 print:hidden">
              <div className="space-y-8">
                <div className="glass-panel p-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Generate Invoice</h2>
                  <form onSubmit={handleGenerateInvoice} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="invoice-input" className="text-sm font-medium">
                        Describe your invoice in natural language
                      </label>
                      <Textarea
                        id="invoice-input"
                        placeholder="Example: Create an invoice for ABC Corp for web design services. Include 3 items: website design for ₹45000, logo design for ₹15000, and SEO setup for ₹25000. The invoice was issued on April 10th and is due in 30 days."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                        className="resize-none transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full relative overflow-hidden btn-hover-effect" 
                        disabled={isLoading || !prompt.trim()}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating invoice...
                          </>
                        ) : (
                          <>
                            Generate Invoice
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className="glass-panel p-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Example prompts</h2>
                  <div className="space-y-3">
                    {[
                      "Create an invoice for ABC Corp for web design services. Include 3 items: website design for ₹45000, logo design for ₹15000, and SEO setup for ₹25000. The invoice was issued today and is due in 30 days.",
                      "Generate an invoice for John Doe for consulting services at ₹5000 per hour for 10 hours with a tax rate of 18%.",
                      "Invoice to Acme Inc. for office supplies: 5 laptops at ₹50000 each, 10 monitors at ₹15000 each, and 5 keyboards at ₹1500 each. Apply a 12% tax rate.",
                      "Make an invoice for XYZ Ltd for software development work done in April. 80 hours of coding at ₹2000/hr and 20 hours of testing at ₹1500/hr. Invoice number INV-2023-42."
                    ].map((example, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => {
                          setPrompt(example);
                          toast.success('Example copied to input');
                        }}
                      >
                        {example}
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
                      Enter a description of your invoice in the form and click "Generate Invoice" to create a new invoice using AI.
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
      </div>
    </SidebarProvider>
  );
};

export default Invoice;
