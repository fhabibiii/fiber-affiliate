
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Download, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row?: any) => React.ReactNode;
  fullRender?: (value: any, row?: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  onExport?: () => void;
  actions?: (row: any) => React.ReactNode;
  onRowClick?: (row: any) => void;
  extraControls?: React.ReactNode;
  defaultPageSize?: number;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  onExport,
  actions,
  onRowClick,
  extraControls,
  defaultPageSize = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filter data based on search term
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const handleRowClick = (row: any, e: React.MouseEvent) => {
    if (onRowClick && !e.defaultPrevented) {
      onRowClick(row);
    }
  };

  const renderCellContent = (column: Column, value: any, row: any) => {
    if (column.fullRender) {
      return column.fullRender(value, row);
    }
    if (column.render) {
      return column.render(value, row);
    }
    return value;
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Cari data..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 text-sm md:text-base"
          />
        </div>
        
        {extraControls && extraControls}
        
        {onExport && !extraControls && (
          <Button onClick={onExport} variant="outline" className="w-full sm:w-auto text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-1.5 px-3 font-medium text-gray-900 dark:text-white text-sm"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="text-left py-1.5 px-3 font-medium text-gray-900 dark:text-white text-sm">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr
                key={row.uuid || rowIndex}
                className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={(e) => handleRowClick(row, e)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-1.5 px-3 text-gray-700 dark:text-gray-300 text-sm">
                    {renderCellContent(column, row[column.key], row)}
                  </td>
                ))}
                {actions && (
                  <td className="py-1.5 px-3" onClick={(e) => e.stopPropagation()}>
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
        {currentData.map((row, rowIndex) => {
          const isExpanded = expandedRows.has(row.uuid || rowIndex.toString());
          return (
            <Card
              key={row.uuid || rowIndex}
              className={`${onRowClick ? 'cursor-pointer' : ''} transition-all duration-200`}
              onClick={(e) => handleRowClick(row, e)}
            >
              <CardContent className="p-3">
                <div className="space-y-2">
                  {/* First column always visible */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {renderCellContent(columns[0], row[columns[0].key], row)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {actions && (
                        <div onClick={(e) => e.stopPropagation()}>
                          {actions(row)}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(row.uuid || rowIndex.toString());
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {columns.slice(1).map((column) => (
                        <div key={column.key}>
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {column.label}:
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white mt-1">
                            {renderCellContent(column, row[column.key], row)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={pageSize.toString()} onValueChange={(value) => {
            setPageSize(Number(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-16 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-600 dark:text-gray-400">per halaman</span>
        </div>

        <div className="text-center text-xs text-gray-600 dark:text-gray-400">
          {filteredData.length > 0 ? (
            <>
              {startIndex + 1} dari {filteredData.length} data ditampilkan
            </>
          ) : (
            '0 dari 0 data ditampilkan'
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-xs text-gray-600 dark:text-gray-400 px-3">
            {currentPage} / {totalPages || 1}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="text-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* No data message */}
      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {searchTerm ? 'Tidak ada data yang ditemukan' : 'Tidak ada data tersedia'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;
