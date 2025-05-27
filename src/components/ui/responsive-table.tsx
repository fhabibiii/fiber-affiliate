
import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  searchable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  actions?: (row: any) => React.ReactNode;
  onRowClick?: (row: any) => void;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  searchable = true,
  exportable = true,
  onExport,
  actions,
  onRowClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Filter data based on search term
  const filteredData = data.filter(row =>
    columns.some(col => 
      String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600 dark:text-gray-400 self-center">per halaman</span>
          </div>
        </div>

        {exportable && (
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th key={column.key} className="text-left p-4 font-medium text-gray-900 dark:text-white">
                  {column.label}
                </th>
              ))}
              {actions && <th className="text-left p-4 font-medium text-gray-900 dark:text-white">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr 
                key={index}
                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-4 text-gray-900 dark:text-gray-100">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedData.map((row, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {columns.slice(0, 2).map((column) => (
                  <div key={column.key} className="mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {column.label}:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                {actions && actions(row)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRowExpansion(index)}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    expandedRows.has(index) ? 'rotate-180' : ''
                  }`} />
                </Button>
              </div>
            </div>
            
            {expandedRows.has(index) && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                {columns.slice(2).map((column) => (
                  <div key={column.key} className="mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {column.label}:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
        </span>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400 self-center">
            {currentPage} / {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTable;
