import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

/**
 * A4 paper constants in different units
 */
const A4 = {
  width_mm: 210,
  height_mm: 297,
  width_px: 595, // A4 width in pixels at 72 DPI
  height_px: 842, // A4 height in pixels at 72 DPI
  margin_mm: 15, // Standardized margin
  dpi: 72,
  pxPerMm: 72 / 25.4 // Convert mm to pixels at 72 DPI
};

/**
 * Utility function to handle printing the current page with properly aligned invoice
 */
export const printInvoice = (): void => {
  // Add print-specific styling to ensure proper alignment
  const style = document.createElement('style');
  style.id = 'print-style';
  style.innerHTML = `
    @media print {
      @page {
        size: A4 portrait;
        margin: ${A4.margin_mm}mm;
      }
      body {
        margin: 0;
        padding: 0;
      }
      body * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      #invoice-preview {
        width: ${A4.width_mm - (2 * A4.margin_mm)}mm !important;
        height: auto !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
        overflow: visible !important;
      }
      #invoice-preview * {
        box-sizing: border-box !important;
      }
      #invoice-preview table {
        width: 100% !important;
        table-layout: fixed !important;
      }
      #invoice-preview table td, 
      #invoice-preview table th {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Apply alignment fixes before printing
  const invoiceElement = document.getElementById('invoice-preview');
  if (invoiceElement) {
    // Store original styles
    const originalStyles = {
      width: invoiceElement.style.width,
      margin: invoiceElement.style.margin,
      padding: invoiceElement.style.padding,
      position: invoiceElement.style.position,
      boxSizing: invoiceElement.style.boxSizing,
      overflow: invoiceElement.style.overflow
    };
    
    // Apply optimized styling for print
    Object.assign(invoiceElement.style, {
      width: `${A4.width_mm - (2 * A4.margin_mm)}mm`,
      margin: '0 auto',
      padding: '0',
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'visible'
    });
    
    // Fix table alignments if they exist
    const tables = invoiceElement.querySelectorAll('table');
    tables.forEach(table => {
      table.style.width = '100%';
      table.style.tableLayout = 'fixed';
    });
    
    // Trigger print dialog
    window.print();
    
    // Restore original styles after printing
    setTimeout(() => {
      Object.assign(invoiceElement.style, originalStyles);
      const printStyle = document.getElementById('print-style');
      if (printStyle) {
        printStyle.remove();
      }
    }, 1000);
  } else {
    toast.error('Invoice element not found');
    window.print();
  }
};

/**
 * Utility function to create a PDF from the invoice with proper alignment and trigger download
 */
export const downloadInvoice = async (invoiceNumber: string): Promise<void> => {
  const invoiceElement = document.getElementById('invoice-preview');
  if (!invoiceElement) {
    console.error('Invoice element not found');
    toast.error('Could not generate PDF: Invoice element not found');
    return;
  }

  try {
    const loadingToast = toast.loading('Generating your PDF...');

    // Calculate content area with proper margins
    const contentArea = {
      width: Math.floor(A4.width_px - (2 * A4.margin_mm * A4.pxPerMm)),
      height: Math.floor(A4.height_px - (2 * A4.margin_mm * A4.pxPerMm))
    };

    // Create a clone of the invoice element to avoid modifying the original
    const invoiceClone = invoiceElement.cloneNode(true) as HTMLElement;
    
    // Create container with A4 dimensions
    const container = document.createElement('div');
    container.style.width = `${A4.width_px}px`;
    container.style.height = `${A4.height_px}px`;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.backgroundColor = '#ffffff';
    container.style.overflow = 'hidden';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    document.body.appendChild(container);
    
    // Style the cloned element for optimal rendering and alignment
    Object.assign(invoiceClone.style, {
      width: `${contentArea.width}px`,
      maxWidth: `${contentArea.width}px`,
      margin: `${A4.margin_mm * A4.pxPerMm}px auto`,
      padding: '0',
      fontSize: '14px',
      lineHeight: '1.4',
      color: '#000',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      position: 'relative',
      top: '0',
      left: '0',
      transformOrigin: 'top center',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale'
    });
    
    // Fix tables and other alignment issues in the clone
    const tables = invoiceClone.querySelectorAll('table');
    tables.forEach(table => {
      table.style.width = '100%';
      table.style.tableLayout = 'fixed';
      
      // Ensure cells handle overflow properly
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        (cell as HTMLElement).style.wordWrap = 'break-word';
        (cell as HTMLElement).style.overflowWrap = 'break-word';
      });
    });
    
    // Ensure all images and logos are properly sized and aligned
    const images = invoiceClone.querySelectorAll('img');
    images.forEach(img => {
      if (img.classList.contains('logo') || img.id === 'logo') {
        img.style.maxHeight = '80px';
      }
      img.style.maxWidth = '100%';
    });
    
    // Fix alignment of header and footer sections
    const headers = invoiceClone.querySelectorAll('.invoice-header, header, .header');
    headers.forEach(header => {
      (header as HTMLElement).style.display = 'flex';
      (header as HTMLElement).style.justifyContent = 'space-between';
      (header as HTMLElement).style.alignItems = 'center';
      (header as HTMLElement).style.width = '100%';
    });
    
    // Ensure consistent text alignment for specific elements
    const rightAlignElements = invoiceClone.querySelectorAll('.text-right, .amount, .total, .subtotal, .tax');
    rightAlignElements.forEach(el => {
      (el as HTMLElement).style.textAlign = 'right';
    });
    
    // Center align specific elements
    const centerAlignElements = invoiceClone.querySelectorAll('.text-center, .invoice-title');
    centerAlignElements.forEach(el => {
      (el as HTMLElement).style.textAlign = 'center';
    });
    
    // Calculate and apply optimal scaling while maintaining alignment
    const originalWidth = invoiceClone.offsetWidth;
    const originalHeight = invoiceClone.offsetHeight;
    
    // Determine if content needs scaling
    if (originalWidth > contentArea.width || originalHeight > contentArea.height) {
      const scaleX = contentArea.width / originalWidth;
      const scaleY = contentArea.height / originalHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      
      invoiceClone.style.transform = `scale(${scale})`;
      
      // Adjust container height if needed for multi-page documents
      if (originalHeight * scale > contentArea.height) {
        const pageCount = Math.ceil((originalHeight * scale) / contentArea.height);
        if (pageCount > 1) {
          container.style.height = `${A4.height_px * pageCount}px`;
        }
      }
    }
    
    container.appendChild(invoiceClone);

    // Apply any necessary font or image pre-loading
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate canvas with high quality settings
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Additional styling can be applied to the cloned document
        const styles = clonedDoc.createElement('style');
        styles.innerHTML = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          table {
            width: 100% !important;
            table-layout: fixed !important;
          }
          td, th {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .text-right, .amount, .total, .subtotal, .tax {
            text-align: right !important;
          }
          .text-center, .invoice-title {
            text-align: center !important;
          }
          @page {
            size: ${A4.width_mm}mm ${A4.height_mm}mm;
            margin: 0;
          }
        `;
        clonedDoc.head.appendChild(styles);
      }
    });

    // Create PDF with exact A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 16,
      hotfixes: ['px_scaling']
    });

    // Calculate how many pages are needed
    const pageHeight = canvas.height;
    const pagesCount = Math.ceil(pageHeight / A4.height_px);

    // Generate multi-page PDF if needed
    for (let i = 0; i < pagesCount; i++) {
      // For pages after the first page, add a new page
      if (i > 0) {
        pdf.addPage();
      }

      // Calculate which portion of the canvas to use for this page
      const sourceY = i * A4.height_px;
      const remainingHeight = pageHeight - sourceY;
      const sourceHeight = Math.min(remainingHeight, A4.height_px);

      // Add image for this page with proper centering
      pdf.addImage(
        canvas,
        'PNG',
        0,
        0,
        A4.width_mm,
        (sourceHeight * A4.width_mm) / A4.width_px,
        undefined,
        'FAST'
      );
    }

    // Clean up
    document.body.removeChild(container);

    // Optimize file name with proper formatting
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `Invoice-${invoiceNumber.replace(/[^\w-]/g, '')}-${dateStr}.pdf`;
    
    // Save and provide user feedback
    pdf.save(fileName);
    toast.dismiss(loadingToast);
    toast.success('Your invoice has been generated!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Utility function to preview the invoice with proper alignment
 */
export const previewInvoice = (): void => {
  const invoiceElement = document.getElementById('invoice-preview');
  if (!invoiceElement) {
    toast.error('Preview not available: Invoice element not found');
    return;
  }

  // Create a modal container for preview
  const modalContainer = document.createElement('div');
  modalContainer.style.position = 'fixed';
  modalContainer.style.top = '0';
  modalContainer.style.left = '0';
  modalContainer.style.width = '100%';
  modalContainer.style.height = '100%';
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modalContainer.style.zIndex = '9999';
  modalContainer.style.display = 'flex';
  modalContainer.style.justifyContent = 'center';
  modalContainer.style.alignItems = 'center';
  modalContainer.style.padding = '20px';
  modalContainer.style.boxSizing = 'border-box';
  modalContainer.style.overflow = 'auto';

  // Create a paper-like container with A4 proportions
  const previewContainer = document.createElement('div');
  previewContainer.style.backgroundColor = 'white';
  previewContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
  previewContainer.style.width = '100%';
  previewContainer.style.maxWidth = `${A4.width_mm * 2}px`;  // Doubled for better visibility
  previewContainer.style.height = 'auto';
  previewContainer.style.aspectRatio = `${A4.width_mm} / ${A4.height_mm}`;
  previewContainer.style.position = 'relative';
  previewContainer.style.overflow = 'hidden';
  previewContainer.style.padding = `${A4.margin_mm * 2}px`;  // Doubled for better visibility
  previewContainer.style.boxSizing = 'border-box';
  previewContainer.style.display = 'flex';
  previewContainer.style.justifyContent = 'center';
  previewContainer.style.alignItems = 'flex-start';

  // Clone invoice content for preview with alignment fixes
  const invoiceClone = invoiceElement.cloneNode(true) as HTMLElement;
  
  // Apply alignment fixes to the clone
  invoiceClone.style.transform = 'scale(1)';
  invoiceClone.style.width = '100%';
  invoiceClone.style.maxWidth = '100%';
  invoiceClone.style.margin = '0 auto';
  invoiceClone.style.boxSizing = 'border-box';
  
  // Fix tables and other alignment issues in the preview
  const tables = invoiceClone.querySelectorAll('table');
  tables.forEach(table => {
    table.style.width = '100%';
    table.style.tableLayout = 'fixed';
    
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      (cell as HTMLElement).style.wordWrap = 'break-word';
      (cell as HTMLElement).style.overflowWrap = 'break-word';
    });
  });
  
  // Fix alignment of specific elements in preview
  const rightAlignElements = invoiceClone.querySelectorAll('.text-right, .amount, .total, .subtotal, .tax');
  rightAlignElements.forEach(el => {
    (el as HTMLElement).style.textAlign = 'right';
  });
  
  const centerAlignElements = invoiceClone.querySelectorAll('.text-center, .invoice-title');
  centerAlignElements.forEach(el => {
    (el as HTMLElement).style.textAlign = 'center';
  });

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.backgroundColor = '#f44336';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '50%';
  closeButton.style.width = '30px';
  closeButton.style.height = '30px';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '10000';
  closeButton.style.display = 'flex';
  closeButton.style.justifyContent = 'center';
  closeButton.style.alignItems = 'center';
  closeButton.onclick = () => {
    document.body.removeChild(modalContainer);
  };

  // Add action buttons (print, download)
  const actionContainer = document.createElement('div');
  actionContainer.style.display = 'flex';
  actionContainer.style.justifyContent = 'center';
  actionContainer.style.gap = '10px';
  actionContainer.style.marginTop = '15px';
  actionContainer.style.position = 'absolute';
  actionContainer.style.bottom = '10px';
  actionContainer.style.left = '0';
  actionContainer.style.right = '0';

  const printButton = document.createElement('button');
  printButton.textContent = 'Print';
  printButton.style.padding = '8px 16px';
  printButton.style.backgroundColor = '#4CAF50';
  printButton.style.color = 'white';
  printButton.style.border = 'none';
  printButton.style.borderRadius = '4px';
  printButton.style.cursor = 'pointer';
  printButton.onclick = () => {
    document.body.removeChild(modalContainer);
    printInvoice();
  };

  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download PDF';
  downloadButton.style.padding = '8px 16px';
  downloadButton.style.backgroundColor = '#2196F3';
  downloadButton.style.color = 'white';
  downloadButton.style.border = 'none';
  downloadButton.style.borderRadius = '4px';
  downloadButton.style.cursor = 'pointer';
  downloadButton.onclick = () => {
    document.body.removeChild(modalContainer);
    const invoiceNumber = (document.querySelector('[data-invoice-number]') as HTMLElement)?.dataset.invoiceNumber || 'unknown';
    downloadInvoice(invoiceNumber);
  };

  actionContainer.appendChild(printButton);
  actionContainer.appendChild(downloadButton);

  // Assemble the modal
  previewContainer.appendChild(invoiceClone);
  modalContainer.appendChild(previewContainer);
  modalContainer.appendChild(closeButton);
  modalContainer.appendChild(actionContainer);
  document.body.appendChild(modalContainer);
};