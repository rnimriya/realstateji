/**
 * Triggers a client-side download of a CSV file generated from the extracted document clauses.
 * Outputs a single row of values corresponding to the extraction keys as column headers.
 */
export function exportToCSV(data: Record<string, any>, fileName: string) {
  if (!data || Object.keys(data).length === 0) {
    console.error("No data available to export to CSV.");
    return;
  }

  // 1. Extract keys as headers
  const headers = Object.keys(data);
  
  // 2. Format values (handling nested objects, string conversions, and escaping quotes)
  const formattedValues = headers.map((header) => {
    const val = data[header];
    let stringValue = "";
    
    if (val === null || val === undefined) {
      stringValue = "";
    } else if (typeof val === "object") {
      stringValue = JSON.stringify(val);
    } else {
      stringValue = String(val);
    }
    
    // Escape double quotes inside values for valid CSV output
    const escapedValue = stringValue.replace(/"/g, '""');
    return `"${escapedValue}"`;
  });

  // 3. Assemble CSV string content
  const headerLine = headers.join(",");
  const dataLine = formattedValues.join(",");
  const csvContent = `${headerLine}\n${dataLine}`;

  // 4. Create blob and trigger browser download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Derive download name by removing the original .pdf extension and appending _extracted.csv
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const downloadName = `${baseName}_extracted_clauses.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", downloadName);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
