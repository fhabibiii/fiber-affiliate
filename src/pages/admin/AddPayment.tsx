
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const AddPayment: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    affiliator: '',
    month: '',
    year: '',
    amount: '',
    paymentDate: null as Date | null,
    proofImage: null as File | null
  });

  // Mock affiliators data
  const affiliators = [
    { uuid: '1', fullName: 'John Doe' },
    { uuid: '2', fullName: 'Jane Smith' },
    { uuid: '3', fullName: 'Bob Wilson' }
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil ditambahkan",
      });

      setFormData({
        affiliator: '',
        month: '',
        year: '',
        amount: '',
        paymentDate: null,
        proofImage: null
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan pembayaran",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tambah Pembayaran
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tambahkan pembayaran baru untuk affiliator
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Tambah Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affiliator">Affiliator</Label>
              <Select 
                value={formData.affiliator} 
                onValueChange={(value) => setFormData({ ...formData, affiliator: value })}
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

            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
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
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="Masukkan tahun"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Masukkan jumlah pembayaran"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Tanggal Bayar</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.paymentDate && "text-muted-foreground"
                    )}
                  >
                    {formData.paymentDate ? (
                      format(formData.paymentDate, "PPP", { locale: id })
                    ) : (
                      <span>Pilih tanggal pembayaran</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.paymentDate}
                    onSelect={(date) => setFormData({ ...formData, paymentDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proofImage">Bukti Pembayaran</Label>
              <Input
                id="proofImage"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, proofImage: e.target.files?.[0] || null })}
              />
              <p className="text-xs text-gray-500">Maksimal ukuran file 10MB</p>
            </div>

            <Button type="submit" className="w-full">
              Tambah Pembayaran
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPayment;
