
import React from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import ReportSummary from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, description: 'Sales Revenue', date: new Date().toISOString(), type: 'income', category: 'Sales', created_at: new Date().toISOString() },
  { id: '2', amount: 3000, description: 'Consulting Services', date: new Date().toISOString(), type: 'income', category: 'Services', created_at: new Date().toISOString() },
  { id: '3', amount: 1500, description: 'Rent', date: new Date().toISOString(), type: 'expense', category: 'Office', created_at: new Date().toISOString() },
  { id: '4', amount: 800, description: 'Utilities', date: new Date().toISOString(), type: 'expense', category: 'Office', created_at: new Date().toISOString() },
  { id: '5', amount: 1200, description: 'Salary', date: new Date().toISOString(), type: 'expense', category: 'Staff', created_at: new Date().toISOString() },
];

const BalanceSheet = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Balance Sheet</h1>
            
            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Balance Sheet Statement</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Assets</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Cash in Hand</td>
                          <td className="text-right">₹2,500.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Bank Account</td>
                          <td className="text-right">₹15,000.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Accounts Receivable</td>
                          <td className="text-right">₹3,000.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Equipment</td>
                          <td className="text-right">₹10,000.00</td>
                        </tr>
                        <tr className="font-medium">
                          <td className="py-2">Total Assets</td>
                          <td className="text-right">₹30,500.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Liabilities</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Accounts Payable</td>
                          <td className="text-right">₹2,000.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Loans</td>
                          <td className="text-right">₹8,000.00</td>
                        </tr>
                        <tr className="font-medium">
                          <td className="py-2">Total Liabilities</td>
                          <td className="text-right">₹10,000.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Equity</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Owner's Capital</td>
                          <td className="text-right">₹16,000.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Retained Earnings</td>
                          <td className="text-right">₹4,500.00</td>
                        </tr>
                        <tr className="font-medium">
                          <td className="py-2">Total Equity</td>
                          <td className="text-right">₹20,500.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Total Liabilities and Equity</h3>
                    <p className="text-xl font-semibold">₹30,500.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <ReportSummary transactions={mockTransactions} title="Balance Sheet" />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default BalanceSheet;
