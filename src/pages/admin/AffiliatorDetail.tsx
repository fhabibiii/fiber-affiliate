
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ui/responsive-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { formatWhatsAppNumber, formatIndonesianDate } from '@/utils/formatUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Affiliator, Customer } from '@/services/api';

const AffiliatorDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    fullAddress: ''
  });

  // Fetch affiliator data
  const { data: affiliator, isLoading: isLoadingAffiliator, error: affiliatorError } = useQuery({
    queryKey: ['affiliator', id],
    queryFn: () => apiService.getAffiliator(id!),
    enabled: !!id,
  });

  // Fetch customers by affiliator
  const { data: customersData, isLoading: isLoadingCustomers, error: customersError } = useQuery({
    queryKey: ['customers-by-affiliator', id],
    queryFn: () => apiService.getCustomersByAffiliator(id!, 1, 100),
    enabled: !!id,
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: (data: Omit<Customer, 'uuid' | 'createdAt' | 'affiliatorName'>) => 
      apiService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-by-affiliator', id] });
      queryClient.invalidateQueries({ queryKey: ['affiliator', id] });
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil ditambahkan",
      });
      setShowAddCustomerModal(false);
      setFormData({ fullName: '', phoneNumber: '', fullAddress: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan pelanggan",
        variant: "destructive"
      });
    }
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<Customer> }) => 
      apiService.updateCustomer(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-by-affiliator', id] });
      toast({
        title: "Berhasil",
        description: "Data pelanggan berhasil diperbarui",
      });
      setShowEditModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui data pelanggan",
        variant: "destructive"
      });
    }
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: (uuid: string) => apiService.deleteCustomer(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-by-affiliator', id] });
      queryClient.invalidateQueries({ queryKey: ['affiliator', id] });
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil dihapus",
      });
      setShowDeleteModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus pelanggan",
        variant: "destructive"
      });
    }
  });

  const customers = customersData?.data || [];

  const handleWhatsAppClick = (phoneNumber: string) => {
    const formattedNumber = formatWhatsAppNumber(phoneNumber);
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Nama Lengkap', 'No. HP', 'Alamat', 'Tanggal Bergabung'],
      ...customers.map(customer => [
        customer.fullName,
        customer.phoneNumber,
        customer.fullAddress,
        formatIndonesianDate(customer.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pelanggan-${affiliator?.fullName || 'affiliator'}.csv`;
    link.click();
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      fullAddress: customer.fullAddress
    });
    setShowEditModal(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    
    updateCustomerMutation.mutate({
      uuid: selectedCustomer.uuid,
      data: {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        fullAddress: formData.fullAddress,
        affiliatorUuid: id!
      }
    });
  };

  const handleSubmitAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createCustomerMutation.mutate({
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      fullAddress: formData.fullAddress,
      affiliatorUuid: id!
    });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;
    deleteCustomerMutation.mutate(selectedCustomer.uuid);
  };

  if (isLoadingAffiliator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Memuat data affiliator...</div>
      </div>
    );
  }

  if (affiliatorError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {(affiliatorError as any)?.message || 'Failed to load affiliator'}</div>
      </div>
    );
  }

  if (!affiliator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Affiliator tidak ditemukan</div>
      </div>
    );
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Nama Lengkap'
    },
    {
      key: 'phoneNumber',
      label: 'No. HP',
      render: (value: string) => (
        <button
          onClick={() => handleWhatsAppClick(value)}
          className="text-blue-900 dark:text-gray-300 font-medium hover:opacity-80 transition-opacity"
        >
          {value}
        </button>
      )
    },
    {
      key: 'fullAddress',
      label: 'Alamat'
    },
    {
      key: 'createdAt',
      label: 'Tanggal Bergabung',
      render: (value: string) => formatIndonesianDate(value)
    }
  ];

  const actions = (row: Customer) => (
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
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {affiliator.fullName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Daftar pelanggan dari affiliator ini
        </p>
      </div>

      {/* Affiliator Info */}
      <div className="block md:hidden">
        <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <Card className="w-full">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-left text-base">Informasi Affiliator</CardTitle>
                {isInfoOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">No. HP</p>
                    <button
                      onClick={() => handleWhatsAppClick(affiliator.phoneNumber)}
                      className="text-xs font-semibold text-blue-900 dark:text-gray-300 hover:opacity-80 transition-opacity"
                    >
                      {affiliator.phoneNumber}
                    </button>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Username</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{affiliator.username}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Tanggal Bergabung</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {formatIndonesianDate(affiliator.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Jumlah Pelanggan</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{customers.length}</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      <div className="hidden md:block">
        <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <Card className="w-full">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <CardTitle className="text-left text-base">Informasi Affiliator</CardTitle>
                {isInfoOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No. HP</p>
                    <button
                      onClick={() => handleWhatsAppClick(affiliator.phoneNumber)}
                      className="text-sm font-semibold text-blue-900 dark:text-gray-300 hover:opacity-80 transition-opacity"
                    >
                      {affiliator.phoneNumber}
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{affiliator.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tanggal Bergabung</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatIndonesianDate(affiliator.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Jumlah Pelanggan</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{customers.length}</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Customer Table */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Daftar Pelanggan</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {/* Mobile Controls - Above search bar */}
          <div className="md:hidden mb-4">
            <div className="flex gap-2 w-full">
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowAddCustomerModal(true)} size="sm" className="flex-1">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isLoadingCustomers ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg">Memuat data pelanggan...</div>
            </div>
          ) : customersError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">Error: {(customersError as any)?.message || 'Failed to load customers'}</div>
            </div>
          ) : (
            <ResponsiveTable
              data={customers}
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
                  <Button onClick={() => setShowAddCustomerModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Pelanggan
                  </Button>
                </div>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <Dialog open={showAddCustomerModal} onOpenChange={setShowAddCustomerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitAddCustomer} className="space-y-4">
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
              <Label htmlFor="addFullName">Nama Lengkap</Label>
              <Input
                id="addFullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addPhoneNumber">No. HP</Label>
              <Input
                id="addPhoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addAddress">Alamat</Label>
              <Textarea
                id="addAddress"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={createCustomerMutation.isPending}
            >
              {createCustomerMutation.isPending ? 'Menambah...' : 'Tambah Pelanggan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Pelanggan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editFullName">Nama Lengkap</Label>
              <Input
                id="editFullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhoneNumber">No. HP</Label>
              <Input
                id="editPhoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAddress">Alamat</Label>
              <Textarea
                id="editAddress"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={updateCustomerMutation.isPending}
            >
              {updateCustomerMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin menghapus pelanggan <strong>{selectedCustomer?.fullName}</strong>?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={deleteCustomerMutation.isPending}
              >
                {deleteCustomerMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliatorDetail;
