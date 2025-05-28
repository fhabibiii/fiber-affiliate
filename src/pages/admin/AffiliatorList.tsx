
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import ResponsiveTable from '@/components/ui/responsive-table';
import { useNavigate } from 'react-router-dom';

const AffiliatorList: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAffiliator, setSelectedAffiliator] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    username: '',
    password: ''
  });

  // Mock affiliator data
  const affiliators = [
    {
      uuid: '1',
      fullName: 'John Doe',
      phoneNumber: '081234567890',
      username: 'johndoe',
      customerCount: 15,
      joinDate: '2024-01-15T00:00:00Z'
    },
    {
      uuid: '2',
      fullName: 'Jane Smith',
      phoneNumber: '081234567891',
      username: 'janesmith',
      customerCount: 23,
      joinDate: '2024-02-10T00:00:00Z'
    },
    {
      uuid: '3',
      fullName: 'Bob Johnson',
      phoneNumber: '081234567892',
      username: 'bobjohnson',
      customerCount: 8,
      joinDate: '2024-03-05T00:00:00Z'
    }
  ];

  const formatWhatsAppNumber = (phoneNumber: string) => {
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '62' + cleanNumber.substring(1);
    } else if (!cleanNumber.startsWith('62')) {
      cleanNumber = '62' + cleanNumber;
    }
    return cleanNumber;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Nama Lengkap', 'No. HP', 'Username', 'Jumlah Pelanggan', 'Tanggal Bergabung'],
      ...affiliators.map(affiliator => [
        affiliator.fullName,
        affiliator.phoneNumber,
        affiliator.username,
        affiliator.customerCount,
        formatDate(affiliator.joinDate)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daftar-affiliator.csv';
    link.click();
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
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Berhasil",
        description: showEditModal ? "Affiliator berhasil diperbarui" : "Affiliator berhasil ditambahkan",
      });

      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ fullName: '', phoneNumber: '', username: '', password: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data affiliator",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Affiliator berhasil dihapus",
      });

      setShowDeleteModal(false);
      setSelectedAffiliator(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus affiliator",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
        <a
          href={`https://wa.me/${formatWhatsAppNumber(value)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-900 hover:text-blue-700"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </a>
      )
    },
    {
      key: 'username',
      label: 'Username'
    },
    {
      key: 'customerCount',
      label: 'Jumlah Pelanggan'
    },
    {
      key: 'joinDate',
      label: 'Tanggal Bergabung',
      render: (value: string) => formatDate(value)
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Daftar Affiliator
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                Kelola semua affiliator dalam sistem
              </p>
            </div>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button className="sm:hidden w-10 h-10 p-0">
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
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {loading ? 'Menambahkan...' : 'Tambah Affiliator'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="hidden sm:flex">
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
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Menambahkan...' : 'Tambah Affiliator'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Affiliator Table */}
      <Card>
        <CardContent className="p-6">
          <ResponsiveTable
            data={affiliators}
            columns={columns}
            onExport={handleExportCSV}
            actions={actions}
            onRowClick={handleRowClick}
          />
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
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
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliatorList;
