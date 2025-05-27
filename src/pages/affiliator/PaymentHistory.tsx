
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import ResponsiveTable from '@/components/ui/responsive-table';

const PaymentHistory: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock payment data with image URLs
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
          className="flex items-center gap-2"
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
