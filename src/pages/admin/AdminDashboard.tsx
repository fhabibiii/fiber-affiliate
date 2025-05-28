
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
    { month: 'Jan', customers: 8, transfer: 2500000 },
    { month: 'Feb', customers: 12, transfer: 3200000 },
    { month: 'Mar', customers: 18, transfer: 4100000 },
    { month: 'Apr', customers: 15, transfer: 3800000 },
    { month: 'Mei', customers: 22, transfer: 5200000 },
    { month: 'Jun', customers: 28, transfer: 6100000 },
    { month: 'Jul', customers: 35, transfer: 7500000 },
    { month: 'Agu', customers: 30, transfer: 6800000 },
    { month: 'Sep', customers: 42, transfer: 8900000 },
    { month: 'Okt', customers: 38, transfer: 8200000 },
    { month: 'Nov', customers: 45, transfer: 9800000 },
    { month: 'Des', customers: 50, transfer: 11200000 }
  ];

  const availableYears = ['2022', '2023', '2024'];

  return (
    <div className="space-y-4 lg:space-y-6 w-full max-w-full">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {indonesianTexts.navigation.dashboard}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm lg:text-base">
          Ringkasan aktivitas dan statistik affiliate Fibernode
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow w-full">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white break-words">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 lg:p-3 rounded-lg ${stat.bgColor} flex-shrink-0 ml-4`}>
                  <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full">
        {/* Customer Chart */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-900 dark:text-white text-base lg:text-lg">Pelanggan Baru</CardTitle>
            <Select value={customerYear} onValueChange={setCustomerYear}>
              <SelectTrigger className="w-24">
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
            <div className="h-60 lg:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCustomerData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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

        {/* Transfer Chart */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-gray-900 dark:text-white text-base lg:text-lg">Total Transfer</CardTitle>
            <Select value={transferYear} onValueChange={setTransferYear}>
              <SelectTrigger className="w-24">
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
            <div className="h-60 lg:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCustomerData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Transfer']}
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
