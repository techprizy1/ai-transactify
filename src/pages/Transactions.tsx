
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import TransactionInput from '@/components/TransactionInput';
import TransactionHistory from '@/components/TransactionHistory';
import { Transaction, AITransactionResponse } from '@/lib/types';
import { toast } from 'sonner';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const handleTransactionCreated = (aiResponse: AITransactionResponse) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: aiResponse.description,
      amount: aiResponse.amount,
      type: aiResponse.type,
      category: aiResponse.category,
      date: aiResponse.date,
      created_at: new Date().toISOString(),
    };
    
    setTransactions([newTransaction, ...transactions]);
  };
  
  return (
    <div className="min-h-screen pt-20">
      <Navbar />
      
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
            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
