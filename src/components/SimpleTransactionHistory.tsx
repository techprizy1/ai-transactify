import { useState } from 'react';
import { Transaction } from '@/lib/types';
import TransactionCard from './TransactionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

interface SimpleTransactionHistoryProps {
  transactions: Transaction[];
  title?: string;
  onTransactionUpdated?: () => void;
}

const SimpleTransactionHistory = ({ 
  transactions,
  title = "Transaction History",
  onTransactionUpdated
}: SimpleTransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  // Simple filtering based on search term and date range
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const transactionDate = new Date(transaction.date);
      const startDate = startOfDay(dateRange.from);
      const endDate = endOfDay(dateRange.to);
      
      matchesDate = isWithinInterval(transactionDate, {
        start: startDate,
        end: endDate
      });
    }
    
    return matchesSearch && matchesDate;
  });
  
  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-4">
          <div className="flex w-full sm:w-auto items-center space-x-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by description or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-input"
              />
            </div>
          </div>
          
          <div className="flex w-full sm:w-auto items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to 
                    ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                    : 'Filter by date range'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange({
                    from: range?.from,
                    to: range?.to
                  })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {(dateRange.from || dateRange.to) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard 
              key={transaction.id} 
              transaction={transaction} 
              onTransactionUpdated={onTransactionUpdated} 
            />
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

export default SimpleTransactionHistory; 