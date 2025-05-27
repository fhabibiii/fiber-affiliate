
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Eye, Download } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ui/responsive-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const PaymentHistoryAdmin: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    amount: ''
  });

  // Mock affiliator data
  const affiliator = {
    uuid: id,
    fullName: 'John Doe',
    phoneNumber: '081234567890'
  };

  // Mock payment data for this affiliator
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
    link.download = `riwayat-pembayaran-${affiliator.fullName}.csv`;
    link.click();
  };

  const handleEdit = (payment: any) => {
    setSelectedPayment(payment);
    setFormData({
      month: payment.month,
      year: payment.year.toString(),
      amount: payment.amount.toString()
    });
    setShowEditModal(true);
  };

  const handleDelete = (payment: any) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleDownloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    link.click();
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Data pembayaran berhasil diperbarui",
      });

      setShowEditModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data pembayaran",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil dihapus",
      });

      setShowDeleteModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pembayaran",
        variant: "destructive"
      });
    }
  };

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

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
          onClick={() => handleViewImage(value)}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Lihat Bukti
        </Button>
      )
    }
  ];

  const actions = (row: any) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(row)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDelete(row)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/payments')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Riwayat Pembayaran: {affiliator.fullName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Riwayat pembayaran untuk affiliator ini
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Pembayaran
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Jumlah Transaksi
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {payments.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveTable
            data={payments}
            columns={columns}
            onExport={handleExportCSV}
            actions={actions}
          />
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pembayaran</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editMonth">Bulan</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editYear">Tahun</Label>
              <Input
                id="editYear"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAmount">Jumlah</Label>
              <Input
                id="editAmount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Simpan Perubahan
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin menghapus pembayaran <strong>{selectedPayment?.month} {selectedPayment?.year}</strong>?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistoryAdmin;
