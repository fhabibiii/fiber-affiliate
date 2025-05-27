
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CreditCard, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { indonesianTexts } from '@/constants/texts';

const AdminDashboard: React.FC = () => {
  const [customerYear, setCustomerYear] = useState('2024');
  const [transferYear, setTransferYear] = useState('2024');

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

  // Mock data for monthly transfer statistics
  const monthlyTransferData = [
    { month: 'Jan', transfer: 5200000 },
    { month: 'Feb', transfer: 6800000 },
    { month: 'Mar', transfer: 8100000 },
    { month: 'Apr', transfer: 7500000 },
    { month: 'Mei', transfer: 9200000 },
    { month: 'Jun', transfer: 10800000 },
    { month: 'Jul', transfer: 12500000 },
    { month: 'Agu', transfer: 11200000 },
    { month: 'Sep', transfer: 13800000 },
    { month: 'Okt', transfer: 12900000 },
    { month: 'Nov', transfer: 15200000 },
    { month: 'Des', transfer: 16800000 }
  ];

  const availableYears = ['2022', '2023', '2024'];

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {indonesianTexts.navigation.dashboard}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
          Ringkasan aktivitas dan statistik affiliate Fibernode
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow w-full">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white break-words">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor} flex-shrink-0 ml-4`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Monthly Customer Statistics Chart */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-900 dark:text-white text-lg md:text-xl">Pelanggan Baru</CardTitle>
            <Select value={customerYear} onValueChange={setCustomerYear}>
              <SelectTrigger className="w-20 md:w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-60 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCustomerData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-gray-600 dark:text-gray-400"
                    fontSize={12}
                  />
                  <YAxis className="text-gray-600 dark:text-gray-400" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
                    name="Pelanggan Baru"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Transfer Statistics Chart */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-900 dark:text-white text-lg md:text-xl">Total Transfer</CardTitle>
            <Select value={transferYear} onValueChange={setTransferYear}>
              <SelectTrigger className="w-20 md:w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-60 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTransferData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-gray-600 dark:text-gray-400"
                    fontSize={12}
                  />
                  <YAxis 
                    className="text-gray-600 dark:text-gray-400" 
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total Transfer']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="transfer" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
                    name="Total Transfer"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
