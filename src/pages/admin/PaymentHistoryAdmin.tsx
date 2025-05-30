import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Download, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ui/responsive-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Payment, Affiliator, AffiliatorSummary } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const PaymentHistoryAdmin: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isTotalOpen, setIsTotalOpen] = useState(false);
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    amount: '',
    proofImage: null as File | null
  });

  // Fetch affiliator data
  const { data: affiliator, isLoading: isLoadingAffiliator, error: affiliatorError } = useQuery({
    queryKey: ['affiliator', id],
    queryFn: () => apiService.getAffiliator(id!),
    enabled: !!id,
  });

  // Fetch affiliator summary
  const { data: affiliatorSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['affiliatorSummary', id],
    queryFn: () => apiService.getAffiliatorSummary(id!),
    enabled: !!id,
  });

  // Fetch payments data
  const { data: paymentsResponse, isLoading: isLoadingPayments, error: paymentsError } = useQuery({
    queryKey: ['payments', id],
    queryFn: () => apiService.getPaymentsByAffiliator(id!, 1, 100),
    enabled: !!id,
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (data: Omit<Payment, 'uuid' | 'createdAt' | 'affiliatorName'>) => 
      apiService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
      queryClient.invalidateQueries({ queryKey: ['affiliatorSummary', id] });
      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil ditambahkan",
      });
      setShowAddPaymentModal(false);
      setFormData({ month: '', year: '', amount: '', proofImage: null });
    },
    onError: (error) => {
      console.error('Create payment error:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan pembayaran",
        variant: "destructive"
      });
    }
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<Payment> }) => 
      apiService.updatePayment(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
      queryClient.invalidateQueries({ queryKey: ['affiliatorSummary', id] });
      toast({
        title: "Berhasil",
        description: "Data pembayaran berhasil diperbarui",
      });
      setShowEditModal(false);
    },
    onError: (error) => {
      console.error('Update payment error:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui data pembayaran",
        variant: "destructive"
      });
    }
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: (uuid: string) => apiService.deletePayment(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', id] });
      queryClient.invalidateQueries({ queryKey: ['affiliatorSummary', id] });
      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil dihapus",
      });
      setShowDeleteModal(false);
    },
    onError: (error) => {
      console.error('Delete payment error:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus pembayaran",
        variant: "destructive"
      });
    }
  });

  // Upload proof image mutation
  const uploadProofMutation = useMutation({
    mutationFn: (file: File) => apiService.uploadProofPayment(file),
  });

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
      '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
      '05': 'MEI', '06': 'JUN', '07': 'JUL', '08': 'AGU',
      '09': 'SEP', '10': 'OKT', '11': 'NOV', '12': 'DES'
    };
    return `${monthMap[month]} ${year.toString().slice(-2)}`;
  };

  const formatMonthName = (monthNumber: string) => {
    const monthNames: { [key: string]: string } = {
      '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
      '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
      '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
    };
    return monthNames[monthNumber] || monthNumber;
  };

  const handleExportCSV = () => {
    if (!paymentsResponse?.data) return;

    const csvContent = [
      ['Bulan', 'Tahun', 'Jumlah', 'Tanggal Pembayaran'],
      ...paymentsResponse.data.map(payment => [
        formatMonthName(payment.month),
        payment.year,
        payment.amount,
        formatDate(payment.paymentDate)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `riwayat-pembayaran-${affiliator?.fullName || 'affiliator'}.csv`;
    link.click();
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      month: payment.month,
      year: payment.year.toString(),
      amount: payment.amount.toString(),
      proofImage: null
    });
    setShowEditModal(true);
  };

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleDownloadImage = async (paymentUuid: string, filename: string) => {
    try {
      const response = await apiService.downloadPaymentProof(paymentUuid);
      const blob = new Blob([response], { type: 'image/jpeg' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || 'bukti-pembayaran.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Error",
        description: "Gagal mengunduh bukti pembayaran",
        variant: "destructive"
      });
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment) return;

    try {
      let proofImageUrl = selectedPayment.proofImage;
      
      // Upload new proof image if provided
      if (formData.proofImage) {
        const uploadResult = await uploadProofMutation.mutateAsync(formData.proofImage);
        proofImageUrl = uploadResult.url;
      }

      await updatePaymentMutation.mutateAsync({
        uuid: selectedPayment.uuid,
        data: {
          month: formData.month,
          year: parseInt(formData.year),
          amount: parseFloat(formData.amount),
          proofImage: proofImageUrl
        }
      });
    } catch (error) {
      console.error('Edit payment error:', error);
    }
  };

  const handleSubmitAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    try {
      let proofImageUrl = '';
      
      // Upload proof image if provided
      if (formData.proofImage) {
        const uploadResult = await uploadProofMutation.mutateAsync(formData.proofImage);
        proofImageUrl = uploadResult.url;
      }

      await createPaymentMutation.mutateAsync({
        affiliatorUuid: id,
        month: formData.month,
        year: parseInt(formData.year),
        amount: parseFloat(formData.amount),
        paymentDate: new Date().toISOString(),
        proofImage: proofImageUrl
      });
    } catch (error) {
      console.error('Add payment error:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPayment) return;
    await deletePaymentMutation.mutateAsync(selectedPayment.uuid);
  };

  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  // Show loading state
  if (isLoadingAffiliator || isLoadingPayments) {
    return (
      <div className="space-y-4 w-full max-w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Show error state
  if (affiliatorError || paymentsError) {
    return (
      <div className="space-y-4 w-full max-w-full">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">
            Error: {(affiliatorError as Error)?.message || (paymentsError as Error)?.message}
          </p>
          <Button onClick={() => navigate('/admin/affiliators')} className="mt-4">
            Kembali ke Daftar Affiliator
          </Button>
        </div>
      </div>
    );
  }

  if (!affiliator) {
    return (
      <div className="space-y-4 w-full max-w-full">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Affiliator tidak ditemukan</p>
          <Button onClick={() => navigate('/admin/affiliators')} className="mt-4">
            Kembali ke Daftar Affiliator
          </Button>
        </div>
      </div>
    );
  }

  const payments = paymentsResponse?.data || [];
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const columns = [
    {
      key: 'month',
      label: 'Bulan',
      render: (value: string, row: Payment) => (
        <>
          <span className="hidden sm:inline">{formatMonthName(value)}</span>
          <span className="sm:hidden">{formatMobileMonth(value, row.year)}</span>
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
      render: (value: string, row: Payment) => (
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

  const actions = (row: Payment) => (
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

      {/* Total Payment Card */}
      <div className="block md:hidden">
        <Collapsible open={isTotalOpen} onOpenChange={setIsTotalOpen}>
          <Card className="w-full">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-left text-base">Total Pembayaran</CardTitle>
                {isTotalOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="text-xl font-bold text-green-700 dark:text-green-300">
                  {isLoadingSummary ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    formatCurrency(affiliatorSummary?.totalPaymentsSinceJoin || totalAmount)
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      <div className="hidden md:block">
        <Collapsible open={isTotalOpen} onOpenChange={setIsTotalOpen}>
          <Card className="w-full">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <CardTitle className="text-left text-base">Total Pembayaran</CardTitle>
                {isTotalOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="text-xl font-bold text-green-700 dark:text-green-300">
                  {isLoadingSummary ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    formatCurrency(affiliatorSummary?.totalPaymentsSinceJoin || totalAmount)
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Payment Table */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {/* Mobile Controls - Above search bar */}
          <div className="md:hidden mb-4">
            <div className="flex gap-2 w-full">
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={!payments.length}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowAddPaymentModal(true)} size="sm" className="flex-1">
                <Plus className="w-4 h-4" />
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
                  disabled={!payments.length}
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
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
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
            <div className="space-y-2">
              <Label htmlFor="addProofImage">Bukti Pembayaran</Label>
              <Input
                id="addProofImage"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, proofImage: e.target.files?.[0] || null })}
              />
              <p className="text-xs text-gray-500">Maksimal ukuran file 10MB</p>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={createPaymentMutation.isPending || uploadProofMutation.isPending}
            >
              {createPaymentMutation.isPending || uploadProofMutation.isPending ? 'Menambahkan...' : 'Tambah Pembayaran'}
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
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
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
            <Button 
              type="submit" 
              className="w-full"
              disabled={updatePaymentMutation.isPending || uploadProofMutation.isPending}
            >
              {updatePaymentMutation.isPending || uploadProofMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
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
            <p>Apakah Anda yakin ingin menghapus pembayaran <strong>{selectedPayment && formatMonthName(selectedPayment.month)} {selectedPayment?.year}</strong>?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={deletePaymentMutation.isPending}
              >
                {deletePaymentMutation.isPending ? 'Menghapus...' : 'Hapus'}
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
                onClick={() => {
                  const payment = payments.find(p => p.proofImage === selectedImage);
                  if (payment) {
                    handleDownloadImage(payment.uuid, 'bukti-pembayaran.jpg');
                  }
                }}
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
