import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import ResponsiveTable from '@/components/ui/responsive-table';

const PaymentHistory: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Expanded mock payment data with 20 entries
  const payments = [
    {
      uuid: '1',
      month: 'Januari',
      year: 2024,
      amount: 2500000,
      paymentDate: '2024-02-05T10:30:00Z',
      proofImage: 'https://via.placeholder.com/600x400/007bff/ffffff?text=Bukti+Pembayaran+1'
    },
    {
      uuid: '2',
      month: 'Februari',
      year: 2024,
      amount: 1800000,
      paymentDate: '2024-03-05T14:20:00Z',
      proofImage: 'https://via.placeholder.com/600x400/28a745/ffffff?text=Bukti+Pembayaran+2'
    },
    {
      uuid: '3',
      month: 'Maret',
      year: 2024,
      amount: 3200000,
      paymentDate: '2024-04-05T09:15:00Z',
      proofImage: 'https://via.placeholder.com/600x400/dc3545/ffffff?text=Bukti+Pembayaran+3'
    },
    {
      uuid: '4',
      month: 'April',
      year: 2024,
      amount: 2800000,
      paymentDate: '2024-05-05T11:15:00Z',
      proofImage: 'https://via.placeholder.com/600x400/17a2b8/ffffff?text=Bukti+Pembayaran+4'
    },
    {
      uuid: '5',
      month: 'Mei',
      year: 2024,
      amount: 3100000,
      paymentDate: '2024-06-05T13:45:00Z',
      proofImage: 'https://via.placeholder.com/600x400/6f42c1/ffffff?text=Bukti+Pembayaran+5'
    },
    {
      uuid: '6',
      month: 'Juni',
      year: 2024,
      amount: 2700000,
      paymentDate: '2024-07-05T09:20:00Z',
      proofImage: 'https://via.placeholder.com/600x400/e83e8c/ffffff?text=Bukti+Pembayaran+6'
    },
    {
      uuid: '7',
      month: 'Juli',
      year: 2024,
      amount: 3300000,
      paymentDate: '2024-08-05T15:10:00Z',
      proofImage: 'https://via.placeholder.com/600x400/fd7e14/ffffff?text=Bukti+Pembayaran+7'
    },
    {
      uuid: '8',
      month: 'Agustus',
      year: 2024,
      amount: 2900000,
      paymentDate: '2024-09-05T12:30:00Z',
      proofImage: 'https://via.placeholder.com/600x400/20c997/ffffff?text=Bukti+Pembayaran+8'
    },
    {
      uuid: '9',
      month: 'September',
      year: 2024,
      amount: 3500000,
      paymentDate: '2024-10-05T10:50:00Z',
      proofImage: 'https://via.placeholder.com/600x400/6610f2/ffffff?text=Bukti+Pembayaran+9'
    },
    {
      uuid: '10',
      month: 'Oktober',
      year: 2024,
      amount: 3000000,
      paymentDate: '2024-11-05T14:15:00Z',
      proofImage: 'https://via.placeholder.com/600x400/d63384/ffffff?text=Bukti+Pembayaran+10'
    },
    {
      uuid: '11',
      month: 'November',
      year: 2024,
      amount: 3200000,
      paymentDate: '2024-12-05T11:40:00Z',
      proofImage: 'https://via.placeholder.com/600x400/198754/ffffff?text=Bukti+Pembayaran+11'
    },
    {
      uuid: '12',
      month: 'Desember',
      year: 2024,
      amount: 3800000,
      paymentDate: '2025-01-05T16:25:00Z',
      proofImage: 'https://via.placeholder.com/600x400/0d6efd/ffffff?text=Bukti+Pembayaran+12'
    },
    {
      uuid: '13',
      month: 'Januari',
      year: 2023,
      amount: 2200000,
      paymentDate: '2023-02-05T09:30:00Z',
      proofImage: 'https://via.placeholder.com/600x400/dc3545/ffffff?text=Bukti+Pembayaran+13'
    },
    {
      uuid: '14',
      month: 'Februari',
      year: 2023,
      amount: 2400000,
      paymentDate: '2023-03-05T13:20:00Z',
      proofImage: 'https://via.placeholder.com/600x400/ffc107/ffffff?text=Bukti+Pembayaran+14'
    },
    {
      uuid: '15',
      month: 'Maret',
      year: 2023,
      amount: 2600000,
      paymentDate: '2023-04-05T10:10:00Z',
      proofImage: 'https://via.placeholder.com/600x400/0dcaf0/ffffff?text=Bukti+Pembayaran+15'
    },
    {
      uuid: '16',
      month: 'April',
      year: 2023,
      amount: 2300000,
      paymentDate: '2023-05-05T15:50:00Z',
      proofImage: 'https://via.placeholder.com/600x400/f8f9fa/000000?text=Bukti+Pembayaran+16'
    },
    {
      uuid: '17',
      month: 'Mei',
      year: 2023,
      amount: 2700000,
      paymentDate: '2023-06-05T12:15:00Z',
      proofImage: 'https://via.placeholder.com/600x400/6c757d/ffffff?text=Bukti+Pembayaran+17'
    },
    {
      uuid: '18',
      month: 'Juni',
      year: 2023,
      amount: 2500000,
      paymentDate: '2023-07-05T14:35:00Z',
      proofImage: 'https://via.placeholder.com/600x400/495057/ffffff?text=Bukti+Pembayaran+18'
    },
    {
      uuid: '19',
      month: 'Juli',
      year: 2023,
      amount: 2800000,
      paymentDate: '2023-08-05T11:05:00Z',
      proofImage: 'https://via.placeholder.com/600x400/f8d7da/000000?text=Bukti+Pembayaran+19'
    },
    {
      uuid: '20',
      month: 'Agustus',
      year: 2023,
      amount: 3000000,
      paymentDate: '2023-09-05T16:45:00Z',
      proofImage: 'https://via.placeholder.com/600x400/d1ecf1/000000?text=Bukti+Pembayaran+20'
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
      ['Bulan', 'Tahun', 'Jumlah', 'Tanggal Pembayaran'],
      ...payments.map(payment => [
        payment.month,
        payment.year,
        payment.amount,
        formatDate(payment.paymentDate)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'riwayat-pembayaran.csv';
    link.click();
  };

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
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
      key: 'proofImage',
      label: 'Bukti Pembayaran',
      render: (value: string) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedImage(value)}
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <Eye className="w-4 h-4" />
          Lihat Bukti
        </Button>
      )
    }
  ];

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="text-center lg:text-left w-full lg:w-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Riwayat Pembayaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Riwayat pembayaran komisi Anda
          </p>
        </div>
        
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 w-full lg:w-auto">
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
      <Card className="w-full">
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

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Bukti Pembayaran"
                className="w-full h-auto rounded-lg"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => handleDownloadImage(selectedImage, 'bukti-pembayaran.jpg')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Bukti
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;
