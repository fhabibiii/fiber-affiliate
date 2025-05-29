
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CreditCard, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { indonesianTexts } from '@/constants/texts';
import { apiService, AdminSummary, StatItem } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedCustomerYear, setSelectedCustomerYear] = useState('2024');
  const [selectedTransferYear, setSelectedTransferYear] = useState('2024');
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [customerStats, setCustomerStats] = useState<StatItem[]>([]);
  const [paymentStats, setPaymentStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const availableYears = ['2024', '2023', '2022', '2025'];

  // Load summary data
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await apiService.getAdminSummary();
        setSummary(data);
      } catch (error) {
        console.error('Failed to load admin summary:', error);
        toast({
          title: "Error",
          description: "Gagal memuat ringkasan admin",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [toast]);

  // Load customer statistics
  useEffect(() => {
    const loadCustomerStats = async () => {
      try {
        const data = await apiService.getCustomerStats(parseInt(selectedCustomerYear));
        setCustomerStats(data);
      } catch (error) {
        console.error('Failed to load customer stats:', error);
        toast({
          title: "Error",
          description: "Gagal memuat statistik pelanggan",
          variant: "destructive"
        });
      }
    };

    loadCustomerStats();
  }, [selectedCustomerYear, toast]);

  // Load payment statistics
  useEffect(() => {
    const loadPaymentStats = async () => {
      try {
        const data = await apiService.getPaymentStats(parseInt(selectedTransferYear));
        setPaymentStats(data);
      } catch (error) {
        console.error('Failed to load payment stats:', error);
        toast({
          title: "Error",
          description: "Gagal memuat statistik pembayaran",
          variant: "destructive"
        });
      }
    };

    loadPaymentStats();
  }, [selectedTransferYear, toast]);

  const statCards = [
    {
      title: 'Total Affiliator',
      value: summary?.totalAffiliators || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Total Pelanggan',
      value: summary?.totalCustomers || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Pembayaran Bulan Ini',
      value: `Rp ${(summary?.totalPaymentThisMonth || 0).toLocaleString('id-ID')}`,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <div className="h-80 w-full flex items-center justify-start">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerStats}>
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
                    dataKey="count" 
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
            <div className="h-80 w-full flex items-center justify-start">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentStats}>
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
                    dataKey="amount" 
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
