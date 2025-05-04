
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          business_name: string
          business_address: string
          contact_number: string
          gstn_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string
          last_name?: string
          business_name?: string
          business_address?: string
          contact_number?: string
          gstn_number?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          business_name?: string
          business_address?: string
          contact_number?: string
          gstn_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          invoice_number: string
          date: string
          due_date: string
          bill_to: Json
          items: Json
          subtotal: number
          tax_rate: number
          tax_amount: number
          total: number
          business_info: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_number: string
          date: string
          due_date: string
          bill_to: Json
          items: Json
          subtotal: number
          tax_rate: number
          tax_amount: number
          total: number
          business_info?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_number?: string
          date?: string
          due_date?: string
          bill_to?: Json
          items?: Json
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total?: number
          business_info?: Json
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          date: string
          description: string
          amount: number
          type: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          description: string
          amount: number
          type: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          description?: string
          amount?: number
          type?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      purchase_orders: {
        Row: {
          id: string
          supplier: string
          delivery_date: string
          items: Json
          total_amount: number
          status: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          supplier: string
          delivery_date: string
          items: Json
          total_amount: number
          status: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          supplier?: string
          delivery_date?: string
          items?: Json
          total_amount?: number
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 
