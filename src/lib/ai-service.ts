
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AITransactionResponse } from './types';

export const analyzeTransaction = async (prompt: string): Promise<AITransactionResponse | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-transaction', {
      body: { prompt },
    });

    if (error) {
      console.error('Error analyzing transaction:', error);
      throw error;
    }

    if (data.error) {
      toast.error(data.error);
      throw new Error(data.error);
    }

    return data as AITransactionResponse;
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    throw error;
  }
};
