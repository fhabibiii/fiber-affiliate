
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Phone } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ui/responsive-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const AffiliatorDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  });

  // Mock affiliator data
  const affiliator = {
    uuid: id,
    fullName: 'John Doe',
    phoneNumber: '081234567890',
    username: 'johndoe',
    joinDate: '2024-01-15T00:00:00Z'
  };

  // Mock customer data for this affiliator
  const customers = [
    {
      uuid: '1',
      fullName: 'Alice Johnson',
      phoneNumber: '081111111111',
      address: 'Jl. Merdeka No. 123, Jakarta',
      joinDate: '2024-02-01T00:00:00Z'
    },
    {
      uuid: '2',
      fullName: 'Bob Wilson',
      phoneNumber: '081222222222',
      address: 'Jl. Sudirman No. 456, Jakarta',
      joinDate: '2024-02-15T00:00:00Z'
    },
    {
      uuid: '3',
      fullName: 'Carol Davis',
      phoneNumber: '081333333333',
      address: 'Jl. Thamrin No. 789, Jakarta',
      joinDate: '2024-03-01T00:00:00Z'
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
        customer.address,
        new Date(customer.joinDate).toLocaleDateString('id-ID')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pelanggan-${affiliator.fullName}.csv`;
    link.click();
  };

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      address: customer.address
    });
    setShowEditModal(true);
  };

  const handleDelete = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Data pelanggan berhasil diperbarui",
      });

      setShowEditModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data pelanggan",
        variant: "destructive"
      });
    }
  };

  const handleSubmitAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil ditambahkan",
      });

      setShowAddCustomerModal(false);
      setFormData({ fullName: '', phoneNumber: '', address: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan pelanggan",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil dihapus",
      });

      setShowDeleteModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pelanggan",
        variant: "destructive"
      });
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
          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
        >
          {value}
          <Phone className="w-3 h-3" />
        </button>
      )
    },
    {
      key: 'address',
      label: 'Alamat'
    },
    {
      key: 'joinDate',
      label: 'Tanggal Bergabung',
      render: (value: string) => new Date(value).toLocaleDateString('id-ID')
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informasi Affiliator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No. HP</p>
              <button
                onClick={() => handleWhatsAppClick(affiliator.phoneNumber)}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                {affiliator.phoneNumber}
                <Phone className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{affiliator.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tanggal Bergabung</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(affiliator.joinDate).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Pelanggan</CardTitle>
            <Button onClick={() => setShowAddCustomerModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pelanggan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveTable
            data={customers}
            columns={columns}
            onExport={handleExportCSV}
            actions={actions}
          />
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
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Tambah Pelanggan
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
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
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
            <p>Apakah Anda yakin ingin menghapus pelanggan <strong>{selectedCustomer?.fullName}</strong>?</p>
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
    </div>
  );
};

export default AffiliatorDetail;
