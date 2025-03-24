
import { toast } from "sonner";
import { AITransactionResponse } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const analyzeTransaction = async (prompt: string): Promise<AITransactionResponse | null> => {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-transaction', {
      body: { prompt },
    });

    if (error) {
      console.error('Error calling analyze-transaction function:', error);
      toast.error('Failed to analyze transaction. Please try again.');
      return null;
    }

    if (data.error) {
      console.error('Error from analyze-transaction function:', data.error);
      toast.error('Failed to process transaction. Please try again.');
      return null;
    }

    // Return the parsed data
    return data as AITransactionResponse;
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    toast.error('Failed to analyze transaction. Please try again.');
    return null;
  }
};
