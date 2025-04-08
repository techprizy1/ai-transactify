
import React from 'react';
import { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import '../../styles/invoice.css';

interface InvoiceTemplateProps {
  businessName: string;
  businessAddress: string;
  contactNumber: string;
  transactions: Transaction[];
  invoiceNumber: string;
  invoiceDate: Date;
  recipient?: string;
  recipientAddress?: string;
  gstnNumber?: string;
}

const InvoiceTemplate = ({
  businessName,
  businessAddress,
  contactNumber,
  transactions,
  invoiceNumber,
  invoiceDate,
  recipient,
  recipientAddress,
  gstnNumber,
}: InvoiceTemplateProps) => {
  // Calculate financial summary
  const incomeTransactions = transactions.filter(t => t.type === 'income' || t.type === 'sale');
  const expenseTransactions = transactions.filter(t => t.type === 'expense' || t.type === 'purchase');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const isProfitable = netProfit >= 0;

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="invoice-company">
          <h1>{businessName}</h1>
          {gstnNumber && <p className="gstn-number">GSTN: {gstnNumber}</p>}
          <p>{businessAddress}</p>
          <p>Contact: {contactNumber}</p>
        </div>
        <div className="invoice-details">
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> {invoiceNumber}</p>
          <p><strong>Date:</strong> {format(invoiceDate, 'dd/MM/yyyy')}</p>
        </div>
      </div>

      {recipient && (
        <div className="invoice-recipient">
          <h3>Bill To:</h3>
          <p>{recipient}</p>
          {recipientAddress && <p>{recipientAddress}</p>}
        </div>
      )}
      
      {/* Financial Report Header */}
      <div className="financial-report-header">
        <h3>Financial Summary</h3>
        <div className="financial-summary">
          <div className="summary-item">
            <span>Total Income:</span>
            <span className="income-amount">₹{totalIncome.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Total Expenses:</span>
            <span className="expense-amount">₹{totalExpenses.toFixed(2)}</span>
          </div>
          <div className="summary-item net-result">
            <span>Net Profit/Loss:</span>
            <span className={isProfitable ? 'profit-amount' : 'loss-amount'}>
              ₹{Math.abs(netProfit).toFixed(2)} {isProfitable ? '(Profit)' : '(Loss)'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="invoice-items">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>{transaction.type}</td>
                <td className="amount">₹{transaction.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}><strong>Total</strong></td>
              <td className="amount"><strong>₹{(totalIncome - totalExpenses).toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="invoice-footer">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
