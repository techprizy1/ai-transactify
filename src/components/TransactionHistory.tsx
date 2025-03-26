
import { useState } from 'react';
import { Transaction, TransactionType } from '@/lib/types';
import TransactionCard from './TransactionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  title?: string;
  filterTypes?: TransactionType[];
}

const TransactionHistory = ({ 
  transactions, 
  title = "Transaction History",
  filterTypes 
}: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter by search term and optionally by transaction type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterTypes || filterTypes.includes(transaction.type);
    
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-input"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
