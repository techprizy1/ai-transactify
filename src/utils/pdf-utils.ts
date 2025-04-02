
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

/**
 * Utility function to handle printing the current page
 */
export const printInvoice = (): void => {
  window.print();
};

/**
 * Utility function to create a PDF from the invoice and trigger download
 * This uses jsPDF to create a proper PDF document with enhanced quality
 */
export const downloadInvoice = async (invoiceNumber: string): Promise<void> => {
  // Get the invoice element
  const invoiceElement = document.getElementById('invoice-preview');
  if (!invoiceElement) {
    console.error('Invoice element not found');
    toast.error('Could not generate PDF: Invoice element not found');
    return;
  }

  try {
    // Prepare the element for high-quality capture
    const originalStyles = {
      opacity: invoiceElement.style.opacity,
      transform: invoiceElement.style.transform,
      transition: invoiceElement.style.transition,
      boxShadow: invoiceElement.style.boxShadow,
    };
    
    // Enhance for PDF capture
    invoiceElement.style.opacity = '1';
    invoiceElement.style.transform = 'none';
    invoiceElement.style.transition = 'none';
    invoiceElement.style.boxShadow = 'none';
    
    // Generate canvas with higher quality settings
    const canvas = await html2canvas(invoiceElement, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      windowWidth: invoiceElement.scrollWidth,
      windowHeight: invoiceElement.scrollHeight,
    });
    
    // Calculate PDF dimensions to match the aspect ratio of the invoice
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Create PDF document with better formatting
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    
    // Set document properties
    pdf.setProperties({
      title: `Invoice-${invoiceNumber}`,
      subject: 'Invoice Document',
      creator: 'AI Invoice Generator',
    });
    
    let position = 0;
    
    // Add image to PDF with better positioning
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    
    // Add multiple pages if needed
    let heightLeft = imgHeight - pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF with better naming
    pdf.save(`Invoice-${invoiceNumber}-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    // Restore original styles
    invoiceElement.style.opacity = originalStyles.opacity;
    invoiceElement.style.transform = originalStyles.transform;
    invoiceElement.style.transition = originalStyles.transition;
    invoiceElement.style.boxShadow = originalStyles.boxShadow;
    
    toast.success('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF');
  }
};
