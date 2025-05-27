
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { indonesianTexts } from '@/constants/texts';

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = {
    totalAffiliators: 24,
    totalCustomers: 156,
    monthlyPayments: 12400000,
    newCustomersThisMonth: 18
  };

  const statCards = [
    {
      title: 'Total Affiliator',
      value: stats.totalAffiliators,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Pelanggan',
      value: stats.totalCustomers,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pembayaran Bulan Ini',
      value: `Rp ${stats.monthlyPayments.toLocaleString('id-ID')}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pelanggan Baru',
      value: stats.newCustomersThisMonth,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {indonesianTexts.navigation.dashboard}
        </h1>
        <p className="text-gray-600 mt-2">
          Ringkasan aktivitas dan statistik affiliate Fibernode
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Affiliator Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'John Doe', date: '2 hari yang lalu', customers: 5 },
                { name: 'Jane Smith', date: '4 hari yang lalu', customers: 3 },
                { name: 'Bob Johnson', date: '1 minggu yang lalu', customers: 7 }
              ].map((affiliator, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{affiliator.name}</p>
                    <p className="text-sm text-gray-500">{affiliator.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {affiliator.customers} pelanggan
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pembayaran Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { affiliator: 'John Doe', amount: 2500000, date: '1 hari yang lalu' },
                { affiliator: 'Jane Smith', amount: 1800000, date: '3 hari yang lalu' },
                { affiliator: 'Bob Johnson', amount: 3200000, date: '5 hari yang lalu' }
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{payment.affiliator}</p>
                    <p className="text-sm text-gray-500">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
