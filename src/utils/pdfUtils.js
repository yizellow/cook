import { jsPDF } from "jspdf";

export const generateOrderPdf = async (order) => {
  const doc = new jsPDF({ unit: "mm", format: [57, 110] });
  const yGap = 5;
  const xCenter = 28.5;
  const xLeft = 8;

  // Load custom fonts (TTF format)
  try {
    // Load regular font
    const regularFontResponse = await fetch("/fonts/SplineSans-Regular.ttf");
    const regularFontArrayBuffer = await regularFontResponse.arrayBuffer();
    const regularFontBase64 = btoa(
      new Uint8Array(regularFontArrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );
    doc.addFileToVFS("SplineSans-Regular.ttf", regularFontBase64);
    doc.addFont("SplineSans-Regular.ttf", "SplineSans", "normal");

    // Load bold font
    const boldFontResponse = await fetch("/fonts/SplineSans-Bold.ttf");
    const boldFontArrayBuffer = await boldFontResponse.arrayBuffer();
    const boldFontBase64 = btoa(
      new Uint8Array(boldFontArrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );
    doc.addFileToVFS("SplineSans-Bold.ttf", boldFontBase64);
    doc.addFont("SplineSans-Bold.ttf", "SplineSans", "bold");

    // Set regular font as default
    doc.setFont("SplineSans", "normal");
  } catch (error) {
    console.error("Failed to load custom fonts, using default font:", error);
  }

  // Add logo image at the top
  try {
    const imageResponse = await fetch("/assets/caps-kitchen-complete.png");
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = btoa(
      new Uint8Array(imageArrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );
    doc.addImage(imageBase64, "PNG", xCenter - 12.5, 3, 25, 25);
  } catch (error) {
    console.error("Failed to load logo image:", error);
  }

  // Add title (bold) - positioned below the image
  let yPos = 32;
  doc.setFont("SplineSans", "bold");
  doc.setFontSize(12);
  doc.setCharSpace(0.1);
  doc.text("BESTELLUNG", xCenter, yPos, "center");
  yPos += 7;

  // Add order details (centered and bold)
  doc.setFont("SplineSans", "normal");
  doc.setFontSize(8);

  doc.text(`Portion: ${order.order?.snackName || "None"}`, xLeft, yPos, "left");
  yPos += yGap;

  doc.text(
    `Kategorie: ${order.order?.chefName || "Unknown Chef"}`,
    xLeft,
    yPos,
    "left",
  );
  yPos += yGap;

  doc.text(
    `Gericht: ${order.order?.menuItemName || "Unknown Item"}`,
    xLeft,
    yPos,
    "left",
  );
  yPos += yGap;

  // Switch to regular font for parameters
  doc.setFont("SplineSans", "normal");

  // Add parameters if any
  if (order.order?.parameters && order.order.parameters.length > 0) {
    yPos += 2;
    doc.setFont("SplineSans", "bold");
    doc.text("Geschmacksprofil:", xLeft, yPos, "left");
    doc.setFont("SplineSans", "normal");
    yPos += yGap;

    order.order.parameters.forEach((param) => {
      doc.text(`${param.name}: ${param.value}`, xLeft, yPos, "left");
      yPos += yGap;
    });
  }
  yPos += 2;

  // Add drink if available
  if (order.order?.drinkName && order.order.drinkName !== "None") {
    doc.setFont("SplineSans", "bold");
    doc.text(`Getränk:`, xLeft, yPos, "left");
    yPos += yGap;
    doc.setFont("SplineSans", "normal");
    doc.text(`${order.order.drinkName}`, xLeft, yPos, "left");
    yPos += yGap;
  }

  // Add Number and date
  yPos += yGap;

  doc.setFontSize(16);
  doc.setFont("SplineSans", "bold");
  doc.align;
  doc.text(`# ${order.orderCode || "Unknown"}`, xCenter, yPos, "center");
  yPos += yGap;

  doc.setFontSize(6);
  doc.setFont("SplineSans", "normal");
  doc.text(
    `${order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown"}`,
    xCenter,
    yPos,
    "center",
  );

  return doc;
};

export const openPdfWithName = (doc, fileName = "order") => {
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Open in new tab for preview
  // const previewWindow = window.open(pdfUrl, "_blank");

  // Also trigger download with proper filename
  const downloadLink = document.createElement("a");
  downloadLink.href = pdfUrl;
  downloadLink.download = `${fileName}.pdf`;
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Clean up the URL object after a delay to allow both operations
  // setTimeout(() => {
  //   URL.revokeObjectURL(pdfUrl);
  //   if (previewWindow) previewWindow.close();
  // }, 500);
};
