import { jsPDF } from "jspdf";

/**
 * Generate a PDF receipt for an order
 * @param {Object} order - The order object
 * @returns {jsPDF} - The generated PDF document
 */
export function generateOrderPdf(order) {
  const doc = new jsPDF({ unit: "mm", format: [57, 100] });
  const yGap = 5;

  // Add title
  doc.setFontSize(10);
  doc.text("Order Receipt", 15, 20);

  // Add order details
  doc.setFontSize(6);
  let yPos = 30;

  doc.text(`Order Code: ${order.orderCode || "Unknown"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Chef: ${order.order?.chefName || "Unknown Chef"}`, 5, yPos);
  yPos += yGap;

  doc.text(
    `Menu Item: ${order.order?.menuItemName || "Unknown Item"}`,
    5,
    yPos,
  );
  yPos += yGap;

  doc.text(`Drink: ${order.order?.drinkName || "None"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Snack: ${order.order?.snackName || "None"}`, 5, yPos);
  yPos += yGap;

  // Add parameters if any
  if (order.order?.parameters && order.order.parameters.length > 0) {
    yPos += 5;
    doc.text("Parameters:", 5, yPos);
    yPos += yGap;

    order.order.parameters.forEach((param) => {
      doc.text(`${param.name}: ${param.value}`, 8, yPos);
      yPos += yGap;
    });
  }

  // Add date
  yPos += yGap;
  doc.text(
    `Created: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown"}`,
    5,
    yPos,
  );

  return doc;
}

/**
 * Open PDF in a new browser tab
 * @param {jsPDF} doc - The PDF document to open
 * @param {string} orderId - The order ID for filename
 */
export function openPdfInNewTab(doc, orderId) {
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
}

/**
 * Get PDF as data URL for embedding
 * @param {jsPDF} doc - The PDF document
 * @returns {string} - Data URL for the PDF
 */
export function getPdfDataUrl(doc) {
  return doc.output("datauristring");
}

/**
 * Get PDF as Uint8Array for direct use with PDF.js
 * @param {jsPDF} doc - The PDF document
 * @returns {Uint8Array} - PDF data as Uint8Array
 */
export function getPdfAsUint8Array(doc) {
  // Get the PDF as array buffer
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}

/**
 * Convert PDF to image data URL (for cleaner display without browser UI)
 * @param {jsPDF} doc - The PDF document
 * @returns {Promise<string>} - Data URL for the PDF as image
 */
export async function getPdfAsImage(doc) {
  // Create a temporary canvas to render the PDF as image
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas dimensions to match our PDF (57mm x 100mm at 96 DPI)
  const widthMM = 57;
  const heightMM = 100;
  const dpi = 4; // Higher resolution for better quality
  canvas.width = widthMM * dpi;
  canvas.height = heightMM * dpi;

  // White background
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Get PDF as data URL and return it
  // Note: In a real implementation, you would use pdf.js to render the PDF to canvas
  // For now, we'll return the PDF data URL as a fallback
  return doc.output("datauristring");
}

/**
 * Generate a PDF receipt for the current order data (for Receipt page)
 * @param {string} orderCode - The order code
 * @param {string} selectedDrink - Selected drink
 * @param {Object} selectedSnack - Selected snack object
 * @param {Object} selectedChef - Selected chef object
 * @param {Object} selectedMenuItem - Selected menu item object
 * @param {Object} parameterValues - Parameter values by ID
 * @returns {jsPDF} - The generated PDF document
 */
export function generateReceiptPdf(
  orderCode,
  selectedDrink,
  selectedSnack,
  selectedChef,
  selectedMenuItem,
  parameterValues,
) {
  const doc = new jsPDF({ unit: "mm", format: [57, 100] });
  const yGap = 5;

  // Add title
  doc.setFontSize(10);
  doc.text("Order Receipt", 15, 20);

  // Add order details
  doc.setFontSize(6);
  let yPos = 30;

  doc.text(`Order Code: ${orderCode || "Unknown"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Chef: ${selectedChef?.name || "Unknown Chef"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Menu Item: ${selectedMenuItem?.name || "Unknown Item"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Drink: ${selectedDrink || "None"}`, 5, yPos);
  yPos += yGap;

  doc.text(`Snack: ${selectedSnack?.name || "None"}`, 5, yPos);
  yPos += yGap;

  // Add parameters if any
  if (selectedMenuItem?.parameters && selectedMenuItem.parameters.length > 0) {
    yPos += 5;
    doc.text("Parameters:", 5, yPos);
    yPos += yGap;

    selectedMenuItem.parameters.forEach((param) => {
      const value = parameterValues[param.id];
      let formattedValue = "Not set";

      if (value !== undefined && value !== null) {
        switch (param.type) {
          case "percentage":
            formattedValue = `${value}%`;
            break;
          case "range":
          case "single-choice":
            formattedValue = String(value);
            break;
          case "spectrum":
            formattedValue = `${value}%`;
            break;
          case "boolean":
            formattedValue = value ? "Yes" : "No";
            break;
          case "text":
            formattedValue = value || "Not provided";
            break;
          default:
            formattedValue = String(value);
        }
      }

      doc.text(`${param.name}: ${formattedValue}`, 8, yPos);
      yPos += yGap;
    });
  }

  // Add current date
  yPos += yGap;
  doc.text(`Created: ${new Date().toLocaleString()}`, 5, yPos);

  return doc;
}
