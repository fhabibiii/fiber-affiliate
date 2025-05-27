
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Phone, MapPin, Calendar } from 'lucide-react';
import { indonesianTexts } from '@/constants/texts';

const AffiliatorDashboard: React.FC = () => {
  // Mock customer data
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
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {indonesianTexts.navigation.customerList}
        </h1>
        <p className="text-gray-600 mt-2">
          Daftar pelanggan yang telah Anda daftarkan
        </p>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total Pelanggan Anda
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-6">
        {customers.map((customer) => (
          <Card key={customer.uuid} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {customer.fullName}
                  </h3>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{customer.phoneNumber}</span>
                  </div>
                  
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{customer.fullAddress}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {formatDate(customer.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no customers) */}
      {customers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Pelanggan
            </h3>
            <p className="text-gray-600">
              Anda belum memiliki pelanggan yang terdaftar
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AffiliatorDashboard;
