
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface PurchaseOrderItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface PurchaseOrderData {
  supplier_name: string;
  items: PurchaseOrderItem[];
  delivery_date: string;
  payment_terms: string;
  shipping_address: string;
  total_amount: number;
}

export const analyzePurchaseOrder = async (prompt: string): Promise<PurchaseOrderData | null> => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-purchase-order', {
      body: { prompt },
    });

    if (error) {
      console.error('Error calling analyze-purchase-order function:', error);
      toast.error('Failed to analyze purchase order. Please try again.');
      return null;
    }

    if (data.error) {
      console.error('Error from analyze-purchase-order function:', data.error);
      toast.error('Failed to process purchase order. Please try again.');
      return null;
    }

    // Return the parsed data
    return data as PurchaseOrderData;
  } catch (error) {
    console.error('Error analyzing purchase order:', error);
    toast.error('Failed to analyze purchase order. Please try again.');
    return null;
  }
};
