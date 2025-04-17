-- Drop existing table if it exists
DROP TABLE IF EXISTS invoices CASCADE;

-- Create new invoices table with correct structure
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  invoice_number VARCHAR(255) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on invoice_number for faster lookups
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Create an index on user_id for faster filtering by user
CREATE INDEX idx_invoices_user_id ON invoices(user_id);

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own invoices
CREATE POLICY "Users can only view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to only insert their own invoices
CREATE POLICY "Users can only insert their own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to only update their own invoices
CREATE POLICY "Users can only update their own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to only delete their own invoices
CREATE POLICY "Users can only delete their own invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id); 