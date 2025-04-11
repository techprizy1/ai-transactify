import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, FileText, Send, Download, Printer } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import InvoicePreview from '@/components/InvoicePreview';
import InvoiceTemplates, { InvoiceTemplateType } from '@/components/InvoiceTemplates';
import { downloadInvoice, printInvoice } from '@/utils/pdf-utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { BusinessInfo, InvoiceData } from '@/lib/types';

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
  gstn_number: string | null;
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
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplateType>('classic');
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    business_name: null,
    business_address: null,
    contact_number: null,
    gstn_number: null
  });
  
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('business_name, business_address, contact_number, gstn_number')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching business info:', error);
          return;
        }
        
        if (data) {
          const profileData = data as {
            business_name: string | null;
            business_address: string | null;
            contact_number: string | null;
            gstn_number: string | null;
          };
          
          setBusinessInfo({
            business_name: profileData.business_name,
            business_address: profileData.business_address,
            contact_number: profileData.contact_number,
            gstn_number: profileData.gstn_number
          });
        }
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };
    
    fetchBusinessInfo();
  }, [user]);
  
  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a description of the invoice');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { 
          prompt,
          businessInfo: {
            ...businessInfo,
            gstn_number: businessInfo.gstn_number || null
          }
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
      toast.success('Invoice generated successfully');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setIsLoading(false);
    }
  };

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
  
  const isBusinessInfoMissing = !businessInfo.business_name || !businessInfo.business_address || !businessInfo.contact_number;
  
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
            <div className="text-center mb-8 md:mb-12 animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Invoice Generator</h1>
              <p className="mt-2 text-muted-foreground text-sm md:text-base">
                Describe your invoice in natural language and our AI will generate it for you
              </p>
            </div>
            
            {isBusinessInfoMissing && (
              <div className="mb-6 md:mb-8 p-3 md:p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-yellow-800 font-medium text-sm md:text-base">Business information incomplete</p>
                <p className="text-xs md:text-sm text-yellow-700 mt-1">
                  Add your business name, address, contact number, and GSTN number in your profile to display them on invoices.
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 print:hidden">
              <div className="space-y-4 md:space-y-8">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Generate Invoice</CardTitle>
                    <CardDescription>
                      Describe your invoice in natural language
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGenerateInvoice} className="space-y-4">
                      <div className="space-y-2">
                        <Textarea
                          id="invoice-input"
                          placeholder={isMobile ? "Example: Create an invoice for web design services..." : "Example: Create an invoice for ABC Corp for web design services. Include 3 items: website design for ₹45000, logo design for ₹15000, and SEO setup for ₹25000. The invoice was issued on April 10th and is due in 30 days."}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          rows={isMobile ? 4 : 6}
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
                              <span className="text-sm">Generating...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm">Generate Invoice</span>
                              <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Example prompts</CardTitle>
                    <CardDescription>
                      Click on any example to use it
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "Create an invoice for ABC Corp for web design services. Include 3 items: website design for ₹45000, logo design for ₹15000, and SEO setup for ₹25000. The invoice was issued today and is due in 30 days.",
                        "Generate an invoice for John Doe for consulting services at ₹5000 per hour for 10 hours with a tax rate of 18%.",
                        "Invoice to Acme Inc. for office supplies: 5 laptops at ₹50000 each, 10 monitors at ₹15000 each, and 5 keyboards at ₹1500 each. Apply a 12% tax rate.",
                        "Make an invoice for XYZ Ltd for software development work done in April. 80 hours of coding at ₹2000/hr and 20 hours of testing at ₹1500/hr. Invoice number INV-2023-42."
                      ].map((example, index) => (
                        <div 
                          key={index} 
                          className="p-2 md:p-3 bg-muted/50 rounded-md text-xs md:text-sm cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => {
                            setPrompt(example);
                            toast.success('Example copied to input');
                          }}
                        >
                          {isMobile ? example.slice(0, 80) + '...' : example}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {invoiceData && (
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Invoice Settings</CardTitle>
                      <CardDescription>
                        Customize your invoice appearance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InvoiceTemplates 
                        selectedTemplate={selectedTemplate}
                        onSelectTemplate={setSelectedTemplate}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div>
                {invoiceData ? (
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
                          template={selectedTemplate} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full animate-fade-in">
                    <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
                      <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-base md:text-lg font-medium mb-2">No Invoice Generated Yet</h3>
                      <p className="text-xs md:text-sm text-muted-foreground max-w-md">
                        Enter a description of your invoice in the form and click "Generate Invoice" to create a new invoice using AI.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="hidden print:block">
              {invoiceData && <InvoicePreview invoice={invoiceData} template={selectedTemplate} />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Invoice;
