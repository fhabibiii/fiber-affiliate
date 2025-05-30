import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, Search, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { apiService, Affiliator } from '@/services/api';
import { format } from 'date-fns';
import { formatIndonesianDate } from '@/utils/formatUtils';
import { cn } from '@/lib/utils';

const AddPayment: React.FC = () => {
  const { showErrorToast, showSuccessToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [affiliators, setAffiliators] = useState<Affiliator[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState({
    affiliatorUuid: '',
    month: '',
    year: new Date().getFullYear().toString(),
    amount: '',
    paymentDate: undefined as Date | undefined,
    proofImage: null as File | null,
    proofImageUrl: ''
  });

  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  useEffect(() => {
    const loadAffiliators = async () => {
      try {
        const response = await apiService.getAffiliators(1, 100);
        setAffiliators(response.data);
      } catch (error) {
        console.error('Failed to load affiliators:', error);
        showErrorToast(error, "Gagal memuat daftar affiliator");
      }
    };

    loadAffiliators();
  }, [showErrorToast]);

  const filteredAffiliators = useMemo(() => {
    return affiliators.filter(affiliator =>
      affiliator.fullName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [affiliators, searchValue]);

  const selectedAffiliator = affiliators.find(a => a.uuid === formData.affiliatorUuid);

  const handleFileChange = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showErrorToast("Ukuran file maksimal 10MB");
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await apiService.uploadProofPayment(file);
      setFormData({ 
        ...formData, 
        proofImage: file,
        proofImageUrl: uploadResult.url
      });
      showSuccessToast("File berhasil diupload");
    } catch (error) {
      console.error('Upload failed:', error);
      showErrorToast(error, "Gagal mengupload file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileChange(file);
      } else {
        showErrorToast("Hanya file gambar yang diperbolehkan");
      }
    }
  };

  const handleUploadAreaClick = () => {
    const fileInput = document.getElementById('proofImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.affiliatorUuid || !formData.month || !formData.year || !formData.amount || !formData.paymentDate || !formData.proofImageUrl) {
      showErrorToast("Semua field harus diisi");
      return;
    }

    setLoading(true);

    try {
      // Format date to yyyy-mm-dd for API
      const formattedDate = format(formData.paymentDate, 'yyyy-MM-dd');
      
      await apiService.createPayment({
        affiliatorUuid: formData.affiliatorUuid,
        month: formData.month,
        year: parseInt(formData.year),
        amount: parseInt(formData.amount),
        paymentDate: formattedDate,
        proofImage: formData.proofImageUrl
      });
      
      showSuccessToast("Pembayaran berhasil ditambahkan");

      // Navigate to payment history for the selected affiliator
      navigate(`/admin/payments/affiliator/${formData.affiliatorUuid}`);
    } catch (error) {
      console.error('Failed to create payment:', error);
      showErrorToast(error, "Gagal menambahkan pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Tambah Pembayaran
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tambahkan pembayaran komisi untuk affiliator
            </p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Informasi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="affiliator">Pilih Affiliator *</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {selectedAffiliator
                            ? selectedAffiliator.fullName
                            : "Pilih affiliator..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Cari affiliator..."
                            value={searchValue}
                            onValueChange={setSearchValue}
                          />
                          <CommandList>
                            <CommandEmpty>Tidak ada affiliator ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {filteredAffiliators.map((affiliator) => (
                                <CommandItem
                                  key={affiliator.uuid}
                                  value={affiliator.fullName}
                                  onSelect={() => {
                                    setFormData({ ...formData, affiliatorUuid: affiliator.uuid });
                                    setOpen(false);
                                    setSearchValue('');
                                  }}
                                >
                                  {affiliator.fullName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

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
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                      min="2020"
                      max="2030"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.paymentDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.paymentDate ? (
                            format(formData.paymentDate, "dd/MM/yyyy")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.paymentDate}
                          onSelect={(date) => {
                            setFormData({ ...formData, paymentDate: date });
                            setDatePickerOpen(false);
                          }}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proofImage">Upload Foto Bukti *</Label>
                  <div 
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
                      isDragOver 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                        : "border-gray-300 dark:border-gray-600",
                      uploading && "pointer-events-none opacity-50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadAreaClick}
                  >
                    <div className="text-center">
                      {uploading ? (
                        <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="mt-4">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          {formData.proofImage ? formData.proofImage.name : 'Klik untuk upload atau drag & drop'}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, JPEG hingga 10MB
                        </span>
                      </div>
                    </div>
                    <input
                      id="proofImage"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      required
                      disabled={uploading}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading || uploading} className="w-full">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? 'Menambahkan...' : 'Tambah Pembayaran'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
