import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import PurchaseOrderPreview from '@/components/PurchaseOrderPreview';
import { PurchaseOrder } from '@/lib/types';

interface PurchaseOrderItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

const PurchaseOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<PurchaseOrderItem[]>([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  const [supplier, setSupplier] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [previewOrder, setPreviewOrder] = useState<PurchaseOrder | null>(null);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Calculate amount if quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = Number(newItems[index].quantity) * Number(newItems[index].unitPrice);
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
      
      // Create preview order
      const newOrder: PurchaseOrder = {
        id: Date.now().toString(), // Temporary ID for preview
        supplier,
        deliveryDate,
        items,
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Show preview
      setPreviewOrder(newOrder);

      toast.success('Purchase order created successfully');
      // Reset form
      setItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
      setSupplier('');
      setDeliveryDate('');
      setNotes('');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Failed to create purchase order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main className="container mx-auto max-w-6xl px-4 py-10">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
              <p className="mt-2 text-muted-foreground">
                Create and manage your purchase orders
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-panel p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="supplier" className="text-sm font-medium">
                        Supplier Name
                      </label>
                      <Input
                        id="supplier"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        placeholder="Enter supplier name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="deliveryDate" className="text-sm font-medium">
                        Delivery Date
                      </label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Items</h3>
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quantity</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Unit Price</label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount</label>
                          <Input
                            value={item.amount}
                            disabled
                            className="bg-muted"
                          />
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              className="mt-2"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddItem}
                      className="w-full"
                    >
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes
                    </label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes or instructions"
                      rows={3}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Purchase Order...
                        </>
                      ) : (
                        'Create Purchase Order'
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {previewOrder && (
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-semibold mb-4">Preview</h2>
                  <PurchaseOrderPreview order={previewOrder} />
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setPreviewOrder(null)}
                    >
                      Close Preview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PurchaseOrders;
