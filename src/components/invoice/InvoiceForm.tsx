
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BusinessInfo } from '@/lib/types';

interface InvoiceFormProps {
  isLoading: boolean;
  onGenerate: (promptText: string) => Promise<void>;
  businessInfo: BusinessInfo;
}

const InvoiceForm = ({ isLoading, onGenerate, businessInfo }: InvoiceFormProps) => {
  const [prompt, setPrompt] = useState('');
  const isMobile = useIsMobile();
  
  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a description of the invoice');
      return;
    }
    
    await onGenerate(prompt);
  };
  
  const isBusinessInfoMissing = !businessInfo.business_name || !businessInfo.business_address || !businessInfo.contact_number;
  
  return (
    <div className="space-y-4 md:space-y-8">
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
    </div>
  );
};

export default InvoiceForm;
