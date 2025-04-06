
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AITransactionResponse } from '@/lib/types';
import { analyzeTransaction } from '@/lib/ai-service';
import { SendHorizontal, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import the Badge from our custom implementation that supports the "premium" variant
import { Badge } from "@/components/Badge";

interface TransactionInputProps {
  onTransactionCreated: (transaction: AITransactionResponse) => void;
}

const TransactionInput = ({ onTransactionCreated }: TransactionInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { checkTransactionLimit, isPro, upgradeAccount } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a transaction description');
      return;
    }
    
    // First check if user has reached transaction limit
    const canCreateTransaction = await checkTransactionLimit();
    if (!canCreateTransaction) {
      toast.error('Transaction limit reached for free users');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeTransaction(prompt);
      
      if (result) {
        onTransactionCreated(result);
        setPrompt('');
        toast.success('Transaction analyzed successfully');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Failed to process transaction');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">New Transaction</h2>
      
      {/* Show Pro badge if user is a pro user */}
      {isPro && (
        <div className="mb-4 flex items-center">
          <Badge variant="premium" className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> PRO
          </Badge>
          <span className="text-xs ml-2 text-muted-foreground">Unlimited transactions</span>
        </div>
      )}
      
      {/* Show limit warning for free users */}
      {!isPro && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <AlertTitle>Free Account</AlertTitle>
          <AlertDescription>
            You can create up to 5 transactions with a free account. 
            <Button 
              variant="link" 
              onClick={upgradeAccount} 
              className="p-0 h-auto text-amber-500 font-semibold"
            >
              Upgrade to Pro
            </Button> for unlimited transactions.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="transaction-input" className="text-sm font-medium">
            Describe your transaction in natural language
          </label>
          <Textarea
            id="transaction-input"
            placeholder="Example: Paid ₹8500 for office supplies at Reliance Digital on March 15th"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full relative overflow-hidden btn-hover-effect" 
            disabled={isAnalyzing || !prompt.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing transaction...
              </>
            ) : (
              <>
                Analyze transaction
                <SendHorizontal className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Our AI will automatically categorize your transaction based on your description.</p>
        </div>
      </form>
    </div>
  );
};

export default TransactionInput;
