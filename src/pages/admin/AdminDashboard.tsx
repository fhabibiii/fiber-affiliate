
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, CreditCard, TrendingUp } from 'lucide-react';
import { indonesianTexts } from '@/constants/texts';

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = {
    totalAffiliators: 24,
    totalCustomers: 156,
    monthlyPayments: 12400000,
  };

  const statCards = [
    {
      title: 'Total Affiliator',
      value: stats.totalAffiliators,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Total Pelanggan',
      value: stats.totalCustomers,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Pembayaran',
      value: `Rp ${stats.monthlyPayments.toLocaleString('id-ID')}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  // Mock data for monthly customer statistics
  const monthlyStats = [
    { month: 'Jan', customers: 8 },
    { month: 'Feb', customers: 12 },
    { month: 'Mar', customers: 18 },
    { month: 'Apr', customers: 15 },
    { month: 'Mei', customers: 22 },
    { month: 'Jun', customers: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {indonesianTexts.navigation.dashboard}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ringkasan aktivitas dan statistik affiliate Fibernode
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
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

      {/* Monthly Customer Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Pelanggan Baru per Bulan (2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{stat.month}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stat.customers / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {stat.customers}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
