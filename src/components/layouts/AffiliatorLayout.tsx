
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { indonesianTexts } from '@/constants/texts';
import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LogoutModal from '@/components/LogoutModal';

const AffiliatorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigationTabs = [
    {
      href: '/affiliator',
      label: indonesianTexts.navigation.customerList,
      exact: true
    },
    {
      href: '/affiliator/payments',
      label: indonesianTexts.navigation.paymentHistory,
      exact: false
    }
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Fibernode</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex relative">
            <div className="flex space-x-8 relative">
              {navigationTabs.map((tab) => (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
                    isActive(tab.href, tab.exact)
                      ? 'text-blue-700 dark:text-blue-400 font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-700 dark:bg-blue-400 transition-all duration-300 ${
                    isActive(tab.href, tab.exact) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>
          </nav>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {indonesianTexts.navigation.welcome}, {user?.fullName}
            </span>
            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {indonesianTexts.navigation.logout}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto py-2">
              {navigationTabs.map((tab) => (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap relative ${
                    isActive(tab.href, tab.exact)
                      ? 'text-blue-700 dark:text-blue-400 font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-700 dark:bg-blue-400 transition-all duration-300 ${
                    isActive(tab.href, tab.exact) ? 'w-full' : 'w-0'
                  }`} />
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AffiliatorLayout;
