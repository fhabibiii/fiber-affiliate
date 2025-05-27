
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';

const AddPayment: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    affiliatorId: '',
    month: '',
    year: new Date().getFullYear().toString(),
    amount: '',
    paymentDate: '',
    proofImage: null as File | null
  });

  // Mock affiliator data
  const affiliators = [
    { uuid: '1', fullName: 'John Doe' },
    { uuid: '2', fullName: 'Jane Smith' },
    { uuid: '3', fullName: 'Bob Johnson' },
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive"
        });
        return;
      }
      setFormData({ ...formData, proofImage: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil ditambahkan",
      });

      // Navigate to payment history for the selected affiliator
      navigate(`/admin/payments/affiliator/${formData.affiliatorId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan pembayaran",
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
          Tambah Pembayaran
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tambahkan pembayaran komisi untuk affiliator
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Form Tambah Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Bulan *</Label>
                <Select 
                  value={formData.month} 
                  onValueChange={(value) => setFormData({ ...formData, month: value })}
                >
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
                <Label htmlFor="year">Tahun *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  min="2020"
                  max="2030"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Bayar *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="Masukkan jumlah pembayaran"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Tanggal Bayar *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proofImage">Upload Foto Bukti *</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="proofImage" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        {formData.proofImage ? formData.proofImage.name : 'Klik untuk upload atau drag & drop'}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG, JPEG hingga 5MB
                      </span>
                    </label>
                    <input
                      id="proofImage"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Menambahkan...' : 'Tambah Pembayaran'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPayment;
