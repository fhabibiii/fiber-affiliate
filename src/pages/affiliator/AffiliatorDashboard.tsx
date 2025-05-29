
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveTable from '@/components/ui/responsive-table';
import { apiService, Customer } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AffiliatorDashboard: React.FC = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await apiService.getAffiliatorCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Failed to load customers:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data pelanggan",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [toast]);

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
      label: 'Nama',
      render: (value: string) => value
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Customer Table */}
      <Card className="w-full mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-900 dark:text-white">
            Data Pelanggan Saya
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <ResponsiveTable
            data={customers}
            columns={columns}
            onExport={handleExportCSV}
            defaultPageSize={10}
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {customers.length === 0 && (
        <Card className="mt-6">
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
