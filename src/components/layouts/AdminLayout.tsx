
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { indonesianTexts } from '@/constants/texts';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  CreditCard, 
  Search, 
  ChevronDown, 
  ChevronRight,
  X,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [affiliatorSearchOpen, setAffiliatorSearchOpen] = useState(false);
  const [paymentSearchOpen, setPaymentSearchOpen] = useState(false);
  const [affiliatorSearch, setAffiliatorSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');

  const navigationItems = [
    {
      href: '/admin',
      label: indonesianTexts.navigation.dashboard,
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/admin/add-customer',
      label: indonesianTexts.navigation.addCustomer,
      icon: UserPlus,
      exact: false
    }
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // Mock affiliator data for search functionality
  const mockAffiliators = [
    { uuid: '1', fullName: 'John Doe' },
    { uuid: '2', fullName: 'Jane Smith' },
    { uuid: '3', fullName: 'Bob Johnson' },
  ];

  const filteredAffiliators = mockAffiliators.filter(affiliator =>
    affiliator.fullName.toLowerCase().includes(affiliatorSearch.toLowerCase())
  );

  const filteredPaymentAffiliators = mockAffiliators.filter(affiliator =>
    affiliator.fullName.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <div className="w-280 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-gray-900">Fibernode</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* Static Navigation Items */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href, item.exact)
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Manajemen Affiliator with Search */}
          <div className="space-y-2">
            <button
              onClick={() => setAffiliatorSearchOpen(!affiliatorSearchOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/affiliators')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <span className="font-medium">{indonesianTexts.navigation.manageAffiliator}</span>
              </div>
              {affiliatorSearchOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {affiliatorSearchOpen && (
              <div className="ml-8 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={indonesianTexts.navigation.searchAffiliator}
                    value={affiliatorSearch}
                    onChange={(e) => setAffiliatorSearch(e.target.value)}
                    className="pl-10 pr-8 py-2 text-sm"
                  />
                  {affiliatorSearch && (
                    <button
                      onClick={() => setAffiliatorSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredAffiliators.length > 0 ? (
                    filteredAffiliators.map((affiliator) => (
                      <Link
                        key={affiliator.uuid}
                        to={`/admin/affiliators/${affiliator.uuid}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        {affiliator.fullName}
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {indonesianTexts.navigation.noResults}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Manajemen Pembayaran with Search */}
          <div className="space-y-2">
            <button
              onClick={() => setPaymentSearchOpen(!paymentSearchOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/payments')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">{indonesianTexts.navigation.managePayment}</span>
              </div>
              {paymentSearchOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {paymentSearchOpen && (
              <div className="ml-8 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={indonesianTexts.navigation.searchAffiliator}
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    className="pl-10 pr-8 py-2 text-sm"
                  />
                  {paymentSearch && (
                    <button
                      onClick={() => setPaymentSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredPaymentAffiliators.length > 0 ? (
                    filteredPaymentAffiliators.map((affiliator) => (
                      <Link
                        key={affiliator.uuid}
                        to={`/admin/payments/affiliator/${affiliator.uuid}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        {affiliator.fullName}
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {indonesianTexts.navigation.noResults}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center lg:hidden">
              <span className="text-white font-bold text-sm">F</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {indonesianTexts.navigation.welcome}, {user?.fullName}
            </span>
            <Button
              onClick={logout}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {indonesianTexts.navigation.logout}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
