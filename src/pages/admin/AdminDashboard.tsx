import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CreditCard, TrendingUp, UserPlus, Search, Calendar, Download, Filter } from 'lucide-react';
import { getMonthAbbreviation } from '@/utils/formatUtils';

// Sample data for the chart
const monthlyData = [
  { month: 0, name: 'Jan', customers: 45, payments: 12000000, affiliators: 8 },
  { month: 1, name: 'Feb', customers: 52, payments: 15000000, affiliators: 10 },
  { month: 2, name: 'Mar', customers: 48, payments: 13500000, affiliators: 9 },
  { month: 3, name: 'Apr', customers: 61, payments: 18000000, affiliators: 12 },
  { month: 4, name: 'Mei', customers: 55, payments: 16500000, affiliators: 11 },
  { month: 5, name: 'Jun', customers: 67, payments: 20000000, affiliators: 14 },
];

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6-months');
  const [selectedMetric, setSelectedMetric] = useState('customers');

  // Check if screen is small
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const stats = [
    {
      title: 'Total Affiliator',
      value: '14',
      icon: Users,
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Dari bulan lalu'
    },
    {
      title: 'Total Pelanggan',
      value: '328',
      icon: UserPlus,
      trend: '+8%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Dari bulan lalu'
    },
    {
      title: 'Total Pembayaran',
      value: 'Rp 95.000.000',
      icon: CreditCard,
      trend: '+15%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Dari bulan lalu'
    },
    {
      title: 'Rata-rata Per Affiliator',
      value: 'Rp 6.785.714',
      icon: TrendingUp,
      trend: '+3%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Dari bulan lalu'
    }
  ];

  const recentAffiliators = [
    { name: 'Ahmad Rizki', customers: 12, lastPayment: '2024-01-15', status: 'active', totalEarnings: 3500000 },
    { name: 'Siti Nurhaliza', customers: 8, lastPayment: '2024-01-14', status: 'active', totalEarnings: 2800000 },
    { name: 'Budi Santoso', customers: 15, lastPayment: '2024-01-13', status: 'pending', totalEarnings: 4200000 },
    { name: 'Maya Sari', customers: 6, lastPayment: '2024-01-12', status: 'active', totalEarnings: 1900000 },
    { name: 'Dedi Kurniawan', customers: 10, lastPayment: '2024-01-11', status: 'inactive', totalEarnings: 3100000 }
  ];

  const filteredAffiliators = recentAffiliators.filter(affiliator =>
    affiliator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getChartData = () => {
    return monthlyData.map(item => ({
      ...item,
      name: getMonthAbbreviation(item.month, isSmallScreen),
      [selectedMetric]: selectedMetric === 'customers' ? item.customers : 
                       selectedMetric === 'payments' ? item.payments / 1000000 : 
                       item.affiliators
    }));
  };

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'payments':
        return 'Pembayaran (Juta Rupiah)';
      case 'affiliators':
        return 'Jumlah Affiliator';
      default:
        return 'Jumlah Pelanggan';
    }
  };

  const getChartColor = () => {
    switch (selectedMetric) {
      case 'payments':
        return '#8b5cf6';
      case 'affiliators':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola sistem affiliator dan pantau performa bisnis
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-600 text-sm font-medium">
                  {stat.trend}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Performa Bulanan</CardTitle>
              <div className="flex items-center gap-3">
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customers">Pelanggan</SelectItem>
                    <SelectItem value="payments">Pembayaran</SelectItem>
                    <SelectItem value="affiliators">Affiliator</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 Bulan</SelectItem>
                    <SelectItem value="6-months">6 Bulan</SelectItem>
                    <SelectItem value="1-year">1 Tahun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    hide={isSmallScreen}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: getYAxisLabel(), 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      selectedMetric === 'payments' ? `Rp ${(Number(value) * 1000000).toLocaleString('id-ID')}` : value,
                      getYAxisLabel()
                    ]}
                    labelFormatter={(label) => `Bulan: ${label || 'Data'}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={getChartColor()}
                    strokeWidth={3}
                    dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: getChartColor(), strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Affiliators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Affiliator Terbaru
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4" />
              </Button>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari affiliator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAffiliators.map((affiliator, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {affiliator.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {affiliator.customers} pelanggan • {formatCurrency(affiliator.totalEarnings)}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      affiliator.status === 'active' ? 'default' : 
                      affiliator.status === 'pending' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {affiliator.status === 'active' ? 'Aktif' : 
                     affiliator.status === 'pending' ? 'Pending' : 
                     'Tidak Aktif'}
                  </Badge>
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
