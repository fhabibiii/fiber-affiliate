
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { indonesianTexts } from '@/constants/texts';
import { LogOut, Zap } from 'lucide-react';
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
      label: 'Data Pelanggan',
      exact: true
    },
    {
      href: '/affiliator/payments',
      label: 'Histori Pembayaran',
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
    <div className="min-h-screen bg-[#ecf3ff] dark:bg-gray-900 flex flex-col">
      {/* Top Navbar with enhanced shadow */}
      <header className="bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main header */}
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Fibernode Internet</span>
            </div>

            {/* User Info and Logout - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {indonesianTexts.navigation.welcome}, <span className="font-bold text-blue-600 dark:text-blue-400">{user?.fullName}</span>
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

            {/* Logout Button - Mobile */}
            <div className="md:hidden">
              <Button
                onClick={() => setShowLogoutModal(true)}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu with proper spacing */}
      <div className="bg-[#ecf3ff] dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-2 justify-center sm:justify-start">
              {navigationTabs.map((tab) => (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md ${
                    isActive(tab.href, tab.exact)
                      ? 'text-white bg-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content with reduced spacing */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-2 mb-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer with increased height */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2023 Fibernode Internet. All rights reserved.
          </div>
        </div>
      </footer>

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
