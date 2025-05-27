
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AddCustomer: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    affiliatorId: ''
  });

  // Mock affiliator data
  const affiliators = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Error",
        description: "Nama lengkap harus diisi",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Nomor HP harus diisi",
        variant: "destructive"
      });
      return false;
    }

    // Simple phone number validation
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Error",
        description: "Format nomor HP tidak valid",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.address.trim()) {
      toast({
        title: "Error",
        description: "Alamat lengkap harus diisi",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.affiliatorId) {
      toast({
        title: "Error",
        description: "Affiliator harus dipilih",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil ditambahkan",
      });

      // Reset form
      setFormData({
        fullName: '',
        phoneNumber: '',
        address: '',
        affiliatorId: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan pelanggan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tambah Pelanggan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tambahkan pelanggan baru ke sistem
        </p>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap Pelanggan *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Masukkan nama lengkap pelanggan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">No. HP *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Contoh: 081234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Masukkan alamat lengkap pelanggan"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliator">Pilih Affiliator *</Label>
              <Select value={formData.affiliatorId} onValueChange={(value) => handleInputChange('affiliatorId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih affiliator" />
                </SelectTrigger>
                <SelectContent>
                  {affiliators.map((affiliator) => (
                    <SelectItem key={affiliator.id} value={affiliator.id}>
                      {affiliator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Menambahkan...' : 'Tambah Pelanggan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCustomer;
