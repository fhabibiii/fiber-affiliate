
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, CreditCard, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
      title: 'Pembayaran Bulan Ini',
      value: `Rp ${stats.monthlyPayments.toLocaleString('id-ID')}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  // Mock data for monthly customer statistics
  const monthlyCustomerData = [
    { month: 'Jan', customers: 8 },
    { month: 'Feb', customers: 12 },
    { month: 'Mar', customers: 18 },
    { month: 'Apr', customers: 15 },
    { month: 'Mei', customers: 22 },
    { month: 'Jun', customers: 28 },
    { month: 'Jul', customers: 35 },
    { month: 'Agu', customers: 30 },
    { month: 'Sep', customers: 42 },
    { month: 'Okt', customers: 38 },
    { month: 'Nov', customers: 45 },
    { month: 'Des', customers: 50 }
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

      {/* Monthly Customer Statistics Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Pelanggan Baru per Bulan (2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyCustomerData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="Pelanggan Baru"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
