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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex w-full overflow-hidden">
      {/* Mobile Overlay - only show when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile: Fixed overlay, Desktop: Normal sidebar */}
      <div 
        className={`${
          sidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'w-0 -translate-x-full lg:translate-x-0 lg:w-16'
        } bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 flex-shrink-0 h-screen overflow-hidden fixed lg:relative z-50`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            {sidebarOpen && <span className="ml-3 font-semibold text-gray-900 dark:text-white">Fibernode</span>}
          </div>
        </div>

        {/* Sidebar Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {/* Static Navigation Items */}
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
              </Link>
            ))}

            {/* Affiliator Management with Search */}
            <div className="space-y-2">
              <button
                onClick={handleAffiliatorClick}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/affiliators')
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${!sidebarOpen ? 'justify-center' : 'justify-between'}`}
                title={!sidebarOpen ? 'Affiliator' : ''}
              >
                <div className={`flex items-center ${!sidebarOpen ? '' : ''}`}>
                  <Users className="w-6 h-6 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3 font-medium">Affiliator</span>}
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
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/payments')
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${!sidebarOpen ? 'justify-center' : 'justify-between'}`}
                title={!sidebarOpen ? 'Pembayaran' : ''}
              >
                <div className={`flex items-center ${!sidebarOpen ? '' : ''}`}>
                  <CreditCard className="w-6 h-6 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3 font-medium">Pembayaran</span>}
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
              className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-6 h-6 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Toggle Button - Hidden on small screens */}
      <div className="relative hidden lg:block">
        <Button
          variant="outline"
          size="icon"
          onClick={handleSidebarToggle}
          className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full shadow-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 z-50 ${
            sidebarOpen ? '-left-3' : 'left-5 lg:-left-3'
          } transition-all duration-300`}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
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
            <span className="hidden sm:inline text-gray-700 dark:text-gray-300 text-sm">
              {indonesianTexts.navigation.welcome}, {user?.fullName}
            </span>
            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{indonesianTexts.navigation.logout}</span>
            </Button>
          </div>
        </header>

        {/* Page Content - Scrollable with hidden scrollbar */}
        <main className="flex-1 p-4 sm:p-6 overflow-hidden">
          <div className="max-w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
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
