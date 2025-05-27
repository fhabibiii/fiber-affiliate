
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ResponsiveTable from '@/components/ui/responsive-table';

const PaymentHistory: React.FC = () => {
  // Mock payment data
  const payments = [
    {
      uuid: '1',
      month: 'Januari',
      year: 2024,
      amount: 2500000,
      paymentDate: '2024-02-05T10:30:00Z',
      status: 'Lunas'
    },
    {
      uuid: '2',
      month: 'Februari',
      year: 2024,
      amount: 1800000,
      paymentDate: '2024-03-05T14:20:00Z',
      status: 'Lunas'
    },
    {
      uuid: '3',
      month: 'Maret',
      year: 2024,
      amount: 3200000,
      paymentDate: '2024-04-05T09:15:00Z',
      status: 'Lunas'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Bulan', 'Tahun', 'Jumlah', 'Tanggal Pembayaran', 'Status'],
      ...payments.map(payment => [
        payment.month,
        payment.year,
        payment.amount,
        formatDate(payment.paymentDate),
        payment.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'riwayat-pembayaran.csv';
    link.click();
  };

  const columns = [
    {
      key: 'month',
      label: 'Bulan'
    },
    {
      key: 'year',
      label: 'Tahun'
    },
    {
      key: 'amount',
      label: 'Jumlah',
      render: (value: number) => formatCurrency(value)
    },
    {
      key: 'paymentDate',
      label: 'Tanggal Pembayaran',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {value}
        </span>
      )
    }
  ];

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Riwayat Pembayaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Riwayat pembayaran komisi Anda
          </p>
        </div>
        
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                Total Diterima
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Table */}
      <Card>
        <CardContent className="p-6">
          <ResponsiveTable
            data={payments}
            columns={columns}
            onExport={handleExportCSV}
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {payments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum Ada Pembayaran
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Riwayat pembayaran Anda akan muncul di sini
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentHistory;
