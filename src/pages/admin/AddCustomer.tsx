
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiService } from '@/services/api';

const AddCustomer: React.FC = () => {
  const { showErrorToast, showSuccessToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phoneNumber: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.username || !formData.phoneNumber || !formData.password) {
      showErrorToast("Semua field harus diisi");
      return;
    }

    setLoading(true);

    try {
      await apiService.createAffiliator(formData);
      
      showSuccessToast("Affiliator berhasil ditambahkan");
      
      // Trigger sidebar refresh
      localStorage.setItem('affiliator-created', Date.now().toString());
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'affiliator-created',
        newValue: Date.now().toString()
      }));

      // Reset form
      setFormData({
        fullName: '',
        username: '',
        phoneNumber: '',
        password: ''
      });

      // Navigate to affiliator list
      navigate('/admin/affiliators');
    } catch (error) {
      console.error('Failed to create affiliator:', error);
      showErrorToast(error, "Gagal menambahkan affiliator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tambah Affiliator
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tambahkan affiliator baru untuk sistem Fibernode
            </p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Informasi Affiliator</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      placeholder="Masukkan username"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Nomor HP *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      placeholder="Contoh: +628123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      placeholder="Masukkan password"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? 'Menambahkan...' : 'Tambah Affiliator'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AddCustomer;
