// Simple client-side CSV export utility. No external dependency needed.
export const exportToCSV = (rows, columns, filename = "export.csv") => {
  if (!rows || rows.length === 0) return;

  const headers = columns.map((c) => c.headerName || c.field);
  const fieldKeys = columns.map((c) => c.field);

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      fieldKeys
        .map((key) => {
          const value = row[key] ?? "";
          const escaped = String(value).replace(/"/g, "\"\"");
          return `"${escaped}"`;
        })
        .join(",")
    )
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
