// src/utils/pdf.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToPDF = (trades) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Trade Statement", 14, 22);

  const tableData = trades.map((t, i) => [
    i + 1,
    t.symbol,
    t.action,
    t.result,
    t.amount || "-", // optional amount if you added it
    t.time,
  ]);

  doc.autoTable({
    head: [["#", "Pair", "Action", "Result", "Amount", "Time"]],
    body: tableData,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [255, 204, 0] }, // Yellow header
  });

  doc.save("trade-statement.pdf");
};
