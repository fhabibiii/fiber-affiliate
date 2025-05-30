
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, Loader2, Download } from 'lucide-react';
import ResponsiveTable from '@/components/ui/responsive-table';
import { useNavigate } from 'react-router-dom';
import { formatWhatsAppNumber, formatIndonesianDate } from '@/utils/formatUtils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const AffiliatorList: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAffiliator, setSelectedAffiliator] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    username: '',
    password: ''
  });

  // Fetch affiliators with React Query
  const { data: affiliatorsData, isLoading: isLoadingAffiliators, error } = useQuery({
    queryKey: ['affiliators'],
    queryFn: () => apiService.getAffiliators(1, 100, ''),
  });

  const affiliators = affiliatorsData?.data || [];

  // Create affiliator mutation
  const createAffiliatorMutation = useMutation({
    mutationFn: (data: { fullName: string; username: string; password: string; phoneNumber: string }) =>
      apiService.createAffiliator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliators'] });
      toast({
        title: "Berhasil",
        description: "Affiliator berhasil ditambahkan",
      });
      setShowAddModal(false);
      setFormData({ fullName: '', phoneNumber: '', username: '', password: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menambahkan affiliator",
        variant: "destructive"
      });
    },
  });

  // Update affiliator mutation
  const updateAffiliatorMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Partial<any> }) =>
      apiService.updateAffiliator(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliators'] });
      toast({
        title: "Berhasil",
        description: "Affiliator berhasil diperbarui",
      });
      setShowEditModal(false);
      setFormData({ fullName: '', phoneNumber: '', username: '', password: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui affiliator",
        variant: "destructive"
      });
    },
  });

  // Delete affiliator mutation
  const deleteAffiliatorMutation = useMutation({
    mutationFn: (uuid: string) => apiService.deleteAffiliator(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliators'] });
      toast({
        title: "Berhasil",
        description: "Affiliator berhasil dihapus",
      });
      setShowDeleteModal(false);
      setSelectedAffiliator(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus affiliator",
        variant: "destructive"
      });
    },
  });

  const handleExportCSV = () => {
    const csvContent = [
      ['Nama Lengkap', 'No. HP', 'Username', 'Jumlah Pelanggan', 'Tanggal Bergabung'],
      ...affiliators.map(affiliator => [
        affiliator.fullName,
        affiliator.phoneNumber,
        affiliator.username,
        affiliator.totalCustomers || 0,
        formatIndonesianDate(affiliator.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daftar-affiliator.csv';
    link.click();
  };

  const handleWhatsAppClick = (phoneNumber: string) => {
    const formattedNumber = formatWhatsAppNumber(phoneNumber);
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  const handleRowClick = (affiliator: any) => {
    navigate(`/admin/affiliators/${affiliator.uuid}`);
  };

  const handleEdit = (affiliator: any) => {
    setSelectedAffiliator(affiliator);
    setFormData({
      fullName: affiliator.fullName,
      phoneNumber: affiliator.phoneNumber,
      username: affiliator.username,
      password: ''
    });
    setShowEditModal(true);
  };

  const handleDelete = (affiliator: any) => {
    setSelectedAffiliator(affiliator);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showEditModal && selectedAffiliator) {
      const updateData: any = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        username: formData.username,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      updateAffiliatorMutation.mutate({
        uuid: selectedAffiliator.uuid,
        data: updateData
      });
    } else {
      createAffiliatorMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedAffiliator) {
      deleteAffiliatorMutation.mutate(selectedAffiliator.uuid);
    }
  };

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
      key: 'username',
      label: 'Username'
    },
    {
      key: 'totalCustomers',
      label: 'Jumlah Pelanggan',
      render: (value: number) => value || 0
    },
    {
      key: 'createdAt',
      label: 'Tanggal Bergabung',
      render: (value: string) => formatIndonesianDate(value)
    }
  ];

  const actions = (row: any) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(row);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(row);
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Daftar Affiliator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola semua affiliator dalam sistem
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">
                Error: {error.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Daftar Affiliator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Kelola semua affiliator dalam sistem
        </p>
      </div>

      {/* Affiliator Table */}
      <Card>
        <CardContent className="p-6">
          {/* Mobile buttons - Above search bar */}
          <div className="flex gap-2 mb-4 sm:hidden">
            <Button 
              onClick={handleExportCSV}
              variant="outline"
              className="flex-1"
              disabled={isLoadingAffiliators}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Affiliator Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">No. HP</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={createAffiliatorMutation.isPending} className="w-full">
                    {createAffiliatorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {createAffiliatorMutation.isPending ? 'Menambahkan...' : 'Tambah Affiliator'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <ResponsiveTable
            data={affiliators}
            columns={columns}
            actions={actions}
            onRowClick={handleRowClick}
            extraControls={
              <div className="hidden sm:flex gap-2">
                <Button 
                  onClick={handleExportCSV}
                  variant="outline"
                  disabled={isLoadingAffiliators}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Affiliator
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Affiliator Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nama Lengkap</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">No. HP</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={createAffiliatorMutation.isPending} className="w-full">
                        {createAffiliatorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {createAffiliatorMutation.isPending ? 'Menambahkan...' : 'Tambah Affiliator'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            }
          />

          {isLoadingAffiliators && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Memuat data affiliator...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Affiliator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="editUsername">Username</Label>
              <Input
                id="editUsername"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPassword">Password Baru (kosongkan jika tidak ingin mengubah)</Label>
              <Input
                id="editPassword"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Kosongkan jika tidak ingin mengubah"
              />
            </div>
            <Button type="submit" disabled={updateAffiliatorMutation.isPending} className="w-full">
              {updateAffiliatorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {updateAffiliatorMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
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
            <p>Apakah Anda yakin ingin menghapus affiliator <strong>{selectedAffiliator?.fullName}</strong>?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteAffiliatorMutation.isPending}>
                {deleteAffiliatorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {deleteAffiliatorMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliatorList;
