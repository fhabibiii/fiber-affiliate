
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const AddPayment: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    affiliatorId: '',
    month: '',
    year: new Date().getFullYear().toString(),
    amount: ''
  });

  // Mock affiliator data
  const affiliators = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' }
  ];

  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setProofFile(file);
      } else {
        toast({
          title: "Error",
          description: "File harus berupa gambar",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setProofFile(file);
      } else {
        toast({
          title: "Error",
          description: "File harus berupa gambar",
          variant: "destructive"
        });
      }
    }
  };

  const validateForm = () => {
    if (!formData.affiliatorId) {
      toast({
        title: "Error",
        description: "Affiliator harus dipilih",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.month) {
      toast({
        title: "Error",
        description: "Bulan harus dipilih",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Jumlah bayar harus diisi dan lebih dari 0",
        variant: "destructive"
      });
      return false;
    }

    if (!paymentDate) {
      toast({
        title: "Error",
        description: "Tanggal bayar harus dipilih",
        variant: "destructive"
      });
      return false;
    }

    if (!proofFile) {
      toast({
        title: "Error",
        description: "Bukti pembayaran harus diupload",
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
        description: "Pembayaran berhasil ditambahkan",
      });

      // Navigate to payment history for this affiliator
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

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tambah Pembayaran
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tambahkan pembayaran baru untuk affiliator
        </p>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Bulan *</Label>
                <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
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
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  min="2020"
                  max="2030"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah Bayar *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <Input
                  id="amount"
                  type="text"
                  value={formatCurrency(formData.amount)}
                  onChange={(e) => handleInputChange('amount', e.target.value.replace(/\D/g, ''))}
                  className="pl-12"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Bayar *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !paymentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {paymentDate ? format(paymentDate, "dd MMMM yyyy") : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={setPaymentDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Upload Foto Bukti *</Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                  dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600",
                  "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="proof-upload"
                />
                {proofFile ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(proofFile)}
                      alt="Preview"
                      className="max-w-full max-h-48 mx-auto rounded"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{proofFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setProofFile(null)}
                    >
                      Hapus
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('proof-upload')?.click()}
                      >
                        Pilih File
                      </Button>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        atau drag & drop gambar di sini
                      </p>
                    </div>
                  </div>
                )}
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
