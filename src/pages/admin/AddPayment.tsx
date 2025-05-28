
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

const AddPayment: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
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
    { uuid: '4', fullName: 'Alice Brown' },
    { uuid: '5', fullName: 'Charlie Wilson' },
    { uuid: '6', fullName: 'Diana Davis' },
    { uuid: '7', fullName: 'Edward Miller' },
    { uuid: '8', fullName: 'Fiona Garcia' },
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const filteredAffiliators = useMemo(() => {
    return affiliators.filter(affiliator =>
      affiliator.fullName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const selectedAffiliator = affiliators.find(a => a.uuid === formData.affiliatorId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Error",
          description: "Ukuran file maksimal 10MB",
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
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-6">
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
                                    setFormData({ ...formData, affiliatorId: affiliator.uuid });
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
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      required
                    />
                  </div>
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
                            PNG, JPG, JPEG hingga 10MB
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
      </ScrollArea>
    </div>
  );
};

export default AddPayment;
