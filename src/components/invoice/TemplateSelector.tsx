
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import InvoiceTemplates, { InvoiceTemplateType } from '@/components/InvoiceTemplates';

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplateType;
  onSelectTemplate: (template: InvoiceTemplateType) => void;
}

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
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
          onSelectTemplate={onSelectTemplate}
        />
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
