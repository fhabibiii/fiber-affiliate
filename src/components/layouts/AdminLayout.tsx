
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { indonesianTexts } from '@/constants/texts';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  CreditCard, 
  Search, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  X,
  LogOut,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LogoutModal from '@/components/LogoutModal';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [affiliatorSearchOpen, setAffiliatorSearchOpen] = useState(false);
  const [paymentSearchOpen, setPaymentSearchOpen] = useState(false);
  const [affiliatorSearch, setAffiliatorSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigationItems = [
    {
      href: '/admin',
      label: indonesianTexts.navigation.dashboard,
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/admin/add-customer',
      label: 'Pelanggan',
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

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAffiliatorClick = () => {
    if (sidebarOpen) {
      setAffiliatorSearchOpen(!affiliatorSearchOpen);
    }
    navigate('/admin/affiliators');
  };

  const handlePaymentClick = () => {
    if (sidebarOpen) {
      setPaymentSearchOpen(!paymentSearchOpen);
    }
    navigate('/admin/payments');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full overflow-hidden">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 relative flex-shrink-0 fixed lg:relative h-screen z-50 lg:z-auto overflow-y-auto`}
        style={{ 
          transform: sidebarOpen ? 'translateX(0)' : window.innerWidth < 1024 ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out, width 0.3s ease-in-out'
        }}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
              <div className="w-8 h-8 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              {sidebarOpen && <span className="font-semibold text-gray-900 dark:text-white">Fibernode</span>}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Static Navigation Items */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href, item.exact)
                  ? sidebarOpen 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-700 dark:border-blue-400'
                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <item.icon className={`${sidebarOpen ? 'w-6 h-6' : 'w-8 h-8'} flex-shrink-0`} />
              {sidebarOpen && <span className="font-medium text-sm lg:text-base">{item.label}</span>}
            </Link>
          ))}

          {/* Affiliator Management with Search */}
          <div className="space-y-2">
            <button
              onClick={handleAffiliatorClick}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/affiliators')
                  ? sidebarOpen 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? 'Affiliator' : ''}
            >
              <div className="flex items-center space-x-3">
                <Users className={`${sidebarOpen ? 'w-6 h-6' : 'w-8 h-8'} flex-shrink-0`} />
                {sidebarOpen && <span className="font-medium text-sm lg:text-base">Affiliator</span>}
              </div>
              {sidebarOpen && (affiliatorSearchOpen ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              ))}
            </button>

            {affiliatorSearchOpen && sidebarOpen && (
              <div className="ml-8 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Cari Affiliator..."
                    value={affiliatorSearch}
                    onChange={(e) => setAffiliatorSearch(e.target.value)}
                    className="pl-10 pr-8 py-2 text-sm"
                  />
                  {affiliatorSearch && (
                    <button
                      onClick={() => setAffiliatorSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                        className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        {affiliator.fullName}
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Tidak ada hasil ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment Management with Search */}
          <div className="space-y-2">
            <button
              onClick={handlePaymentClick}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/payments')
                  ? sidebarOpen 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? 'Pembayaran' : ''}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className={`${sidebarOpen ? 'w-6 h-6' : 'w-8 h-8'} flex-shrink-0`} />
                {sidebarOpen && <span className="font-medium text-sm lg:text-base">Pembayaran</span>}
              </div>
              {sidebarOpen && (paymentSearchOpen ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              ))}
            </button>

            {paymentSearchOpen && sidebarOpen && (
              <div className="ml-8 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Cari Affiliator..."
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    className="pl-10 pr-8 py-2 text-sm"
                  />
                  {paymentSearch && (
                    <button
                      onClick={() => setPaymentSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                        className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        {affiliator.fullName}
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                      Tidak ada hasil ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button in Sidebar */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${!sidebarOpen ? 'justify-center' : ''}`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut className={`${sidebarOpen ? 'w-6 h-6' : 'w-8 h-8'} flex-shrink-0`} />
            {sidebarOpen && <span className="font-medium text-sm lg:text-base">Logout</span>}
          </button>
        </nav>

        {/* Toggle buttons */}
        <div className="fixed top-1/2 transform -translate-y-1/2 z-50" style={{ left: sidebarOpen ? '16rem' : '4rem' }}>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSidebarToggle}
            className="w-6 h-6 rounded-full shadow-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSidebarToggle}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-gray-700 dark:text-gray-300 text-xs lg:text-sm">
              {indonesianTexts.navigation.welcome}, {user?.fullName}
            </span>
            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 flex items-center justify-center"
            >
              <LogOut className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-2" />
              <span className="hidden lg:inline text-xs lg:text-sm">{indonesianTexts.navigation.logout}</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AdminLayout;
