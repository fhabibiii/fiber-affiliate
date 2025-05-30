import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import ResponsiveTable from '@/components/ui/responsive-table';
import { apiService, Payment } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const PaymentHistory: React.FC = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await apiService.getAffiliatorPayments();
        setPayments(data);
      } catch (error) {
        console.error('Failed to load payments:', error);
        toast({
          title: "Error",
          description: "Gagal memuat riwayat pembayaran",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [toast]);

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

  const getMonthName = (monthNumber: string) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[parseInt(monthNumber) - 1] || monthNumber;
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Bulan', 'Jumlah', 'Tanggal Pembayaran'],
      ...payments.map(payment => [
        `${getMonthName(payment.month)} ${payment.year}`,
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
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Download failed:', error);
        // Fallback to opening in new tab
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        link.target = '_blank';
        link.click();
      });
  };

  const columns = [
    {
      key: 'monthYear',
      label: 'Bulan',
      render: (value: any, row: Payment) => `${getMonthName(row.month)} ${row.year}`
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
          className="flex items-center gap-2 w-full md:w-auto text-xs"
        >
          <Eye className="w-3 h-3" />
          Lihat Bukti
        </Button>
      )
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
      {/* Payment Table */}
      <Card className="w-full mb-8 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-900 dark:text-white">
            Histori Pembayaran dari Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <ResponsiveTable
            data={payments}
            columns={columns}
            onExport={handleExportCSV}
            defaultPageSize={10}
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {payments.length === 0 && (
        <Card className="mt-6 shadow-lg">
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
