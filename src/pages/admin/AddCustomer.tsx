
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    { uuid: '1', fullName: 'John Doe' },
    { uuid: '2', fullName: 'Jane Smith' },
    { uuid: '3', fullName: 'Bob Johnson' },
  ];

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast({
        title: "Error",
        description: "Format nomor HP tidak valid",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil ditambahkan",
      });

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
    <div className="space-y-6 w-full max-w-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tambah Pelanggan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tambahkan pelanggan baru ke sistem
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Form Tambah Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap Pelanggan *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder="Masukkan nama lengkap pelanggan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">No. HP *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                placeholder="Contoh: 081234567890"
              />
              <p className="text-sm text-gray-500">
                Format: 08xxxxxxxxxx atau +62xxxxxxxxxx
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                placeholder="Masukkan alamat lengkap pelanggan"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliator">Pilih Affiliator *</Label>
              <Select 
                value={formData.affiliatorId} 
                onValueChange={(value) => setFormData({ ...formData, affiliatorId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih affiliator" />
                </SelectTrigger>
                <SelectContent>
                  {affiliators.map((affiliator) => (
                    <SelectItem key={affiliator.uuid} value={affiliator.uuid}>
                      {affiliator.fullName}
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
