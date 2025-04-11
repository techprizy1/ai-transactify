
import { useState } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const ExamplePrompts = ({ onSelectPrompt }: ExamplePromptsProps) => {
  const isMobile = useIsMobile();
  
  const examplePrompts = [
    "Create an invoice for ABC Corp for web design services. Include 3 items: website design for ₹45000, logo design for ₹15000, and SEO setup for ₹25000. The invoice was issued today and is due in 30 days.",
    "Generate an invoice for John Doe for consulting services at ₹5000 per hour for 10 hours with a tax rate of 18%.",
    "Invoice to Acme Inc. for office supplies: 5 laptops at ₹50000 each, 10 monitors at ₹15000 each, and 5 keyboards at ₹1500 each. Apply a 12% tax rate.",
    "Make an invoice for XYZ Ltd for software development work done in April. 80 hours of coding at ₹2000/hr and 20 hours of testing at ₹1500/hr. Invoice number INV-2023-42."
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Example prompts</CardTitle>
        <CardDescription>
          Click on any example to use it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {examplePrompts.map((example, index) => (
            <div 
              key={index} 
              className="p-2 md:p-3 bg-muted/50 rounded-md text-xs md:text-sm cursor-pointer hover:bg-muted transition-colors"
              onClick={() => {
                onSelectPrompt(example);
                toast.success('Example copied to input');
              }}
            >
              {isMobile ? example.slice(0, 80) + '...' : example}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamplePrompts;
