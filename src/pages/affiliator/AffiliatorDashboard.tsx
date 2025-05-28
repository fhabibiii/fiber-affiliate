import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { indonesianTexts } from '@/constants/texts';
import ResponsiveTable from '@/components/ui/responsive-table';

const AffiliatorDashboard: React.FC = () => {
  // Expanded mock customer data with 20 entries
  const customers = [
    {
      uuid: '1',
      fullName: 'Ahmad Santoso',
      phoneNumber: '08123456789',
      fullAddress: 'Jl. Merdeka No. 123, Jakarta Pusat',
      createdAt: '2024-01-15T08:30:00Z'
    },
    {
      uuid: '2',
      fullName: 'Siti Nurhaliza',
      phoneNumber: '08987654321',
      fullAddress: 'Jl. Sudirman No. 45, Jakarta Selatan',
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      uuid: '3',
      fullName: 'Budi Prasetyo',
      phoneNumber: '08555666777',
      fullAddress: 'Jl. Gatot Subroto No. 78, Jakarta Barat',
      createdAt: '2024-01-08T10:15:00Z'
    },
    {
      uuid: '4',
      fullName: 'Dewi Kartika Sari',
      phoneNumber: '08111222333',
      fullAddress: 'Jl. Thamrin No. 89, Jakarta Pusat',
      createdAt: '2024-01-20T09:45:00Z'
    },
    {
      uuid: '5',
      fullName: 'Rizki Pratama',
      phoneNumber: '08444555666',
      fullAddress: 'Jl. Kuningan No. 234, Jakarta Selatan',
      createdAt: '2024-01-25T16:30:00Z'
    },
    {
      uuid: '6',
      fullName: 'Maya Sari',
      phoneNumber: '08777888999',
      fullAddress: 'Jl. Kemang No. 567, Jakarta Selatan',
      createdAt: '2024-02-01T11:15:00Z'
    },
    {
      uuid: '7',
      fullName: 'Andi Wijaya',
      phoneNumber: '08222333444',
      fullAddress: 'Jl. Senayan No. 890, Jakarta Selatan',
      createdAt: '2024-02-05T13:20:00Z'
    },
    {
      uuid: '8',
      fullName: 'Lestari Indah',
      phoneNumber: '08555666777',
      fullAddress: 'Jl. Menteng No. 123, Jakarta Pusat',
      createdAt: '2024-02-10T10:30:00Z'
    },
    {
      uuid: '9',
      fullName: 'Fajar Nugroho',
      phoneNumber: '08888999000',
      fullAddress: 'Jl. Kebayoran No. 456, Jakarta Selatan',
      createdAt: '2024-02-15T15:45:00Z'
    },
    {
      uuid: '10',
      fullName: 'Ratna Dewi',
      phoneNumber: '08111333555',
      fullAddress: 'Jl. Pantai Indah No. 789, Jakarta Utara',
      createdAt: '2024-02-20T12:10:00Z'
    },
    {
      uuid: '11',
      fullName: 'Hendra Setiawan',
      phoneNumber: '08444666888',
      fullAddress: 'Jl. Kelapa Gading No. 012, Jakarta Utara',
      createdAt: '2024-02-25T14:25:00Z'
    },
    {
      uuid: '12',
      fullName: 'Sri Mulyani',
      phoneNumber: '08777000111',
      fullAddress: 'Jl. Cengkareng No. 345, Jakarta Barat',
      createdAt: '2024-03-01T09:00:00Z'
    },
    {
      uuid: '13',
      fullName: 'Bayu Pratama',
      phoneNumber: '08222444666',
      fullAddress: 'Jl. Kalideres No. 678, Jakarta Barat',
      createdAt: '2024-03-05T16:40:00Z'
    },
    {
      uuid: '14',
      fullName: 'Indira Sari',
      phoneNumber: '08555777999',
      fullAddress: 'Jl. Ciledug No. 901, Jakarta Barat',
      createdAt: '2024-03-10T11:55:00Z'
    },
    {
      uuid: '15',
      fullName: 'Doni Kurniawan',
      phoneNumber: '08888111222',
      fullAddress: 'Jl. Jelambar No. 234, Jakarta Barat',
      createdAt: '2024-03-15T13:30:00Z'
    },
    {
      uuid: '16',
      fullName: 'Ayu Lestari',
      phoneNumber: '08111444777',
      fullAddress: 'Jl. Pluit No. 567, Jakarta Utara',
      createdAt: '2024-03-20T10:15:00Z'
    },
    {
      uuid: '17',
      fullName: 'Rudi Hermawan',
      phoneNumber: '08444777000',
      fullAddress: 'Jl. Sunter No. 890, Jakarta Utara',
      createdAt: '2024-03-25T15:20:00Z'
    },
    {
      uuid: '18',
      fullName: 'Eka Putri',
      phoneNumber: '08777222333',
      fullAddress: 'Jl. Ancol No. 123, Jakarta Utara',
      createdAt: '2024-03-30T12:45:00Z'
    },
    {
      uuid: '19',
      fullName: 'Wahyu Santoso',
      phoneNumber: '08222555888',
      fullAddress: 'Jl. Pasar Minggu No. 456, Jakarta Selatan',
      createdAt: '2024-04-01T09:30:00Z'
    },
    {
      uuid: '20',
      fullName: 'Diana Sari',
      phoneNumber: '08555888111',
      fullAddress: 'Jl. Jagakarsa No. 789, Jakarta Selatan',
      createdAt: '2024-04-05T14:10:00Z'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Nama Lengkap', 'No. Telepon', 'Alamat', 'Tanggal Bergabung'],
      ...customers.map(customer => [
        customer.fullName,
        customer.phoneNumber,
        customer.fullAddress,
        formatDate(customer.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daftar-pelanggan.csv';
    link.click();
  };

  const formatName = (fullName: string) => {
    const words = fullName.split(' ');
    if (words.length <= 2) return fullName;
    
    return words.map((word, index) => {
      if (index === 0 || index === words.length - 1) {
        return word;
      }
      return word.charAt(0) + '.';
    }).join(' ');
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Nama',
      render: (value: string) => (
        <span className="block md:hidden">{formatName(value)}</span>
      ),
      fullRender: (value: string) => (
        <span className="hidden md:block">{value}</span>
      )
    },
    {
      key: 'phoneNumber',
      label: 'No. Telepon'
    },
    {
      key: 'fullAddress',
      label: 'Alamat'
    },
    {
      key: 'createdAt',
      label: 'Tanggal Bergabung',
      render: (value: string) => formatDate(value)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="text-center lg:text-left w-full lg:w-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {indonesianTexts.navigation.customerList}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Daftar pelanggan yang telah Anda daftarkan
          </p>
        </div>
        
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 w-full lg:w-auto">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Total Pelanggan
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {customers.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card className="w-full">
        <CardContent className="p-6">
          <ResponsiveTable
            data={customers}
            columns={columns}
            onExport={handleExportCSV}
          />
        </CardContent>
      </Card>

      {/* Empty State (if no customers) */}
      {customers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum Ada Pelanggan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Anda belum memiliki pelanggan yang terdaftar
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AffiliatorDashboard;
