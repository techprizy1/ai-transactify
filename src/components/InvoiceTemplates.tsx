
import React from 'react';
import { Check } from 'lucide-react';

export type InvoiceTemplateType = 'classic' | 'modern' | 'minimal';

interface InvoiceTemplatesProps {
  selectedTemplate: InvoiceTemplateType;
  onSelectTemplate: (template: InvoiceTemplateType) => void;
}

const InvoiceTemplates: React.FC<InvoiceTemplatesProps> = ({ 
  selectedTemplate, 
  onSelectTemplate 
}) => {
  const templates: { id: InvoiceTemplateType; name: string; description: string }[] = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional invoice layout with a professional look',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with clean lines and visual hierarchy',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simplified layout focusing on essential information',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Select Template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`
              relative rounded-lg cursor-pointer border p-4 hover:bg-muted/50 transition-colors
              ${selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
            `}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            <div className="h-20 w-full bg-gradient-to-br 
              from-muted/80 to-muted/30 rounded-md mb-3 
              flex items-center justify-center text-sm text-muted-foreground">
              {template.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm font-medium">{template.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTemplates;
