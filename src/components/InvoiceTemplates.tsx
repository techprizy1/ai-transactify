
import React from 'react';
import { Check, Layout, FileText, LayoutGrid } from 'lucide-react';

export type InvoiceTemplateType = 'classic' | 'modern' | 'minimal';

interface InvoiceTemplatesProps {
  selectedTemplate: InvoiceTemplateType;
  onSelectTemplate: (template: InvoiceTemplateType) => void;
}

const InvoiceTemplates: React.FC<InvoiceTemplatesProps> = ({ 
  selectedTemplate, 
  onSelectTemplate 
}) => {
  const templates: { 
    id: InvoiceTemplateType; 
    name: string; 
    description: string;
    icon: React.ReactNode;
    gradient: string;
  }[] = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional invoice layout with a professional look',
      icon: <FileText className="h-5 w-5" />,
      gradient: 'from-blue-100 to-blue-50',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with clean lines and visual hierarchy',
      icon: <Layout className="h-5 w-5" />,
      gradient: 'from-purple-100 to-indigo-50',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simplified layout focusing on essential information',
      icon: <LayoutGrid className="h-5 w-5" />,
      gradient: 'from-gray-100 to-gray-50',
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
              relative rounded-lg cursor-pointer border p-4 hover:bg-muted/30 transition-all
              ${selectedTemplate === template.id 
                ? 'border-primary ring-2 ring-primary/20 shadow-sm' 
                : 'border-border hover:shadow-sm'}
            `}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            <div className={`h-24 w-full bg-gradient-to-br ${template.gradient} rounded-md mb-3 
              flex flex-col items-center justify-center text-sm text-muted-foreground p-2`}>
              <div className="bg-white/80 rounded-full p-2 mb-2">
                {template.icon}
              </div>
              <span className="text-xs font-medium">{template.name}</span>
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
