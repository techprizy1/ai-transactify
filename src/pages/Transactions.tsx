
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import TransactionInput from '@/components/TransactionInput';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction, AITransactionResponse } from '@/lib/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Load transactions from database on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setTransactions(data as Transaction[]);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);
  
  const handleTransactionCreated = async (aiResponse: AITransactionResponse) => {
    if (!user) {
      toast.error('You must be logged in to create transactions');
      return;
    }
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: aiResponse.description,
      amount: aiResponse.amount,
      type: aiResponse.type,
      category: aiResponse.category,
      date: aiResponse.date,
      created_at: new Date().toISOString(),
      user_id: user.id
    };
    
    try {
      // Insert the transaction into the database
      const { error } = await supabase
        .from('transactions')
        .insert([{
          description: newTransaction.description,
          amount: newTransaction.amount,
          type: newTransaction.type,
          category: newTransaction.category,
          date: newTransaction.date,
          user_id: user.id
        }]);
        
      if (error) {
        throw error;
      }
      
      // Refresh the transactions list
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        throw fetchError;
      }
      
      setTransactions(data as Transaction[]);
      toast.success('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };
  
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto max-w-5xl px-4 py-10">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight">New Transaction</h1>
              <p className="mt-2 text-muted-foreground">
                Describe your transaction in natural language and our AI will do the rest
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <TransactionInput onTransactionCreated={handleTransactionCreated} />
                
                <div className="glass-panel p-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">Example phrases</h2>
                  <div className="space-y-3">
                    {[
                      "Paid ₹3500 for dinner with client at Taj Hotel yesterday",
                      "Received ₹85000 payment from client ABC Corp for web design services",
                      "Purchased new office chair from Amazon for ₹12999",
                      "Spent ₹5000 on petrol for company vehicle on April 10th",
                      "Sold products to customer XYZ for ₹45000 last Monday"
                    ].map((example, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-muted/50 rounded-md text-sm cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(example);
                          toast.success('Example copied to clipboard');
                        }}
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <TransactionHistory 
                  transactions={transactions} 
                  fetchTransactions={true}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Transactions;
