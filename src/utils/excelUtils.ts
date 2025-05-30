
import * as XLSX from 'xlsx';

interface ExportConfig {
  title: string;
  affiliatorName?: string;
  data: any[];
  columns: { key: string; label: string }[];
  filename: string;
}

export const exportToExcel = ({ title, affiliatorName, data, columns, filename }: ExportConfig) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare data with proper headers
  const worksheetData: any[][] = [];
  
  // Add title row
  worksheetData.push([title]);
  worksheetData.push([]); // Empty row
  
  // Add affiliator name if provided
  if (affiliatorName) {
    worksheetData.push([`Affiliator: ${affiliatorName}`]);
    worksheetData.push([]); // Empty row
  }
  
  // Add column headers
  const headers = columns.map(col => col.label);
  worksheetData.push(headers);
  
  // Add data rows
  data.forEach(row => {
    const dataRow = columns.map(col => {
      const value = row[col.key];
      // Handle special formatting if needed
      if (typeof value === 'string' && value.includes('T')) {
        // Format dates
        try {
          const date = new Date(value);
          return date.toLocaleDateString('id-ID');
        } catch {
          return value;
        }
      }
      return value || '';
    });
    worksheetData.push(dataRow);
  });
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  const colWidths = columns.map(col => ({ wch: Math.max(col.label.length, 15) }));
  ws['!cols'] = colWidths;
  
  // Style the title row (merge cells if needed)
  if (ws['A1']) {
    ws['A1'].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center' }
    };
  }
  
  // Style the affiliator row if exists
  if (affiliatorName && ws['A3']) {
    ws['A3'].s = {
      font: { bold: true, sz: 12 }
    };
  }
  
  // Style header row
  const headerRowIndex = affiliatorName ? 5 : 3;
  headers.forEach((_, index) => {
    const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex - 1, c: index });
    if (ws[cellRef]) {
      ws[cellRef].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E2E8F0' } },
        alignment: { horizontal: 'center' }
      };
    }
  });
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Generate filename with current date
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const finalFilename = `${filename}_${dateStr}.xlsx`;
  
  // Save file
  XLSX.writeFile(wb, finalFilename);
};

export const exportCustomersToExcel = (customers: any[], affiliatorName?: string) => {
  const columns = [
    { key: 'fullName', label: 'Nama Lengkap' },
    { key: 'phoneNumber', label: 'Nomor Telepon' },
    { key: 'address', label: 'Alamat' },
    { key: 'createdAt', label: 'Tanggal Bergabung' }
  ];
  
  exportToExcel({
    title: 'Data Pelanggan',
    affiliatorName,
    data: customers,
    columns,
    filename: 'data_pelanggan'
  });
};

export const exportPaymentsToExcel = (payments: any[], affiliatorName?: string) => {
  const columns = [
    { key: 'month', label: 'Bulan' },
    { key: 'year', label: 'Tahun' },
    { key: 'amount', label: 'Jumlah' },
    { key: 'paymentDate', label: 'Tanggal Bayar' },
    { key: 'createdAt', label: 'Tanggal Dibuat' }
  ];
  
  exportToExcel({
    title: 'Data Pembayaran',
    affiliatorName,
    data: payments,
    columns,
    filename: 'data_pembayaran'
  });
};

export const exportAffiliatorsToExcel = (affiliators: any[]) => {
  const columns = [
    { key: 'fullName', label: 'Nama Lengkap' },
    { key: 'username', label: 'Username' },
    { key: 'phoneNumber', label: 'Nomor Telepon' },
    { key: 'totalCustomers', label: 'Total Pelanggan' },
    { key: 'createdAt', label: 'Tanggal Bergabung' }
  ];
  
  exportToExcel({
    title: 'Data Affiliator',
    data: affiliators,
    columns,
    filename: 'data_affiliator'
  });
};
