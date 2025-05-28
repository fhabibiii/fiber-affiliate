
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
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    affiliatorId: '',
    fullName: '',
    phoneNumber: '',
    address: ''
  });

  // Mock affiliator data
  const affiliators = [
    { uuid: '1', fullName: 'John Doe' },
    { uuid: '2', fullName: 'Jane Smith' },
    { uuid: '3', fullName: 'Bob Johnson' },
    { uuid: '4', fullName: 'Alice Wilson' },
    { uuid: '5', fullName: 'Charlie Brown' }
  ];

  const filteredAffiliators = affiliators.filter(affiliator =>
    affiliator.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil ditambahkan",
      });

      setFormData({
        affiliatorId: '',
        fullName: '',
        phoneNumber: '',
        address: ''
      });
      setSearchTerm('');
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
    <div className="w-full h-full overflow-y-auto scrollbar-hide mb-6 sm:mb-0">
      <style>
        {`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}
      </style>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tambah Pelanggan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tambahkan pelanggan baru ke dalam sistem
          </p>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Data Pelanggan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="affiliator">Affiliator</Label>
                <Select value={formData.affiliatorId} onValueChange={(value) => setFormData({ ...formData, affiliatorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Affiliator" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        type="text"
                        placeholder="Cari affiliator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {filteredAffiliators.length > 0 ? (
                      filteredAffiliators.map((affiliator) => (
                        <SelectItem key={affiliator.uuid} value={affiliator.uuid}>
                          {affiliator.fullName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Tidak ada affiliator ditemukan
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">No. HP</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Menambahkan...' : 'Tambah Pelanggan'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCustomer;
