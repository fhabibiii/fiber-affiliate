
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CreditCard, TrendingUp, ArrowUpDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { indonesianTexts } from '@/constants/texts';

const AdminDashboard: React.FC = () => {
  const [selectedCustomerYear, setSelectedCustomerYear] = useState('2024');
  const [selectedTransferYear, setSelectedTransferYear] = useState('2024');

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

  // Mock data for years
  const availableYears = ['2024', '2023', '2022'];

  // Mock data for monthly customer statistics
  const customerDataByYear = {
    '2024': [
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
    ],
    '2023': [
      { month: 'Jan', customers: 5 },
      { month: 'Feb', customers: 8 },
      { month: 'Mar', customers: 12 },
      { month: 'Apr', customers: 10 },
      { month: 'Mei', customers: 15 },
      { month: 'Jun', customers: 20 },
      { month: 'Jul', customers: 25 },
      { month: 'Agu', customers: 22 },
      { month: 'Sep', customers: 28 },
      { month: 'Okt', customers: 32 },
      { month: 'Nov', customers: 35 },
      { month: 'Des', customers: 40 }
    ],
    '2022': [
      { month: 'Jan', customers: 2 },
      { month: 'Feb', customers: 4 },
      { month: 'Mar', customers: 6 },
      { month: 'Apr', customers: 5 },
      { month: 'Mei', customers: 8 },
      { month: 'Jun', customers: 12 },
      { month: 'Jul', customers: 15 },
      { month: 'Agu', customers: 18 },
      { month: 'Sep', customers: 20 },
      { month: 'Okt', customers: 22 },
      { month: 'Nov', customers: 25 },
      { month: 'Des', customers: 28 }
    ]
  };

  // Mock data for transfer statistics
  const transferDataByYear = {
    '2024': [
      { month: 'Jan', transfer: 15000000 },
      { month: 'Feb', transfer: 18000000 },
      { month: 'Mar', transfer: 22000000 },
      { month: 'Apr', transfer: 20000000 },
      { month: 'Mei', transfer: 25000000 },
      { month: 'Jun', transfer: 30000000 },
      { month: 'Jul', transfer: 35000000 },
      { month: 'Agu', transfer: 32000000 },
      { month: 'Sep', transfer: 38000000 },
      { month: 'Okt', transfer: 42000000 },
      { month: 'Nov', transfer: 45000000 },
      { month: 'Des', transfer: 50000000 }
    ],
    '2023': [
      { month: 'Jan', transfer: 8000000 },
      { month: 'Feb', transfer: 12000000 },
      { month: 'Mar', transfer: 15000000 },
      { month: 'Apr', transfer: 14000000 },
      { month: 'Mei', transfer: 18000000 },
      { month: 'Jun', transfer: 22000000 },
      { month: 'Jul', transfer: 25000000 },
      { month: 'Agu', transfer: 23000000 },
      { month: 'Sep', transfer: 28000000 },
      { month: 'Okt', transfer: 32000000 },
      { month: 'Nov', transfer: 35000000 },
      { month: 'Des', transfer: 40000000 }
    ],
    '2022': [
      { month: 'Jan', transfer: 3000000 },
      { month: 'Feb', transfer: 5000000 },
      { month: 'Mar', transfer: 8000000 },
      { month: 'Apr', transfer: 7000000 },
      { month: 'Mei', transfer: 10000000 },
      { month: 'Jun', transfer: 12000000 },
      { month: 'Jul', transfer: 15000000 },
      { month: 'Agu', transfer: 18000000 },
      { month: 'Sep', transfer: 20000000 },
      { month: 'Okt', transfer: 22000000 },
      { month: 'Nov', transfer: 25000000 },
      { month: 'Des', transfer: 28000000 }
    ]
  };

  const monthlyCustomerData = customerDataByYear[selectedCustomerYear as keyof typeof customerDataByYear] || customerDataByYear['2024'];
  const monthlyTransferData = transferDataByYear[selectedTransferYear as keyof typeof transferDataByYear] || transferDataByYear['2024'];

  return (
    <div className="space-y-6 w-full max-w-full h-full overflow-y-auto">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0 ml-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-4 sm:mb-6">
        {/* Monthly Customer Statistics Chart */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-900 dark:text-white text-lg">Pelanggan Baru</CardTitle>
            <Select value={selectedCustomerYear} onValueChange={setSelectedCustomerYear}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Tahun" />
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
            <div className="h-80 w-full flex items-center justify-center">
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

        {/* Total Transfer Statistics Chart */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-900 dark:text-white text-lg">Total Transfer</CardTitle>
            <Select value={selectedTransferYear} onValueChange={setSelectedTransferYear}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Tahun" />
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
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTransferData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    className="text-gray-600 dark:text-gray-400"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Total Transfer']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="transfer" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
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
