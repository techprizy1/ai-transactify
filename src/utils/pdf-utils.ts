
/**
 * Utility function to handle printing the current page
 */
export const printInvoice = (): void => {
  window.print();
};

/**
 * Utility function to create a PDF from the invoice and trigger download
 * This uses the browser's print to PDF functionality
 */
export const downloadInvoice = (invoiceNumber: string): void => {
  // Set a filename in the print dialog
  const style = document.createElement('style');
  style.innerHTML = `@page { size: auto; margin: 10mm; }`;
  document.head.appendChild(style);
  
  // Change title temporarily to set filename
  const originalTitle = document.title;
  document.title = `Invoice-${invoiceNumber}.pdf`;
  
  // Print (user can save as PDF from print dialog)
  window.print();
  
  // Restore original title and remove style
  setTimeout(() => {
    document.title = originalTitle;
    document.head.removeChild(style);
  }, 100);
};
