// src/utils/export.js
export const exportToCSV = (data, filename = "statement.csv") => {
    const csvHeader = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  