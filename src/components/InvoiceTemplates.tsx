
import React from 'react';
import { Check, Layout, FileText, LayoutGrid, Layers, Palette } from 'lucide-react';

export type InvoiceTemplateType = 'classic' | 'modern' | 'minimal' | 'corporate' | 'creative';

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
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Professional template for business invoices',
      icon: <Layers className="h-5 w-5" />,
      gradient: 'from-blue-200 to-sky-50',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Colorful design for creative businesses',
      icon: <Palette className="h-5 w-5" />,
      gradient: 'from-pink-100 to-rose-50',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Select Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`
              relative rounded-lg cursor-pointer border p-3 transition-all
              ${selectedTemplate === template.id 
                ? 'border-primary ring-2 ring-primary/20 shadow-sm bg-primary/5' 
                : 'border-border hover:shadow-sm hover:bg-muted/20'}
            `}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            <div className={`h-20 w-full bg-gradient-to-br ${template.gradient} rounded-md mb-2 
              flex flex-col items-center justify-center text-sm text-muted-foreground p-2`}>
              <div className="bg-white/80 rounded-full p-2 mb-1">
                {template.icon}
              </div>
              <span className="text-xs font-medium">{template.name}</span>
            </div>
            <div className="text-xs font-medium">{template.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTemplates;
