
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create the create_invoice_counter function if it doesn't exist
    const { error: functionError } = await supabase.rpc('create_function_if_not_exists', {
      function_name: 'create_invoice_counter',
      function_body: `
        BEGIN
          CREATE TABLE IF NOT EXISTS public.invoice_counter (
            id SERIAL PRIMARY KEY,
            counter INTEGER NOT NULL DEFAULT 1
          );
          
          -- Insert default value if table is empty
          INSERT INTO public.invoice_counter (id, counter)
          SELECT 1, 1
          WHERE NOT EXISTS (SELECT 1 FROM public.invoice_counter WHERE id = 1);
          
          RETURN true;
        END;
      `
    });
    
    if (functionError) {
      throw new Error(`Error creating function: ${functionError.message}`);
    }
    
    // Create the create_invoices_table function if it doesn't exist
    const { error: invoicesFunctionError } = await supabase.rpc('create_function_if_not_exists', {
      function_name: 'create_invoices_table',
      function_body: `
        BEGIN
          CREATE TABLE IF NOT EXISTS public.invoices (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            invoice_number TEXT NOT NULL,
            data JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
          );
          
          -- Add RLS policies
          ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
          
          -- Create policy to allow users to select only their own invoices
          DROP POLICY IF EXISTS "Users can select their own invoices" ON public.invoices;
          CREATE POLICY "Users can select their own invoices" 
            ON public.invoices FOR SELECT 
            USING (auth.uid() = user_id);
          
          -- Create policy to allow users to insert their own invoices
          DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
          CREATE POLICY "Users can insert their own invoices" 
            ON public.invoices FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
          
          RETURN true;
        END;
      `
    });
    
    if (invoicesFunctionError) {
      throw new Error(`Error creating invoices function: ${invoicesFunctionError.message}`);
    }
    
    // Create the helper function if it doesn't exist
    const { error: helperFunctionError } = await supabase.rpc('create_function_if_not_exists', {
      function_name: 'create_function_if_not_exists',
      function_body: `
        BEGIN
          IF NOT EXISTS (
            SELECT 1 
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public'
            AND p.proname = function_name
          ) THEN
            EXECUTE 'CREATE OR REPLACE FUNCTION public.' || function_name || '() RETURNS BOOLEAN AS $func$' || function_body || '$func$ LANGUAGE plpgsql;';
          END IF;
          
          RETURN true;
        END;
      `
    });
    
    if (helperFunctionError && helperFunctionError.message !== 'function create_function_if_not_exists() does not exist') {
      throw new Error(`Error creating helper function: ${helperFunctionError.message}`);
    }
    
    // Call the functions to create tables
    const { error: counterError } = await supabase.rpc('create_invoice_counter');
    if (counterError) {
      throw new Error(`Error creating invoice counter table: ${counterError.message}`);
    }
    
    const { error: invoicesError } = await supabase.rpc('create_invoices_table');
    if (invoicesError) {
      throw new Error(`Error creating invoices table: ${invoicesError.message}`);
    }
    
    return new Response(
      JSON.stringify({ message: "Invoice tables setup successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in setup-invoice-tables function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
