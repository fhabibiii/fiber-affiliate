import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Download, Plus } from 'lucide-react';
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
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    amount: '',
    proofImage: null as File | null
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

  const formatMobileMonth = (month: string, year: number) => {
    const monthMap: { [key: string]: string } = {
      'Januari': 'JAN',
      'Februari': 'FEB',
      'Maret': 'MAR',
      'April': 'APR',
      'Mei': 'MEI',
      'Juni': 'JUN',
      'Juli': 'JUL',
      'Agustus': 'AGU',
      'September': 'SEP',
      'Oktober': 'OKT',
      'November': 'NOV',
      'Desember': 'DES'
    };
    return `${monthMap[month]} ${year.toString().slice(-2)}`;
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
      amount: payment.amount.toString(),
      proofImage: null
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

  const handleSubmitAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil ditambahkan",
      });

      setShowAddPaymentModal(false);
      setFormData({ month: '', year: '', amount: '', proofImage: null });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan pembayaran",
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
      label: 'Bulan',
      render: (value: string) => (
        <>
          <span className="hidden sm:inline">{value}</span>
          <span className="sm:hidden">{formatMobileMonth(value, 2024)}</span>
        </>
      )
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

  const extraControls = (
    <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
      <div className="flex gap-2 sm:hidden w-full">
        <Button 
          onClick={handleExportCSV}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button onClick={() => setShowAddPaymentModal(true)} size="sm" className="flex-1">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="hidden sm:flex gap-2">
        <Button 
          onClick={handleExportCSV}
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button onClick={() => setShowAddPaymentModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pembayaran
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {affiliator.fullName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Riwayat pembayaran untuk affiliator ini
          </p>
        </div>
      </div>

      {/* Payment Table */}
      <Card className="w-full">
        <CardContent className="p-6">
          {/* Mobile Controls - Above search bar */}
          <div className="md:hidden mb-4">
            <div className="flex gap-2 w-full">
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowAddPaymentModal(true)} size="sm" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pembayaran
              </Button>
            </div>
          </div>

          <ResponsiveTable
            data={payments}
            columns={columns}
            actions={actions}
            extraControls={
              <div className="hidden md:flex gap-2">
                <Button 
                  onClick={handleExportCSV}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => setShowAddPaymentModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Pembayaran
                </Button>
              </div>
            }
          />
          
          {/* Total Payment - Right after data, before pagination */}
          <div className="mt-4 mb-4">
            {/* Desktop Total */}
            <div className="hidden md:block">
              <div className="border-t-2 border-gray-300 dark:border-gray-600">
                <div className="grid grid-cols-6 py-3 bg-gray-50 dark:bg-gray-800">
                  <div className="col-span-4 px-4 text-center font-bold text-gray-900 dark:text-white">
                    Total Pembayaran
                  </div>
                  <div className="col-span-2 px-4 text-center font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Total */}
            <div className="md:hidden">
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Total Pembayaran</span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Modal */}
      <Dialog open={showAddPaymentModal} onOpenChange={setShowAddPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pembayaran</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAddPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addAffiliator">Affiliator</Label>
              <Select value={affiliator.uuid} disabled>
                <SelectTrigger>
                  <SelectValue placeholder={affiliator.fullName} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={affiliator.uuid}>{affiliator.fullName}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addMonth">Bulan</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
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
              <Label htmlFor="addYear">Tahun</Label>
              <Input
                id="addYear"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addAmount">Jumlah</Label>
              <Input
                id="addAmount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Tambah Pembayaran
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
            <div className="space-y-2">
              <Label htmlFor="editProofImage">Bukti Pembayaran (Opsional)</Label>
              <Input
                id="editProofImage"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, proofImage: e.target.files?.[0] || null })}
              />
              <p className="text-xs text-gray-500">Maksimal ukuran file 10MB</p>
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
