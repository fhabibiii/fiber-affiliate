
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddCustomer: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    affiliatorId: ''
  });
  
  const [affiliatorSearch, setAffiliatorSearch] = useState('');
  const [showAffiliatorDropdown, setShowAffiliatorDropdown] = useState(false);

  // Mock affiliator data
  const mockAffiliators = [
    { uuid: '1', fullName: 'John Doe' },
    { uuid: '2', fullName: 'Jane Smith' },
    { uuid: '3', fullName: 'Bob Johnson' },
    { uuid: '4', fullName: 'Alice Brown' },
    { uuid: '5', fullName: 'Charlie Wilson' },
    { uuid: '6', fullName: 'Diana Chen' },
    { uuid: '7', fullName: 'Edward Martinez' },
    { uuid: '8', fullName: 'Fiona Davis' }
  ];

  const filteredAffiliators = mockAffiliators.filter(affiliator =>
    affiliator.fullName.toLowerCase().includes(affiliatorSearch.toLowerCase())
  );

  const selectedAffiliator = mockAffiliators.find(a => a.uuid === formData.affiliatorId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAffiliatorSelect = (affiliatorId: string) => {
    setFormData(prev => ({
      ...prev,
      affiliatorId
    }));
    setShowAffiliatorDropdown(false);
    setAffiliatorSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.affiliatorId) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive"
      });
      return;
    }

    console.log('Adding customer:', formData);
    
    toast({
      title: "Berhasil",
      description: "Pelanggan baru berhasil ditambahkan"
    });

    // Reset form
    setFormData({
      fullName: '',
      phoneNumber: '',
      address: '',
      affiliatorId: ''
    });
  };

  return (
    <div className="space-y-6 w-full max-w-full h-full overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tambah Pelanggan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tambahkan pelanggan baru untuk affiliator
        </p>
      </div>

      {/* Form Card */}
      <Card className="w-full mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle>Informasi Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">No. HP</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Masukkan nomor HP"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
              />
            </div>

            {/* Address - Changed to Textarea */}
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                placeholder="Masukkan alamat lengkap"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>

            {/* Affiliator Selection with Search */}
            <div className="space-y-2 relative">
              <Label htmlFor="affiliator">Affiliator</Label>
              <div className="relative">
                <div 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  onClick={() => setShowAffiliatorDropdown(!showAffiliatorDropdown)}
                >
                  <span className={selectedAffiliator ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedAffiliator ? selectedAffiliator.fullName : 'Pilih Affiliator'}
                  </span>
                  <Search className="h-4 w-4 opacity-50" />
                </div>

                {showAffiliatorDropdown && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="Cari Affiliator..."
                          value={affiliatorSearch}
                          onChange={(e) => setAffiliatorSearch(e.target.value)}
                          className="pl-10 pr-8 py-2 text-sm"
                          autoFocus
                        />
                        {affiliatorSearch && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAffiliatorSearch('');
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto p-1">
                      {filteredAffiliators.length > 0 ? (
                        filteredAffiliators.map((affiliator) => (
                          <div
                            key={affiliator.uuid}
                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleAffiliatorSelect(affiliator.uuid)}
                          >
                            {affiliator.fullName}
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          Tidak ada affiliator ditemukan
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Tambah Pelanggan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCustomer;
