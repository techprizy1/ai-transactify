import { Transaction } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, ArrowUp, ArrowDown, ShoppingCart, DollarSign } from 'lucide-react';

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'income':
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case 'expense':
        return <ArrowUp className="h-5 w-5 text-red-500" />;
      case 'purchase':
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case 'sale':
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      default:
        return <ChevronRight className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getTypeLabel = () => {
    switch (transaction.type) {
      case 'income':
        return 'Income';
      case 'expense':
        return 'Expense';
      case 'purchase':
        return 'Purchase';
      case 'sale':
        return 'Sale';
      default:
        return transaction.type;
    }
  };
  
  const getAmountClass = () => {
    switch (transaction.type) {
      case 'income':
      case 'sale':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
      case 'purchase':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-foreground';
    }
  };
  
  const getAmountSign = () => {
    switch (transaction.type) {
      case 'income':
      case 'sale':
        return '+';
      case 'expense':
      case 'purchase':
        return '-';
      default:
        return '';
    }
  };
  
  const timeAgo = formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true });
  
  return (
    <div className="glass-panel p-4 transition-all duration-300 hover:shadow-md cursor-pointer group">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-medium truncate">{transaction.description}</h3>
              <p className="text-xs text-muted-foreground mt-1">{transaction.category} • {timeAgo}</p>
            </div>
            <div className={`text-right ${getAmountClass()}`}>
              <p className="text-base font-semibold">{getAmountSign()}₹{transaction.amount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{getTypeLabel()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
