import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BUSINESS,
  CURRENCY_SYMBOL,
  PAYMENT_LABEL,
  formatMoney,
  type Invoice,
} from "./invoices";

const CYAN = "#00E5FF";
const FUCHSIA = "#FF00D4";
const DARK = "#0B0B0F";
const LIGHT = "#F5F7FA";
const MUTED = "#9CA3AF";

export function generateInvoicePdf(invoice: Invoice): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Dark header band
  doc.setFillColor(DARK);
  doc.rect(0, 0, pageW, 120, "F");

  // Neon gradient strip (simulated with two rects)
  doc.setFillColor(CYAN);
  doc.rect(0, 118, pageW / 2, 3, "F");
  doc.setFillColor(FUCHSIA);
  doc.rect(pageW / 2, 118, pageW / 2, 3, "F");

  // Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(LIGHT);
  doc.text(BUSINESS.brand.toUpperCase(), 40, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(BUSINESS.name, 40, 75);
  doc.text(`${BUSINESS.role} • ${BUSINESS.location}`, 40, 88);
  doc.text(`${BUSINESS.email} • ${BUSINESS.phone}`, 40, 101);

  // Document title
  doc.setTextColor(CYAN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FACTURA", pageW - 40, 55, { align: "right" });

  doc.setTextColor(LIGHT);
  doc.setFontSize(11);
  doc.text(invoice.number, pageW - 40, 75, { align: "right" });

  doc.setTextColor(MUTED);
  doc.setFontSize(9);
  doc.text(
    `Emitido: ${new Date(invoice.createdAt).toLocaleDateString("es-AR")}`,
    pageW - 40,
    90,
    { align: "right" },
  );
  doc.text(
    `Entrega: ${invoice.deliveryDate ? new Date(invoice.deliveryDate).toLocaleDateString("es-AR") : "—"}`,
    pageW - 40,
    103,
    { align: "right" },
  );

  // Client block
  let y = 150;
  doc.setTextColor(DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CLIENTE", 40, y);
  doc.setDrawColor(CYAN);
  doc.setLineWidth(0.8);
  doc.line(40, y + 4, 110, y + 4);

  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#222");
  doc.text(invoice.client.name || "—", 40, y);
  y += 14;
  doc.setTextColor("#555");
  doc.setFontSize(9);
  if (invoice.client.cuit) doc.text(`CUIT: ${invoice.client.cuit}`, 40, y), (y += 12);
  if (invoice.client.address)
    doc.text(`${invoice.client.address}${invoice.client.zip ? " — CP " + invoice.client.zip : ""}`, 40, y),
      (y += 12);
  if (invoice.client.email) doc.text(invoice.client.email, 40, y), (y += 12);
  if (invoice.client.phone) doc.text(`Tel: ${invoice.client.phone}`, 40, y), (y += 12);

  // Payment & currency right side
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(DARK);
  doc.text("PAGO", pageW - 40, 150, { align: "right" });
  doc.setDrawColor(FUCHSIA);
  doc.line(pageW - 90, 154, pageW - 40, 154);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#222");
  doc.text(PAYMENT_LABEL[invoice.paymentMethod], pageW - 40, 170, { align: "right" });
  doc.setTextColor("#555");
  doc.setFontSize(9);
  doc.text(`Moneda: ${invoice.currency} (${CURRENCY_SYMBOL[invoice.currency]})`, pageW - 40, 184, {
    align: "right",
  });

  // Items table
  const tableStartY = Math.max(y + 10, 220);
  autoTable(doc, {
    startY: tableStartY,
    head: [["Cant.", "Descripción", "P. Unitario", "Total"]],
    body: invoice.items.map((it) => [
      String(it.quantity),
      it.description,
      formatMoney(it.unitPrice, invoice.currency),
      formatMoney((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), invoice.currency),
    ]),
    theme: "grid",
    styles: { font: "helvetica", fontSize: 10, cellPadding: 8, textColor: "#222" },
    headStyles: {
      fillColor: DARK,
      textColor: CYAN,
      fontStyle: "bold",
      lineColor: CYAN,
    },
    alternateRowStyles: { fillColor: "#F7F8FB" },
    columnStyles: {
      0: { halign: "center", cellWidth: 50 },
      2: { halign: "right", cellWidth: 100 },
      3: { halign: "right", cellWidth: 100 },
    },
    margin: { left: 40, right: 40 },
  });

  // Totals box
  // @ts-expect-error injected by autotable
  const afterTableY: number = doc.lastAutoTable.finalY + 20;
  const boxX = pageW - 280;
  const boxW = 240;
  doc.setFillColor("#0F1218");
  doc.roundedRect(boxX, afterTableY, boxW, 110, 8, 8, "F");
  doc.setDrawColor(CYAN);
  doc.setLineWidth(0.6);
  doc.roundedRect(boxX, afterTableY, boxW, 110, 8, 8, "S");

  const labelX = boxX + 16;
  const valueX = boxX + boxW - 16;
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text("Subtotal", labelX, afterTableY + 24);
  doc.text("Seña", labelX, afterTableY + 44);
  doc.text("Debe", labelX, afterTableY + 88);

  doc.setTextColor(LIGHT);
  doc.setFont("helvetica", "normal");
  doc.text(formatMoney(invoice.subtotal, invoice.currency), valueX, afterTableY + 24, { align: "right" });
  doc.text(formatMoney(invoice.deposit, invoice.currency), valueX, afterTableY + 44, { align: "right" });

  doc.setDrawColor(FUCHSIA);
  doc.line(labelX, afterTableY + 58, valueX, afterTableY + 58);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(CYAN);
  doc.text("Total", labelX, afterTableY + 76);
  doc.text(formatMoney(invoice.total, invoice.currency), valueX, afterTableY + 76, { align: "right" });

  doc.setFontSize(11);
  doc.setTextColor(FUCHSIA);
  doc.text(formatMoney(invoice.balance, invoice.currency), valueX, afterTableY + 88, { align: "right" });

  // Notes
  if (invoice.notes?.trim()) {
    const notesY = afterTableY + 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(DARK);
    doc.text("OBSERVACIONES", 40, notesY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#444");
    const split = doc.splitTextToSize(invoice.notes, pageW - 80);
    doc.text(split, 40, notesY + 16);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  doc.text(
    `${BUSINESS.brand} • Factura generada con ${BUSINESS.brand}`,
    pageW / 2,
    pageH - 24,
    { align: "center" },
  );

  return doc;
}

export function downloadInvoicePdf(invoice: Invoice) {
  const doc = generateInvoicePdf(invoice);
  const fileName = `${invoice.number}-${invoice.client.name || "cliente"}.pdf`;

  try {
    doc.save(fileName);
  } catch (error) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}

export function printInvoicePdf(invoice: Invoice) {
  const doc = generateInvoicePdf(invoice);
  const url = doc.output("bloburl");
  window.open(url, "_blank");
}