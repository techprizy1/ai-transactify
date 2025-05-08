
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AITransactionResponse, Transaction } from '@/lib/types';
import { analyzeTransaction } from '@/lib/ai-service';
import { SendHorizontal, Loader2, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import TransactionPreview from './TransactionPreview';
import { supabase } from '@/integrations/supabase/client';

interface TransactionInputProps {
  onTransactionCreated: (transaction: AITransactionResponse) => void;
}

const TransactionInput = ({ onTransactionCreated }: TransactionInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewTransaction, setPreviewTransaction] = useState<AITransactionResponse | null>(null);
  const [transactionCount, setTransactionCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const { user } = useAuth();
  
  // Check if user is on Pro plan and get their daily transaction count
  useEffect(() => {
    if (user) {
      // Check for Pro status from localStorage (temporary solution, could be replaced with DB check)
      const proStatus = localStorage.getItem('isPro') === 'true';
      setIsPro(proStatus);
      
      // If not Pro, get count of today's transactions
      if (!proStatus) {
        const fetchTodayTransactions = async () => {
          const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
          
          const { data, error } = await supabase
            .from('transactions')
            .select('id')
            .eq('user_id', user.id)
            .gte('created_at', today); // Get transactions created today or later
            
          if (!error && data) {
            setTransactionCount(data.length);
          }
        };
        
        fetchTodayTransactions();
      }
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a transaction description');
      return;
    }
    
    // Check transaction limit for Beta users
    if (!isPro && transactionCount >= 5) {
      toast.error('You have reached your daily limit of 5 transactions. Upgrade to Pro for unlimited transactions.');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeTransaction(prompt);
      
      if (result) {
        // Show preview instead of immediately creating the transaction
        setPreviewTransaction(result);
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Failed to process transaction');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmTransaction = () => {
    if (previewTransaction) {
      onTransactionCreated(previewTransaction);
      setPrompt('');
      setPreviewTransaction(null);
      
      // Increment transaction count for Beta users
      if (!isPro) {
        setTransactionCount(prevCount => prevCount + 1);
      }
      
      toast.success('Transaction saved successfully');
    }
  };
  
  const handleCancelTransaction = () => {
    setPreviewTransaction(null);
    toast.info('Transaction cancelled');
  };
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">New Transaction</h2>
        
        {/* Subscription status */}
        <div className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
          isPro ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {isPro ? (
            <>
              <Crown className="h-4 w-4" />
              <span>Pro</span>
            </>
          ) : (
            <>
              <span>Beta</span>
              <span className="opacity-75">({5 - transactionCount} left today)</span>
            </>
          )}
        </div>
      </div>
      
      {previewTransaction ? (
        <TransactionPreview 
          transaction={previewTransaction} 
          onConfirm={handleConfirmTransaction}
          onCancel={handleCancelTransaction}
        />
      ) : (
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
              disabled={isAnalyzing || !prompt.trim() || (!isPro && transactionCount >= 5)}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Record transaction...
                </>
              ) : (
                <>
                  Record transaction
                  <SendHorizontal className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Our AI will automatically categorize your transaction based on your description.</p>
            {!isPro && (
              <p className="mt-2 text-amber-600">
                Beta users can create up to 5 transactions per day. 
                <Button variant="link" className="p-0 h-auto text-amber-600 font-medium" onClick={() => {
                  localStorage.setItem('isPro', 'true');
                  setIsPro(true);
                  toast.success('Upgraded to Pro version!');
                }}>
                  Upgrade to Pro
                </Button>
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default TransactionInput;
