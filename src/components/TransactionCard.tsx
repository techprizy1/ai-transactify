
import { Transaction } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, ArrowUp, ArrowDown, ShoppingCart, DollarSign, Pencil, Trash2 } from 'lucide-react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';

interface TransactionCardProps {
  transaction: Transaction;
  onTransactionUpdated?: () => void;
}

const TransactionCard = ({ transaction, onTransactionUpdated }: TransactionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatedTransaction, setUpdatedTransaction] = useState({ ...transaction });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleSaveEdit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          description: updatedTransaction.description,
          amount: updatedTransaction.amount,
          category: updatedTransaction.category,
          type: updatedTransaction.type
        })
        .eq('id', transaction.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Transaction updated successfully');
      setIsEditing(false);
      if (onTransactionUpdated) onTransactionUpdated();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Transaction deleted successfully');
      setIsDeleting(false);
      if (onTransactionUpdated) onTransactionUpdated();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setIsLoading(false);
    }
  };
  
  const timeAgo = formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true });
  
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
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
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={handleEdit} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </ContextMenuItem>
          <ContextMenuItem onSelect={handleDelete} className="cursor-pointer text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Input
                id="description"
                value={updatedTransaction.description}
                onChange={(e) => setUpdatedTransaction({...updatedTransaction, description: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">Amount</label>
              <Input
                id="amount"
                type="number"
                value={updatedTransaction.amount}
                onChange={(e) => setUpdatedTransaction({...updatedTransaction, amount: parseFloat(e.target.value)})}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Input
                id="category"
                value={updatedTransaction.category}
                onChange={(e) => setUpdatedTransaction({...updatedTransaction, category: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">Type</label>
              <Select
                value={updatedTransaction.type}
                onValueChange={(value) => setUpdatedTransaction({
                  ...updatedTransaction, 
                  type: value as 'income' | 'expense' | 'purchase' | 'sale'
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionCard;
