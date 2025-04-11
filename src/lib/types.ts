export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: string;
  amount: number;
}

export interface BusinessInfo {
  business_name: string | null;
  business_address: string | null;
  contact_number: string | null;
  gstn_number: string | null;
}
