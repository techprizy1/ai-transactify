/*
  # Create invoice tables and functions
  
  1. New Tables
    - `invoice_counter`
      - `id` (serial, primary key)
      - `counter` (integer, not null)
    - `invoices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `invoice_number` (text, not null)
      - `date` (date, not null)
      - `due_date` (date, not null)
      - `bill_to` (jsonb, not null)
      - `items` (jsonb, not null)
      - `subtotal` (numeric, not null)
      - `tax_rate` (numeric, not null)
      - `tax_amount` (numeric, not null)
      - `total` (numeric, not null)
      - `created_at` (timestamptz, default now())
      
  2. Security
    - Enable RLS on `invoices` table
    - Add policies for authenticated users to:
      - Select their own invoices
      - Insert their own invoices
      - Update their own invoices
      
  3. Functions
    - Create helper function for creating other functions if they don't exist
    - Create function to initialize invoice counter
    - Create function to set up invoices table
*/

-- Create helper function
CREATE OR REPLACE FUNCTION public.create_function_if_not_exists(
  function_name text,
  function_body text
) RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;

-- Create invoice counter table
CREATE TABLE IF NOT EXISTS public.invoice_counter (
  id SERIAL PRIMARY KEY,
  counter INTEGER NOT NULL DEFAULT 1
);

-- Insert initial counter if table is empty
INSERT INTO public.invoice_counter (id, counter)
SELECT 1, 1
WHERE NOT EXISTS (SELECT 1 FROM public.invoice_counter WHERE id = 1);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  bill_to JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax_rate NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own invoices"
  ON public.invoices
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoices"
  ON public.invoices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON public.invoices
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);