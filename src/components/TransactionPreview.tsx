
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Transaction } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TransactionPreviewProps {
  transaction: Partial<Transaction>;
  onConfirm: () => void;
  onCancel: () => void;
}

const TransactionPreview = ({ transaction, onConfirm, onCancel }: TransactionPreviewProps) => {
  const getTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'income':
      case 'sale':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
      case 'purchase':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="shadow-md animate-fade-in border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Transaction Preview</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className={`font-medium ${getTypeColor(transaction.type)}`}>
                {transaction.type ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) : ''}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="font-medium">
                ₹{transaction.amount?.toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="font-medium">{transaction.category}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="font-medium">{transaction.date}</p>
            </div>
            
            <div className="col-span-2 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="font-medium">{transaction.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </Button>
        <Button 
          size="sm" 
          onClick={onConfirm}
          className="flex items-center gap-1" 
        >
          <Check className="h-4 w-4" />
          <span>Confirm & Save</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionPreview;
