
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { InvoiceTemplateType } from '@/components/InvoiceTemplates';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/context/AuthContext';
import InvoiceForm from '@/components/invoice/InvoiceForm';
import ExamplePrompts from '@/components/invoice/ExamplePrompts';
import TemplateSelector from '@/components/invoice/TemplateSelector';
import InvoiceDisplay from '@/components/invoice/InvoiceDisplay';

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
  
  const handleGenerateInvoice = async (promptText: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { 
          prompt: promptText,
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

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };
  
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 print:hidden">
              <div className="space-y-4 md:space-y-8">
                <InvoiceForm 
                  isLoading={isLoading}
                  onGenerate={handleGenerateInvoice}
                  businessInfo={businessInfo}
                />
                
                <ExamplePrompts onSelectPrompt={handleSelectPrompt} />
                
                {invoiceData && (
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                  />
                )}
              </div>
              
              <div>
                <InvoiceDisplay 
                  invoiceData={invoiceData} 
                  template={selectedTemplate} 
                />
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
