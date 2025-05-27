
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { indonesianTexts } from '@/constants/texts';
import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AffiliatorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="h-16 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-gray-900">Fibernode</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-8">
            {navigationTabs.map((tab) => (
              <Link
                key={tab.href}
                to={tab.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(tab.href, tab.exact)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 text-sm">
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
        </div>

        {/* Mobile Navigation Tabs */}
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto py-2">
              {navigationTabs.map((tab) => (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive(tab.href, tab.exact)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
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
    </div>
  );
};

export default AffiliatorLayout;
