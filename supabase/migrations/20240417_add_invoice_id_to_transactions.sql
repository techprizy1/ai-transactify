-- Add invoice_id column to transactions table
ALTER TABLE transactions
ADD COLUMN invoice_id UUID REFERENCES invoices(id);

-- Create an index on invoice_id for faster lookups
CREATE INDEX idx_transactions_invoice_id ON transactions(invoice_id);

-- Add a comment to explain the column
COMMENT ON COLUMN transactions.invoice_id IS 'Reference to the invoice this transaction is associated with'; 