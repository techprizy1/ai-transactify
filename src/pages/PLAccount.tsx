
import React from 'react';
import { SidebarInset } from "@/components/ui/sidebar";
import { ReportSummary } from '@/components/report/ReportSummary';
import { Transaction } from '@/lib/types';

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, description: 'Sales Revenue', date: new Date().toISOString(), type: 'income', category: 'Sales' },
  { id: '2', amount: 3000, description: 'Consulting Services', date: new Date().toISOString(), type: 'income', category: 'Services' },
  { id: '3', amount: 1500, description: 'Rent', date: new Date().toISOString(), type: 'expense', category: 'Office' },
  { id: '4', amount: 800, description: 'Utilities', date: new Date().toISOString(), type: 'expense', category: 'Office' },
  { id: '5', amount: 1200, description: 'Salary', date: new Date().toISOString(), type: 'expense', category: 'Staff' },
];

const PLAccount = () => {
  return (
    <SidebarInset>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Profit & Loss Account</h1>
            
            <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Profit & Loss Statement</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Revenue</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left py-2">Category</th>
                          <th className="text-right py-2">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Sales Revenue</td>
                          <td className="text-right">₹5,000.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Consulting Services</td>
                          <td className="text-right">₹3,000.00</td>
                        </tr>
                        <tr className="font-medium">
                          <td className="py-2">Total Revenue</td>
                          <td className="text-right">₹8,000.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Expenses</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left py-2">Category</th>
                          <th className="text-right py-2">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Rent</td>
                          <td className="text-right">₹1,500.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Utilities</td>
                          <td className="text-right">₹800.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2">Salary</td>
                          <td className="text-right">₹1,200.00</td>
                        </tr>
                        <tr className="font-medium">
                          <td className="py-2">Total Expenses</td>
                          <td className="text-right">₹3,500.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Net Profit</h3>
                    <p className="text-xl font-semibold text-emerald-600">₹4,500.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <ReportSummary transactions={mockTransactions} title="P&L" />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default PLAccount;
