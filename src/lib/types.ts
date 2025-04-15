export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  created_at: string;
  user_id?: string;
}

export type TransactionType = 'income' | 'expense' | 'purchase' | 'sale';

export interface AITransactionResponse {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface BusinessProfile {
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  billTo: {
    name: string;
    address: string;
    email?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  businessInfo?: BusinessInfo;
}

export interface BusinessInfo {
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
  gstn_number: string | null;
}

export interface StoredInvoice {
  id: string;
  invoice_number: string;
  data: InvoiceData;
  created_at: string;
  user_id: string;
}

export interface PurchaseOrderItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  deliveryDate: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
