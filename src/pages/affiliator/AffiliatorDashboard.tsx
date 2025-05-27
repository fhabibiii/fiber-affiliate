
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { indonesianTexts } from '@/constants/texts';
import ResponsiveTable from '@/components/ui/responsive-table';

const AffiliatorDashboard: React.FC = () => {
  // Mock customer data
  const customers = [
    {
      uuid: '1',
      fullName: 'Ahmad Santoso',
      phoneNumber: '08123456789',
      fullAddress: 'Jl. Merdeka No. 123, Jakarta Pusat',
      createdAt: '2024-01-15T08:30:00Z'
    },
    {
      uuid: '2',
      fullName: 'Siti Nurhaliza',
      phoneNumber: '08987654321',
      fullAddress: 'Jl. Sudirman No. 45, Jakarta Selatan',
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      uuid: '3',
      fullName: 'Budi Prasetyo',
      phoneNumber: '08555666777',
      fullAddress: 'Jl. Gatot Subroto No. 78, Jakarta Barat',
      createdAt: '2024-01-08T10:15:00Z'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Nama Lengkap', 'No. Telepon', 'Alamat', 'Tanggal Bergabung'],
      ...customers.map(customer => [
        customer.fullName,
        customer.phoneNumber,
        customer.fullAddress,
        formatDate(customer.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daftar-pelanggan.csv';
    link.click();
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Nama Lengkap'
    },
    {
      key: 'phoneNumber',
      label: 'No. Telepon'
    },
    {
      key: 'fullAddress',
      label: 'Alamat'
    },
    {
      key: 'createdAt',
      label: 'Tanggal Bergabung',
      render: (value: string) => formatDate(value)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {indonesianTexts.navigation.customerList}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Daftar pelanggan yang telah Anda daftarkan
          </p>
        </div>
        
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Total Pelanggan
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {customers.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardContent className="p-6">
          <ResponsiveTable
            data={customers}
            columns={columns}
            onExport={handleExportCSV}
          />
        </CardContent>
      </Card>

      {/* Empty State (if no customers) */}
      {customers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum Ada Pelanggan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Anda belum memiliki pelanggan yang terdaftar
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AffiliatorDashboard;
