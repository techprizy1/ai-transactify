
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Utility function to handle printing the current page
 */
export const printInvoice = (): void => {
  window.print();
};

/**
 * Utility function to create a PDF from the invoice and trigger download
 * This uses jsPDF to create a proper PDF document
 */
export const downloadInvoice = async (invoiceNumber: string): Promise<void> => {
  // Get the invoice element
  const invoiceElement = document.getElementById('invoice-preview');
  if (!invoiceElement) {
    console.error('Invoice element not found');
    return;
  }

  try {
    // Show a loading indicator (can be improved with a UI toast)
    const originalOpacity = invoiceElement.style.opacity;
    invoiceElement.style.opacity = '1';
    
    // Generate canvas from the invoice element
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Calculate PDF dimensions to match the aspect ratio of the invoice
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    
    // Add image to PDF (possibly spanning multiple pages if large)
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    
    // If the invoice is longer than one page, add more pages
    let heightLeft = imgHeight - pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(`Invoice-${invoiceNumber}.pdf`);
    
    // Restore original opacity
    invoiceElement.style.opacity = originalOpacity;
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
